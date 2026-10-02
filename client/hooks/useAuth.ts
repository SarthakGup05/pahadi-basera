'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';

export interface AuthUser {
  id: string;
  email: string;
  fullName?: string;
  phoneNumber?: string;
  role: string;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadAuthFromStorage = useCallback(() => {
    if (typeof window === 'undefined') return;

    try {
      const storedToken =
        localStorage.getItem('pb_token') ||
        localStorage.getItem('token');

      const storedUser = localStorage.getItem('pb_user');

      if (storedToken) {
        setToken(storedToken);
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          // Fallback minimal user
          setUser({
            id: 'current-user',
            email: 'explorer@pahadibasera.com',
            role: 'GUEST',
          });
        }
      } else {
        setToken(null);
        setUser(null);
      }
    } catch (e) {
      console.error('Error reading auth state from localStorage:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAuthFromStorage();

    const handleAuthChange = () => {
      loadAuthFromStorage();
    };

    window.addEventListener('pb:auth-change', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);

    return () => {
      window.removeEventListener('pb:auth-change', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, [loadAuthFromStorage]);

  const login = async (email: string, password: string): Promise<AuthUser> => {
    setIsLoading(true);
    try {
      const { data } = await api.post('/api/auth/login', { email, password });

      const authToken = data.accessToken;
      if (!authToken) {
        throw new Error('No access token received from authentication server.');
      }

      // Guest login guard: Reject admin credentials here to keep admin & guest authentication separate
      if (data.role === 'ADMIN') {
        throw new Error('Admin credentials detected. Super Admins must sign in separately at the /admin portal.');
      }

      const authUser: AuthUser = data.user || {
        id: data.userId || 'user-' + Date.now(),
        email,
        role: data.role || 'GUEST',
      };

      localStorage.setItem('pb_token', authToken);
      localStorage.setItem('pb_user', JSON.stringify(authUser));

      setToken(authToken);
      setUser(authUser);

      // Notify all tabs / components
      window.dispatchEvent(new Event('pb:auth-change'));
      toast.success(`Welcome back, ${authUser.fullName || authUser.email}!`);
      return authUser;
    } catch (error: any) {
      const errMsg = error.message || 'Authentication failed. Please verify your credentials.';
      toast.error(errMsg);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: {
    email: string;
    password: string;
    phoneNumber?: string;
    fullName?: string;
  }): Promise<AuthUser> => {
    setIsLoading(true);
    try {
      await api.post('/api/auth/register', {
        email: userData.email,
        password: userData.password,
        phoneNumber: userData.phoneNumber || '+91' + Math.floor(1000000000 + Math.random() * 9000000000),
        role: 'GUEST',
      });

      // Automatically log in newly created user
      const loggedUser = await login(userData.email, userData.password);
      return loggedUser;
    } catch (error: any) {
      const errMsg = error.message || 'Failed to create your account.';
      toast.error(errMsg);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('pb_token');
    localStorage.removeItem('token');
    localStorage.removeItem('pb_user');
    setToken(null);
    setUser(null);
    window.dispatchEvent(new Event('pb:auth-change'));
    toast.info('You have logged out.');
  };

  return {
    user,
    token,
    isAuthenticated: Boolean(token),
    isLoading,
    login,
    register,
    logout,
  };
}
