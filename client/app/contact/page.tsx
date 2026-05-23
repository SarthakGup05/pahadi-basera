'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Mail, 
  Phone, 
  Clock, 
  Send, 
  CheckCircle2, 
  ArrowLeft,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Banner from '@/components/ui/Banner';

export default function ContactPage() {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Contact Us', isCurrent: true }
  ];

  // Contact Form State Handling
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Bookings',
    message: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = 'Full name is required';
    if (!form.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!form.message.trim()) newErrors.message = 'Message body is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    
    // Emulate premium API transition latency
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setForm({
        name: '',
        email: '',
        phone: '',
        subject: 'Bookings',
        message: ''
      });
    }, 1500);
  };

  return (
    <div className="bg-[#fcfcfc] min-h-screen pb-20 md:pb-32 font-sans text-gray-800 selection:bg-[#10b981]/20 selection:text-[#0e9f6e] relative overflow-hidden">
      
      {/* 0. Volumetric Ambient Backdrops & Dot Overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1.5px,transparent_1.5px)] [background-size:32px_32px] opacity-60" />
        <div className="absolute top-[20%] -left-[10%] w-[800px] h-[800px] bg-emerald-500/5 blur-[140px] rounded-full mix-blend-multiply" />
        <div className="absolute bottom-[10%] -right-[10%] w-[600px] h-[600px] bg-blue-500/5 blur-[120px] rounded-full mix-blend-multiply" />
      </div>

      {/* 1. Cinematic Header Utilizing Reusable Banner */}
      <Banner
        title="Get in touch with the hills"
        subtitle="Have a question about bookings, custom packages, or authentic Himalayan slow living? Drop us a line, and our alpine concierges will respond within 24 hours."
        badge="Concierge Desk"
        bgImage="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1920&auto=format&fit=crop"
        height="md"
        overlayOpacity="medium"
        breadcrumbItems={breadcrumbs}
      >
        <Button
          asChild
          variant="outline"
          className="group/back relative overflow-hidden rounded-full bg-white/5 hover:bg-white/10 text-white backdrop-blur-xl border border-white/20 px-8 h-12 text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg transition-all duration-500 ease-out pointer-events-auto"
        >
          <Link href="/" className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center transition-transform duration-300 group-hover/back:-translate-x-1">
              <ArrowLeft className="w-3 h-3" />
            </div>
            <span className="relative z-10">Back to Home</span>
          </Link>
        </Button>
      </Banner>

      {/* 2. Interactive Contact Grid */}
      <div className="max-w-[1250px] mx-auto px-4 sm:px-6 mt-16 sm:mt-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Glassmorphic Contact Inquiry Form */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="bg-white/80 backdrop-blur-2xl border border-gray-100 rounded-[2.5rem] p-8 sm:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden group/form min-h-[600px] flex flex-col justify-between">
              
              {isSuccess ? (
                // Success Confirmation Overlay Screen
                <div className="flex-1 flex flex-col items-center justify-center text-center py-12 animate-in fade-in zoom-in-95 duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]">
                  <div className="w-24 h-24 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#10b981] mb-8 shadow-[0_10px_40px_rgba(16,185,129,0.15)] relative">
                    <div className="absolute inset-0 rounded-full bg-[#10b981]/10 animate-ping opacity-75" />
                    <div className="absolute inset-[-20px] rounded-full border border-emerald-500/20 animate-spin-slow" />
                    <CheckCircle2 className="w-12 h-12 relative z-10" strokeWidth={1.5} />
                  </div>
                  
                  <span className="text-[10px] font-bold tracking-[0.3em] text-[#10b981] uppercase mb-4 block">Inquiry Dispatched</span>
                  <h3 className="text-4xl font-light text-gray-900 tracking-tight mb-5 leading-[1.1]">
                    Your mountain journey <br />
                    <span className="font-serif italic text-[#10b981]">awaits.</span>
                  </h3>
                  
                  <p className="text-[15px] font-light text-gray-500 leading-relaxed max-w-sm mb-10">
                    We have successfully securely transmitted your details. One of our dedicated alpine concierges will reach out to you within the next 24 hours.
                  </p>
                  
                  <Button 
                    onClick={() => setIsSuccess(false)}
                    variant="outline"
                    className="rounded-full border-gray-200 hover:border-[#10b981] hover:bg-emerald-50 text-gray-600 hover:text-[#10b981] px-8 h-12 text-[10px] tracking-[0.2em] uppercase font-bold transition-all duration-500"
                  >
                    Send Another Inquiry
                  </Button>
                </div>
              ) : (
                // Contact Form Definition
                <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between animate-in fade-in duration-700">
                  <div>
                    <div className="flex items-center gap-2 mb-6 px-4 py-1.5 bg-gray-50 border border-gray-100 rounded-full w-fit">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                      <span className="text-[9px] font-bold tracking-[0.25em] text-gray-500 uppercase">Send a message</span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-light text-gray-900 tracking-tight leading-[1.1] mb-10">
                      How can we guide <br />
                      <span className="font-serif italic text-gray-900 group-hover/form:text-[#10b981] transition-colors duration-500 relative inline-block">
                        your alpine journey?
                        <svg className="absolute w-full h-3 -bottom-1 left-0 text-[#10b981]/20 transform origin-left transition-transform duration-700 ease-out scale-x-0 group-hover/form:scale-x-100" viewBox="0 0 100 12" preserveAspectRatio="none">
                          <path d="M0,10 Q50,0 100,10" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
                        </svg>
                      </span>
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                      {/* Name input */}
                      <div className="flex flex-col gap-2.5">
                        <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 ml-1">Full Name *</label>
                        <input 
                          type="text" 
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Sarthak Gupta"
                          className={`w-full px-5 py-4 rounded-2xl border ${errors.name ? 'border-red-300 bg-red-50/50 focus:ring-red-400/20' : 'border-gray-200 bg-gray-50 focus:border-[#10b981] focus:ring-[#10b981]/10 focus:bg-white'} focus:ring-4 outline-none transition-all duration-500 font-medium text-sm text-gray-900 placeholder-gray-300`}
                        />
                        {errors.name && <span className="text-[10px] text-red-500 font-bold tracking-wide ml-1 animate-in fade-in">{errors.name}</span>}
                      </div>

                      {/* Email input */}
                      <div className="flex flex-col gap-2.5">
                        <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 ml-1">Email Address *</label>
                        <input 
                          type="email" 
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="sarthak@example.com"
                          className={`w-full px-5 py-4 rounded-2xl border ${errors.email ? 'border-red-300 bg-red-50/50 focus:ring-red-400/20' : 'border-gray-200 bg-gray-50 focus:border-[#10b981] focus:ring-[#10b981]/10 focus:bg-white'} focus:ring-4 outline-none transition-all duration-500 font-medium text-sm text-gray-900 placeholder-gray-300`}
                        />
                        {errors.email && <span className="text-[10px] text-red-500 font-bold tracking-wide ml-1 animate-in fade-in">{errors.email}</span>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                      {/* Phone input */}
                      <div className="flex flex-col gap-2.5">
                        <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 ml-1">Phone Number (Optional)</label>
                        <input 
                          type="text" 
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="+91 98765 43210"
                          className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-gray-50 focus:border-[#10b981] focus:ring-4 focus:ring-[#10b981]/10 focus:bg-white outline-none transition-all duration-500 font-medium text-sm text-gray-900 placeholder-gray-300"
                        />
                      </div>

                      {/* Inquiry Type select */}
                      <div className="flex flex-col gap-2.5">
                        <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 ml-1">Inquiry Subject</label>
                        <select 
                          name="subject"
                          value={form.subject}
                          onChange={handleChange}
                          className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-gray-50 focus:border-[#10b981] focus:ring-4 focus:ring-[#10b981]/10 focus:bg-white outline-none transition-all duration-500 font-medium text-sm text-gray-900 cursor-pointer appearance-none"
                          style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%239ca3af%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1em' }}
                        >
                          <option value="Bookings">Homestay Reservation</option>
                          <option value="Packages">Custom Travel Packages</option>
                          <option value="Hosting">Become a Community Host</option>
                          <option value="Other">General Feedback</option>
                        </select>
                      </div>
                    </div>

                    {/* Message input */}
                    <div className="flex flex-col gap-2.5 mb-10">
                      <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 ml-1">Your Message *</label>
                      <textarea 
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        placeholder="Tell us about your upcoming retreat or inquiry..."
                        rows={4}
                        className={`w-full px-5 py-4 rounded-2xl border ${errors.message ? 'border-red-300 bg-red-50/50 focus:ring-red-400/20' : 'border-gray-200 bg-gray-50 focus:border-[#10b981] focus:ring-[#10b981]/10 focus:bg-white'} focus:ring-4 outline-none transition-all duration-500 font-medium text-sm text-gray-900 placeholder-gray-300 resize-none min-h-[140px]`}
                      />
                      {errors.message && <span className="text-[10px] text-red-500 font-bold tracking-wide ml-1 animate-in fade-in">{errors.message}</span>}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-14 bg-zinc-900 hover:bg-[#10b981] text-white font-bold text-[11px] uppercase tracking-[0.2em] rounded-2xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.3)] hover:shadow-[0_15px_40px_-10px_rgba(16,185,129,0.4)] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-1 group/submit flex items-center justify-center gap-3 border-0 pointer-events-auto disabled:opacity-70 disabled:pointer-events-none"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Dispatching Signal...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Inquiry</span>
                        <Send className="w-4 h-4 transition-transform duration-300 group-hover/submit:translate-x-1 group-hover/submit:-translate-y-1" />
                      </>
                    )}
                  </Button>
                </form>
              )}

            </div>
          </div>

          {/* Right Column: Dark Mode Contact Card */}
          <div className="lg:col-span-5 flex flex-col h-full">
            <div className="bg-zinc-950 rounded-[2.5rem] p-10 md:p-12 shadow-2xl relative overflow-hidden group/channels flex-1 flex flex-col">
              
              {/* Volumetric Internal Lighting */}
              <div className="absolute -top-32 -right-32 w-[400px] h-[400px] bg-[#10b981]/20 blur-[100px] rounded-full pointer-events-none transition-opacity duration-700 opacity-60 mix-blend-screen group-hover/channels:opacity-100" />
              <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:24px_24px] opacity-30 pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-10 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full w-fit">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[9px] font-bold tracking-[0.25em] text-zinc-300 uppercase">Sanctuary Details</span>
                </div>
                
                <div className="flex flex-col gap-10">
                  
                  {/* Channel: HQ */}
                  <div className="flex items-start gap-5 group/item">
                    <div className="w-12 h-12 rounded-2xl border border-white/10 flex items-center justify-center text-emerald-400 bg-white/5 shadow-inner flex-shrink-0 transition-all duration-500 group-hover/item:bg-[#10b981] group-hover/item:border-[#10b981] group-hover/item:text-white group-hover/item:scale-110 group-hover/item:-rotate-6">
                      <MapPin className="w-5 h-5" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 pt-1">
                      <span className="block text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500 mb-1.5">Basecamp HQ</span>
                      <span className="block text-[15px] font-light text-zinc-200 leading-relaxed">
                        Ridge Line Estate,<br />
                        Kasar Devi, Almora<br />
                        Uttarakhand, 263601
                      </span>
                    </div>
                  </div>

                  {/* Channel: Phone */}
                  <a href="tel:+919876543210" className="flex items-start gap-5 group/item cursor-pointer">
                    <div className="w-12 h-12 rounded-2xl border border-white/10 flex items-center justify-center text-emerald-400 bg-white/5 shadow-inner flex-shrink-0 transition-all duration-500 group-hover/item:bg-[#10b981] group-hover/item:border-[#10b981] group-hover/item:text-white group-hover/item:scale-110 group-hover/item:-rotate-6">
                      <Phone className="w-5 h-5" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 pt-1">
                      <span className="block text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500 mb-1.5">Direct Line</span>
                      <span className="block text-lg font-light text-zinc-200 hover:text-[#10b981] transition-colors duration-300">
                        +91 98765 43210
                      </span>
                    </div>
                  </a>

                  {/* Channel: Email */}
                  <a href="mailto:hospitality@pahadibasera.com" className="flex items-start gap-5 group/item cursor-pointer">
                    <div className="w-12 h-12 rounded-2xl border border-white/10 flex items-center justify-center text-emerald-400 bg-white/5 shadow-inner flex-shrink-0 transition-all duration-500 group-hover/item:bg-[#10b981] group-hover/item:border-[#10b981] group-hover/item:text-white group-hover/item:scale-110 group-hover/item:-rotate-6">
                      <Mail className="w-5 h-5" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 pt-1">
                      <span className="block text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500 mb-1.5">Electronic Dispatch</span>
                      <span className="block text-[15px] font-light text-zinc-200 hover:text-[#10b981] transition-colors duration-300">
                        hello@pahadibasera.com
                      </span>
                    </div>
                  </a>

                  {/* Channel: Hours */}
                  <div className="flex items-start gap-5 group/item">
                    <div className="w-12 h-12 rounded-2xl border border-white/10 flex items-center justify-center text-emerald-400 bg-white/5 shadow-inner flex-shrink-0 transition-all duration-500 group-hover/item:bg-[#10b981] group-hover/item:border-[#10b981] group-hover/item:text-white group-hover/item:scale-110 group-hover/item:-rotate-6">
                      <Clock className="w-5 h-5" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 pt-1">
                      <span className="block text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500 mb-1.5">Alpine Time</span>
                      <span className="block text-[15px] font-light text-zinc-200 leading-relaxed">
                        9:00 AM — 6:00 PM IST<br />Monday to Saturday
                      </span>
                    </div>
                  </div>

                </div>
              </div>
              
              <div className="mt-auto pt-10 relative z-10">
                <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-8" />
                <p className="text-center text-xs font-light text-zinc-500">
                  For urgent SOS dispatch, ping our WhatsApp line directly.
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>

    </div>
  );
}