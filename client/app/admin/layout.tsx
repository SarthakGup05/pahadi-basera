'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Home, CalendarDays, Compass, Mountain } from 'lucide-react';
import { Toaster, toast } from 'sonner';

// Modular Subcomponents
import AdminLoginForm from '@/components/admin/AdminLoginForm';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import api from '@/lib/api';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loginEmail, setLoginEmail] = useState<string>('admin@pahadibasera.com');
  const [loginPassword, setLoginPassword] = useState<string>('AdminPassword123');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem('pb_admin_token');
    const role = localStorage.getItem('pb_admin_role');
    if (token && role === 'ADMIN') {
      setIsAuthenticated(true);
    }
    setIsLoading(false);

    const handleUnauthorized = () => {
      localStorage.removeItem('pb_admin_token');
      localStorage.removeItem('pb_admin_role');
      setIsAuthenticated(false);
      toast.error('Admin session expired or invalid. Please log in again.');
    };

    window.addEventListener('pb:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('pb:unauthorized', handleUnauthorized);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      toast.error('Please enter email and password');
      return;
    }

    setIsSubmitting(true);
    try {
      const { data } = await api.post('/api/auth/login', {
        email: loginEmail.trim().toLowerCase(),
        password: loginPassword
      });

      const userRole = data.role || data.user?.role;

      if (userRole !== 'ADMIN') {
        throw new Error('Access denied. Super Admin permissions required.');
      }

      localStorage.setItem('pb_admin_token', data.accessToken);
      localStorage.setItem('pb_admin_role', userRole);
      setIsAuthenticated(true);
      toast.success('Access granted. Welcome back, Super Admin!');
    } catch (error: any) {
      toast.error(error.response?.data?.error || error.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('pb_admin_token');
    localStorage.removeItem('pb_admin_role');
    setIsAuthenticated(false);
    toast.success('Successfully logged out');
    router.push('/admin');
  };

  // Nav items configuration
  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Stays Moderation', href: '/admin/properties', icon: Home },
    { name: 'Himalayan Creators', href: '/admin/creators', icon: Mountain },
    { name: 'Booking Ledger', href: '/admin/bookings', icon: CalendarDays },
    { name: 'Package Ledger', href: '/admin/packages', icon: Compass },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fcfbf9] flex items-center justify-center">
        <div className="relative flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin mb-4" />
          <p className="text-[11px] tracking-widest uppercase font-bold text-gray-500 font-sans">Checking Credentials...</p>
        </div>
      </div>
    );
  }

  // Non-authenticated state
  if (!isAuthenticated) {
    return (
      <AdminLoginForm 
        loginEmail={loginEmail}
        setLoginEmail={setLoginEmail}
        loginPassword={loginPassword}
        setLoginPassword={setLoginPassword}
        isSubmitting={isSubmitting}
        handleLogin={handleLogin}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-stone-900 font-sans flex overflow-hidden w-full">
      <Toaster position="top-right" richColors />
      
      {/* Collapsible Sidebar component */}
      <AdminSidebar 
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        pathname={pathname}
        handleLogout={handleLogout}
        navItems={navItems}
      />

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header Component */}
        <AdminHeader pathname={pathname} />

        {/* Dynamic Inner Page Content */}
        <div className="flex-1 overflow-y-auto bg-[#FAFAF9] p-8 lg:p-10">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
