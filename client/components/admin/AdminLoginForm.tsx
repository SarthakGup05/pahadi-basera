'use client';

import React from 'react';
import { Lock, User, Mountain, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Toaster } from 'sonner';

interface AdminLoginFormProps {
  loginEmail: string;
  setLoginEmail: (val: string) => void;
  loginPassword: string;
  setLoginPassword: (val: string) => void;
  isSubmitting: boolean;
  handleLogin: (e: React.FormEvent) => void;
}

export default function AdminLoginForm({
  loginEmail,
  setLoginEmail,
  loginPassword,
  setLoginPassword,
  isSubmitting,
  handleLogin
}: AdminLoginFormProps) {
  return (
    <div className="min-h-screen bg-[#111827] flex items-center justify-center p-4 relative overflow-hidden font-sans w-full">
      <Toaster position="top-center" richColors />
      
      {/* Volumetric Radial Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[600px] h-[600px] bg-emerald-600/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo Heading */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20 mb-3 shadow-[0_8px_30px_rgb(16,185,129,0.1)]">
            <Mountain className="w-6 h-6 text-emerald-400" />
          </div>
          <h1 className="text-xl font-bold tracking-wider text-white uppercase font-sans">Pahadi Basera</h1>
          <p className="text-xs text-gray-400 mt-1 tracking-widest uppercase">Super Admin Portal</p>
        </div>

        <Card className="bg-gray-900/60 backdrop-blur-xl border-gray-800 shadow-2xl relative overflow-hidden">
          {/* Ambient Border Glow */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
          
          <CardHeader className="space-y-1 pt-8 pb-6 px-8">
            <CardTitle className="text-xl font-bold text-white text-center">Protected Access</CardTitle>
            <CardDescription className="text-center text-gray-400 text-xs">
              Enter your credentials to manage stays and bookings.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] tracking-wider uppercase font-bold text-gray-400">Email Address</label>
                <div className="relative">
                  <Input 
                    type="email" 
                    placeholder="admin@pahadibasera.com" 
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="bg-gray-950/80 border-gray-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 text-white rounded-lg pl-3 pr-10 py-5 text-sm transition-all placeholder:text-gray-600"
                    required
                  />
                  <User className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] tracking-wider uppercase font-bold text-gray-400">Password</label>
                <div className="relative">
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="bg-gray-950/80 border-gray-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 text-white rounded-lg pl-3 pr-10 py-5 text-sm transition-all placeholder:text-gray-600"
                    required
                  />
                  <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-5 rounded-lg text-xs uppercase tracking-widest shadow-[0_4px_20px_rgba(16,185,129,0.3)] transition-all duration-300 hover:shadow-[0_6px_25px_rgba(16,185,129,0.4)] disabled:opacity-50 mt-2"
              >
                {isSubmitting ? 'Authenticating...' : 'Unlock Dashboard'}
              </Button>
            </form>

            {/* Seeding credentials tip */}
            <div className="mt-6 flex items-start gap-2.5 bg-emerald-950/20 border border-emerald-900/30 rounded-lg p-3">
              <AlertCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-[10px] leading-relaxed text-emerald-300/80">
                <strong>Super Admin Access Only:</strong> This console is strictly reserved for Pahadi Basera operations. Guests and travelers must use the main site.
              </div>
            </div>

            <div className="mt-5 text-center">
              <a 
                href="/" 
                className="text-xs text-gray-500 hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5 font-medium"
              >
                &larr; Return to Pahadi Basera Public Website
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
