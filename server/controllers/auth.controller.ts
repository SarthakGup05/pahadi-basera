import type { Request, Response } from 'express';
import { prisma } from '../db/prisma..js'; // Import configured prisma instance
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {
  generateTokens,
  setRefreshTokenCookie,
  getCookie,
  REFRESH_TOKEN_SECRET,
  encryptToken,
  decryptToken,
  hashToken
} from '../utils/token.js'; // Import token utility helpers

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, phoneNumber, role } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { phoneNumber }] }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User with this email or phone already exists.' });
    }

    // Hash the password securely
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        phoneNumber,
        role: role || 'GUEST', 
      },
    });

    return res.status(201).json({ message: 'User registered successfully', userId: user.id });
  } catch (error: any) {
    return res.status(500).json({ error: 'Registration failed', details: error.message });
  }
};

export const loginWithPassword = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate access and refresh tokens using utility
    const { accessToken, refreshToken: rawRefreshToken } = generateTokens(user);

    // Hash the raw token for DB storage
    const hashedToken = hashToken(rawRefreshToken);
    
    // Encrypt the token for the client
    const encryptedRefreshToken = encryptToken(rawRefreshToken);

    // Calculate expiration date (7 days from now, matching jwt expiration)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Store in DB
    await prisma.refreshToken.create({
      data: {
        token: hashedToken,
        userId: user.id,
        expiresAt,
        deviceInfo: req.headers['user-agent']?.substring(0, 255), // optional tracking
        ipAddress: req.ip || req.socket.remoteAddress
      }
    });

    // Set refresh token in http-only cookie using utility
    setRefreshTokenCookie(res, encryptedRefreshToken);

    // Send access token and user info in response body
    return res.status(200).json({
      message: 'Login successful',
      accessToken,
      refreshToken: encryptedRefreshToken, // Also send in body as a fallback
      role: user.role
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Login failed', details: error.message });
  }
};

// Refresh Token Handler
export const refresh = async (req: Request, res: Response) => {
  try {
    // Attempt to get encrypted refresh token from cookies first, then body
    const encryptedToken = req.cookies?.refreshToken || getCookie(req, 'refreshToken') || req.body.refreshToken;

    if (!encryptedToken) {
      return res.status(401).json({ error: 'Refresh token not found. Please log in again.' });
    }

    let token: string;
    try {
      token = decryptToken(encryptedToken);
    } catch (e) {
      return res.status(403).json({ error: 'Invalid token format. Please log in again.' });
    }

    // Verify the Refresh Token using the imported secret
    jwt.verify(token, REFRESH_TOKEN_SECRET, async (err: any, decoded: any) => {
      if (err) {
        return res.status(403).json({ error: 'Expired or invalid token signature. Please log in again.' });
      }

      // Check against DB
      const hashedToken = hashToken(token);
      const dbToken = await prisma.refreshToken.findUnique({ where: { token: hashedToken } });

      if (!dbToken || dbToken.revoked || dbToken.expiresAt < new Date()) {
        return res.status(403).json({ error: 'Token has been revoked or expired.' });
      }

      // Fetch user from DB to ensure they still exist and are active
      const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
      if (!user) {
        return res.status(404).json({ error: 'User no longer exists.' });
      }

      // Generate a new set of tokens using utility
      const { accessToken: newAccessToken, refreshToken: rawNewRefreshToken } = generateTokens(user);
      
      const newHashedToken = hashToken(rawNewRefreshToken);
      const newEncryptedToken = encryptToken(rawNewRefreshToken);
      
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      // Rotate token: delete old one and create new one
      await prisma.$transaction([
        prisma.refreshToken.delete({ where: { token: hashedToken } }),
        prisma.refreshToken.create({
          data: {
            token: newHashedToken,
            userId: user.id,
            expiresAt,
            deviceInfo: req.headers['user-agent']?.substring(0, 255),
            ipAddress: req.ip || req.socket.remoteAddress
          }
        })
      ]);

      // Set new encrypted refresh token in http-only cookie using utility
      setRefreshTokenCookie(res, newEncryptedToken);

      return res.status(200).json({
        accessToken: newAccessToken,
        refreshToken: newEncryptedToken // Also return in body
      });
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Token refresh failed', details: error.message });
  }
};
// Add this to the bottom of auth.controller.js

export const getMe = async (req: Request, res: Response) => {
  try {
    // The userId is injected into req.user by the requireAuth middleware
    const userId = (req as any).user?.userId;

    // Fetch the user, but strictly exclude the password hash
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        phoneNumber: true,
        role: true,
        kycStatus: true,
        createdAt: true,
        updatedAt: true,
        // password is deliberately omitted here
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to fetch user profile', details: error.message });
  }
};
// Logout Handler
export const logout = async (req: Request, res: Response) => {
  try {
    const encryptedToken = req.cookies?.refreshToken || getCookie(req, 'refreshToken') || req.body.refreshToken;

    if (encryptedToken) {
      try {
        const token = decryptToken(encryptedToken);
        const hashedToken = hashToken(token);
        
        // Revoke the token by deleting it (or you could set revoked: true)
        await prisma.refreshToken.deleteMany({
          where: { token: hashedToken }
        });
      } catch (e) {
        // If decryption fails, just proceed to clear cookie
        console.error('Logout: Invalid token format', e);
      }
    }

    // Clear the http-only cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (error: any) {
    return res.status(500).json({ error: 'Logout failed', details: error.message });
  }
};
