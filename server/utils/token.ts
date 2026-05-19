import jwt from 'jsonwebtoken';
import type { Response, Request } from 'express';
import crypto from 'crypto';

export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'pahadi-basera-access-secure-key';
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'pahadi-basera-refresh-secure-key';

// Ensure this is a stable 32-byte key for AES-256-CBC
const ENCRYPTION_KEY = crypto
  .createHash('sha256')
  .update(process.env.ENCRYPTION_KEY || REFRESH_TOKEN_SECRET)
  .digest();
const IV_LENGTH = 16;

/**
 * Encrypts a string (token)
 */
export const encryptToken = (text: string): string => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
};

/**
 * Decrypts a string (token)
 */
export const decryptToken = (text: string): string => {
  // Handle URL-encoded string just in case
  const decodedText = text.includes('%3A') ? decodeURIComponent(text) : text;
  const textParts = decodedText.split(':');
  const iv = Buffer.from(textParts.shift() as string, 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

/**
 * Hashes a token for secure database storage
 */
export const hashToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

interface UserPayload {
  id: string;
  role: string;
  kycStatus: string;
}

/**
 * Generates both short-lived Access Token and long-lived Refresh Token
 * @param user - The user object containing id, role, and kycStatus
 * @returns { accessToken, refreshToken }
 */
export const generateTokens = (user: UserPayload) => {
  const payload = { userId: user.id, role: user.role, kycStatus: user.kycStatus };

  const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

  return { accessToken, refreshToken };
};

/**
 * Sets the Refresh Token inside a secure HTTP-Only cookie
 * @param res - Express Response object
 * @param token - The refresh token
 */
export const setRefreshTokenCookie = (res: Response, token: string) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Secure in production (HTTPS)
    sameSite: 'lax', // CSRF protection
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
  });
};

/**
 * Fallback manual cookie parser in case express cookie-parser middleware is not used
 * @param req - Express Request object
 * @param name - Name of the cookie to extract
 * @returns Cookie value or null
 */
export const getCookie = (req: Request, name: string): string | null => {
  const cookies = req.headers.cookie;
  if (!cookies) return null;
  const cookieMap = Object.fromEntries(
    cookies.split(';').map(c => c.trim().split('='))
  );
  const value = cookieMap[name];
  return value ? decodeURIComponent(value) : null;
};
