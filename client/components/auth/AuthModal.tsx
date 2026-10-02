'use client';

import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAuth, AuthUser } from '@/hooks/useAuth';
import { Lock, Mail, Phone, User, Compass, Sparkles, Loader2 } from 'lucide-react';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  defaultTab?: 'signin' | 'signup';
  onSuccess?: (user: AuthUser) => void;
}

export default function AuthModal({
  open,
  onOpenChange,
  title = 'Welcome to Pahadi Basera',
  description = 'Sign in or create an explorer account to reserve chalets, trek expeditions, and manage your journeys.',
  defaultTab = 'signin',
  onSuccess,
}: AuthModalProps) {
  const { login, register } = useAuth();
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>(defaultTab);

  // Sign In States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Sign Up States
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) return;

    setIsLoggingIn(true);
    try {
      const user = await login(loginEmail, loginPassword);
      onOpenChange(false);
      onSuccess?.(user);
    } catch {
      // toast is handled in useAuth
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regEmail || !regPassword) return;

    setIsRegistering(true);
    try {
      const user = await register({
        fullName: regName,
        email: regEmail,
        phoneNumber: regPhone,
        password: regPassword,
      });
      onOpenChange(false);
      onSuccess?.(user);
    } catch {
      // toast is handled in useAuth
    } finally {
      setIsRegistering(false);
    }
  };

  const fillQuickCredentials = (email: string, pass: string) => {
    setLoginEmail(email);
    setLoginPassword(pass);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full bg-white/95 backdrop-blur-2xl border border-stone-200/80 rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.2)] text-stone-850">
        
        {/* Header with Mountain Icon */}
        <DialogHeader className="text-center sm:text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#10b981] mb-1 shadow-sm">
            <Compass className="w-6 h-6 animate-pulse" />
          </div>
          <DialogTitle className="text-2xl font-light tracking-tight text-stone-900">
            {title.includes('Pahadi') ? (
              <>Pahadi <span className="font-semibold text-[#10b981]">Basera</span></>
            ) : (
              title
            )}
          </DialogTitle>
          <DialogDescription className="text-xs text-stone-500 font-light leading-relaxed">
            {description}
          </DialogDescription>
        </DialogHeader>

        {/* Tab switchers */}
        <Tabs 
          value={activeTab} 
          onValueChange={(v) => setActiveTab(v as 'signin' | 'signup')} 
          className="mt-4 w-full"
        >
          <TabsList className="grid grid-cols-2 bg-stone-100/80 p-1 rounded-2xl h-11 border border-stone-200/50">
            <TabsTrigger 
              value="signin" 
              className="rounded-xl text-xs font-bold uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:text-stone-900 data-[state=active]:shadow-sm transition-all"
            >
              Sign In
            </TabsTrigger>
            <TabsTrigger 
              value="signup" 
              className="rounded-xl text-xs font-bold uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:text-stone-900 data-[state=active]:shadow-sm transition-all"
            >
              Create Account
            </TabsTrigger>
          </TabsList>

          {/* 1. SIGN IN TAB */}
          <TabsContent value="signin" className="mt-5 space-y-4">
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1.5 text-left">
                <Label className="text-[10px] uppercase font-bold tracking-widest text-stone-500 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#10b981]" /> Email Address
                </Label>
                <Input
                  type="email"
                  placeholder="explorer@pahadibasera.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  className="h-11 rounded-xl bg-stone-50/80 border-stone-200 text-xs focus-visible:ring-[#10b981] font-medium"
                />
              </div>

              <div className="space-y-1.5 text-left">
                <Label className="text-[10px] uppercase font-bold tracking-widest text-stone-500 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#10b981]" /> Password
                </Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                  className="h-11 rounded-xl bg-stone-50/80 border-stone-200 text-xs focus-visible:ring-[#10b981]"
                />
              </div>

              {/* Quick test credentials chips */}
              <div className="pt-1 flex flex-wrap items-center gap-1.5">
                <span className="text-[9px] font-semibold uppercase tracking-wider text-stone-400">Quick fill:</span>
                <button
                  type="button"
                  onClick={() => fillQuickCredentials('guest1@pahadibasera.com', 'password123')}
                  className="text-[10px] bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-2 py-0.5 rounded-full font-medium transition cursor-pointer"
                >
                  Guest Demo (guest1@pahadibasera.com)
                </button>
              </div>

              <Button
                type="submit"
                disabled={isLoggingIn}
                className="w-full h-12 rounded-xl bg-stone-900 hover:bg-[#10b981] text-white text-xs uppercase tracking-widest font-bold border-0 shadow-lg hover:shadow-emerald-500/20 transition-all cursor-pointer mt-2"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
          </TabsContent>

          {/* 2. SIGN UP TAB */}
          <TabsContent value="signup" className="mt-5 space-y-4">
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div className="space-y-1.5 text-left">
                <Label className="text-[10px] uppercase font-bold tracking-widest text-stone-500 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#10b981]" /> Full Name
                </Label>
                <Input
                  type="text"
                  placeholder="Aarav Sharma"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="h-10 rounded-xl bg-stone-50/80 border-stone-200 text-xs focus-visible:ring-[#10b981] font-medium"
                />
              </div>

              <div className="space-y-1.5 text-left">
                <Label className="text-[10px] uppercase font-bold tracking-widest text-stone-500 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#10b981]" /> Email Address
                </Label>
                <Input
                  type="email"
                  placeholder="aarav@mountain.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  required
                  className="h-10 rounded-xl bg-stone-50/80 border-stone-200 text-xs focus-visible:ring-[#10b981] font-medium"
                />
              </div>

              <div className="space-y-1.5 text-left">
                <Label className="text-[10px] uppercase font-bold tracking-widest text-stone-500 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#10b981]" /> Phone Number
                </Label>
                <Input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  className="h-10 rounded-xl bg-stone-50/80 border-stone-200 text-xs focus-visible:ring-[#10b981]"
                />
              </div>

              <div className="space-y-1.5 text-left">
                <Label className="text-[10px] uppercase font-bold tracking-widest text-stone-500 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#10b981]" /> Password
                </Label>
                <Input
                  type="password"
                  placeholder="Create a secure password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  required
                  className="h-10 rounded-xl bg-stone-50/80 border-stone-200 text-xs focus-visible:ring-[#10b981]"
                />
              </div>

              <Button
                type="submit"
                disabled={isRegistering}
                className="w-full h-12 rounded-xl bg-stone-900 hover:bg-[#10b981] text-white text-xs uppercase tracking-widest font-bold border-0 shadow-lg hover:shadow-emerald-500/20 transition-all cursor-pointer mt-3"
              >
                {isRegistering ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="mt-4 pt-3 border-t border-stone-100 text-center">
          <p className="text-[10px] text-stone-400 font-light flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3 text-[#10b981]" /> Slow Travel Sanctuary &bull; 100% Verified Baseras
          </p>
          <p className="text-[10px] text-stone-400 mt-2 font-light">
            Staff & Administrators: Access the <a href="/admin" className="text-stone-600 hover:text-stone-900 underline font-medium">Admin Portal</a>
          </p>
        </div>

      </DialogContent>
    </Dialog>
  );
}
