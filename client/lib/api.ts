import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

/**
 * Primary Backend API URL.
 * Defaults to the production Render deployment URL:
 * https://pahadi-basera.onrender.com
 * Can be overridden in .env.local via NEXT_PUBLIC_API_URL.
 */
export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || 'https://pahadi-basera.onrender.com'
).replace(/\/+$/, '');

/**
 * Standardized, production-grade Axios instance for Pahadi Basera client.
 */
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30-second timeout for serverless / cold-start resilience
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/**
 * Request Interceptor:
 * Automatically injects the JWT Bearer token from localStorage
 * (supports 'pb_admin_token', 'pb_token', or 'token').
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token =
        localStorage.getItem('pb_admin_token') ||
        localStorage.getItem('pb_token') ||
        localStorage.getItem('token');

      if (token && config.headers && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response Interceptor:
 * Centralizes error extraction and gracefully handles auth errors.
 */
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; error?: string }>) => {
    // Extract server message or fallback to standard error string
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected error occurred with the server request';

    // Handle token expiration or unauthorized access
    if (typeof window !== 'undefined' && error.response?.status === 401) {
      console.warn('⚠️ 401 Unauthorized received from API:', error.config?.url);
    }

    // Attach human-readable message on error object for downstream catch blocks
    return Promise.reject(new Error(message));
  }
);

export default api;
