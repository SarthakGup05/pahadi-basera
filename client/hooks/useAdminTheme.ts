'use client';

import { useState, useEffect, useCallback } from 'react';

export type AdminTheme = 'light' | 'dark';

export function useAdminTheme() {
  const [theme, setThemeState] = useState<AdminTheme>('dark');
  const [mounted, setMounted] = useState(false);

  const applyThemeToDOM = useCallback((t: AdminTheme) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    const body = document.body;

    if (t === 'dark') {
      root.classList.add('dark');
      body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('pb_admin_theme') as AdminTheme | null;
    const initialTheme: AdminTheme = stored === 'light' ? 'light' : 'dark'; // Default to luxury dark mode
    setThemeState(initialTheme);
    applyThemeToDOM(initialTheme);

    const handleThemeEvent = (e: CustomEvent<AdminTheme>) => {
      if (e.detail && (e.detail === 'light' || e.detail === 'dark')) {
        setThemeState(e.detail);
        applyThemeToDOM(e.detail);
      }
    };

    window.addEventListener('pb:admin-theme', handleThemeEvent as EventListener);
    return () => {
      window.removeEventListener('pb:admin-theme', handleThemeEvent as EventListener);
    };
  }, [applyThemeToDOM]);

  const toggleTheme = useCallback(() => {
    const nextTheme: AdminTheme = theme === 'dark' ? 'light' : 'dark';
    setThemeState(nextTheme);
    localStorage.setItem('pb_admin_theme', nextTheme);
    applyThemeToDOM(nextTheme);
    window.dispatchEvent(new CustomEvent('pb:admin-theme', { detail: nextTheme }));
  }, [theme, applyThemeToDOM]);

  const setTheme = useCallback((t: AdminTheme) => {
    setThemeState(t);
    localStorage.setItem('pb_admin_theme', t);
    applyThemeToDOM(t);
    window.dispatchEvent(new CustomEvent('pb:admin-theme', { detail: t }));
  }, [applyThemeToDOM]);

  return {
    theme,
    isDark: theme === 'dark',
    toggleTheme,
    setTheme,
    mounted
  };
}

export default useAdminTheme;
