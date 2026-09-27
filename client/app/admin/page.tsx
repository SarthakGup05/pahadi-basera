'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  DollarSign, 
  CalendarDays, 
  Home, 
  Users, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight,
  RefreshCw, 
  Loader2, 
  Compass, 
  Search,
  Filter,
  ArrowRight,
  MapPin,
  Calendar,
  Sparkles,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

interface DashboardStats {
  counters: {
    totalUsers: number;
    activeStays: number;
    totalStays: number;
    bookingsCount: number;
    totalRevenue: number;
    usersByRole: Array<{ role: string; _count: { id: number } }>;
    totalPackages: number;
    activePackages: number;
  };
  monthlyStats: Array<{ month: string; bookings: number; revenue: number }>;
  regionStats: Array<{ name: string; value: number }>;
  typeStats: Array<{ name: string; value: number }>;
  recentBookings: Array<{
    id: string;
    totalCost: number;
    status: string;
    createdAt: string;
    checkIn: string;
    checkOut: string;
    guest: { email: string; phoneNumber: string };
    property: { title: string; location: string };
  }>;
}

// Minimalist, earthy luxury color scheme for charts
const EARTH_TONES = ['#1c1917', '#44403c', '#78716c', '#a8a29e', '#059669', '#d97706'];

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  
  // Interactive Controls
  const [timeRange, setTimeRange] = useState<'6M' | '12M'>('12M');
  const [chartMetric, setChartMetric] = useState<'revenue' | 'bookings'>('revenue');
  const [donutView, setDonutView] = useState<'regions' | 'types'>('regions');
  const [tableSearch, setTableSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchStats = async (isRefresh = false) => {
    if (isRefresh) setIsRefreshing(true);
    else setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('pb_admin_token');
      if (!token) throw new Error('No admin authentication token found.');

      const res = await fetch('http://localhost:5000/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          window.dispatchEvent(new CustomEvent('pb:unauthorized'));
          return;
        }
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.error || 'Failed to fetch dashboard statistics.');
      }

      const data = await res.json();
      setStats(data);
      setLastUpdated(new Date());
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message || 'Error fetching stats');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
    setIsMounted(true);
  }, []);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short'
    });
  };

  const calculateNights = (checkInStr: string, checkOutStr: string) => {
    const diff = new Date(checkOutStr).getTime() - new Date(checkInStr).getTime();
    const nights = Math.round(diff / (1000 * 60 * 60 * 24));
    return nights > 0 ? `${nights}n` : '1n';
  };

  const getStatusPill = (status: string) => {
    switch (status.toUpperCase()) {
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/70">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            Confirmed
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-stone-100 text-stone-700 border border-stone-200">
            <span className="w-1.5 h-1.5 rounded-full bg-stone-500" />
            Completed
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200/70">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Pending
          </span>
        );
    }
  };

  // Filtered monthly stats based on range
  const chartData = useMemo(() => {
    if (!stats?.monthlyStats) return [];
    if (timeRange === '6M') {
      return stats.monthlyStats.slice(-6);
    }
    return stats.monthlyStats;
  }, [stats, timeRange]);

  // Filtered bookings
  const filteredBookings = useMemo(() => {
    if (!stats?.recentBookings) return [];
    return stats.recentBookings.filter((b) => {
      const matchesStatus = statusFilter === 'ALL' || b.status.toUpperCase() === statusFilter;
      const searchLower = tableSearch.toLowerCase();
      const matchesSearch = 
        !tableSearch ||
        b.property.title.toLowerCase().includes(searchLower) ||
        (b.property.location && b.property.location.toLowerCase().includes(searchLower)) ||
        b.guest.email.toLowerCase().includes(searchLower);
      return matchesStatus && matchesSearch;
    });
  }, [stats, statusFilter, tableSearch]);

  const activeDonutData = useMemo(() => {
    if (!stats) return [];
    return donutView === 'regions' ? stats.regionStats : stats.typeStats;
  }, [stats, donutView]);

  if (isLoading) {
    return (
      <div className="h-[65vh] flex flex-col items-center justify-center">
        <Loader2 className="w-6 h-6 text-stone-400 animate-spin mb-3" />
        <p className="text-xs text-stone-500 font-medium tracking-wide">Connecting Himalayan telemetry...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-white border border-stone-200 rounded-2xl p-8 text-center max-w-md mx-auto my-16 shadow-sm">
        <h3 className="text-stone-900 font-bold text-base mb-1.5">Connection Error</h3>
        <p className="text-stone-500 text-xs leading-relaxed mb-6">{error || 'Unable to sync telemetry records.'}</p>
        <Button 
          onClick={() => fetchStats()} 
          className="bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold px-5"
        >
          Retry Connection
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      
      {/* Overview Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-stone-200/60">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-stone-900">
            Executive Ledger & Operations
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Real-time stay bookings, revenue metrics, and inventory moderation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Refresh Action */}
          <button
            onClick={() => fetchStats(true)}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-600 text-xs font-medium transition-all active:scale-95 shadow-xs cursor-pointer disabled:opacity-60"
            title="Refresh database records"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-stone-500 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Syncing...' : 'Sync'}</span>
          </button>

          {/* Quick Create Buttons */}
          <Button 
            asChild
            size="sm"
            className="rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium px-3.5 shadow-xs cursor-pointer"
          >
            <Link href="/admin/properties">
              <Plus className="w-3.5 h-3.5 mr-1" /> Add Stay
            </Link>
          </Button>
        </div>
      </div>

      {/* 5 Minimalist KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Metric 1: Total Revenue */}
        <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-xs hover:border-stone-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500">Gross Revenue</span>
            <div className="w-7 h-7 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold tracking-tight text-stone-900 font-sans">
              {formatCurrency(stats.counters.totalRevenue)}
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-2.5">
            <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              <TrendingUp className="w-3 h-3" /> +14.2%
            </span>
            <span className="text-[11px] text-stone-400">vs last month</span>
          </div>
        </div>

        {/* Metric 2: Stay Bookings */}
        <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-xs hover:border-stone-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500">Stay Bookings</span>
            <div className="w-7 h-7 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center">
              <CalendarDays className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold tracking-tight text-stone-900 font-sans">
              {stats.counters.bookingsCount}
            </span>
            <span className="text-xs text-stone-400 ml-1.5 font-normal">reservations</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2.5">
            <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              <TrendingUp className="w-3 h-3" /> +8.5%
            </span>
            <span className="text-[11px] text-stone-400">conversion</span>
          </div>
        </div>

        {/* Metric 3: Active Properties */}
        <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-xs hover:border-stone-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500">Active Baseras</span>
            <div className="w-7 h-7 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center">
              <Home className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold tracking-tight text-stone-900 font-sans">
              {stats.counters.activeStays}
            </span>
            <span className="text-xs text-stone-400 ml-1.5 font-normal">
              / {stats.counters.totalStays} listed
            </span>
          </div>
          <div className="mt-3">
            <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-600 h-full rounded-full transition-all duration-500" 
                style={{ width: `${(stats.counters.activeStays / (stats.counters.totalStays || 1)) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Metric 4: Packages */}
        <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-xs hover:border-stone-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500">Expeditions</span>
            <div className="w-7 h-7 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center">
              <Compass className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold tracking-tight text-stone-900 font-sans">
              {stats.counters.activePackages}
            </span>
            <span className="text-xs text-stone-400 ml-1.5 font-normal">packages</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2.5">
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-stone-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              100% active catalog
            </span>
          </div>
        </div>

        {/* Metric 5: Total Users */}
        <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-xs hover:border-stone-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500">Community</span>
            <div className="w-7 h-7 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold tracking-tight text-stone-900 font-sans">
              {stats.counters.totalUsers}
            </span>
            <span className="text-xs text-stone-400 ml-1.5 font-normal">accounts</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2.5">
            <span className="text-[11px] text-stone-500 font-medium">
              Hosts, Guides & Guests
            </span>
          </div>
        </div>

      </div>

      {/* Modern Data Visualizations Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Revenue & Volume Trajectory (2 Cols) */}
        <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-xs lg:col-span-2 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-stone-100">
            <div>
              <h2 className="text-sm font-bold text-stone-900 tracking-tight">Revenue & Reservation Trajectory</h2>
              <p className="text-xs text-stone-400 mt-0.5">Historical booking volume and financial yield</p>
            </div>

            <div className="flex items-center gap-2">
              {/* Metric Switcher */}
              <div className="flex items-center p-1 bg-stone-100 rounded-xl text-xs font-medium">
                <button
                  onClick={() => setChartMetric('revenue')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    chartMetric === 'revenue' 
                      ? 'bg-white text-stone-900 font-semibold shadow-xs' 
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  Revenue
                </button>
                <button
                  onClick={() => setChartMetric('bookings')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    chartMetric === 'bookings' 
                      ? 'bg-white text-stone-900 font-semibold shadow-xs' 
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  Bookings
                </button>
              </div>

              {/* Time Range Switcher */}
              <div className="flex items-center p-1 bg-stone-100 rounded-xl text-xs font-medium">
                <button
                  onClick={() => setTimeRange('6M')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    timeRange === '6M' 
                      ? 'bg-white text-stone-900 font-semibold shadow-xs' 
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  6M
                </button>
                <button
                  onClick={() => setTimeRange('12M')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    timeRange === '12M' 
                      ? 'bg-white text-stone-900 font-semibold shadow-xs' 
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  12M
                </button>
              </div>
            </div>
          </div>

          <div className="h-72 w-full pt-6">
            {isMounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <defs>
                    <linearGradient id="curveFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#059669" stopOpacity={0.18}/>
                      <stop offset="100%" stopColor="#059669" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f4" />
                  <XAxis 
                    dataKey="month" 
                    tickLine={false} 
                    axisLine={false} 
                    tick={{ fontSize: 11, fill: '#a8a29e', fontWeight: 500 }} 
                  />
                  <YAxis 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(val) => chartMetric === 'revenue' ? `₹${val / 1000}k` : `${val}`}
                    tick={{ fontSize: 11, fill: '#a8a29e', fontWeight: 500 }} 
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(28, 25, 23, 0.95)', 
                      borderRadius: '14px', 
                      border: '1px solid rgba(255,255,255,0.1)', 
                      color: '#ffffff',
                      fontSize: '12px',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)'
                    }}
                    formatter={(value: any) => [
                      chartMetric === 'revenue' ? formatCurrency(value) : `${value} Stays`,
                      chartMetric === 'revenue' ? 'Revenue' : 'Bookings'
                    ]}
                  />
                  <Area 
                    type="monotone" 
                    dataKey={chartMetric} 
                    stroke="#059669" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#curveFill)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full bg-stone-50 animate-pulse rounded-xl" />
            )}
          </div>
        </div>

        {/* Right: Regional & Stay Type Distribution (1 Col) */}
        <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <div>
              <h2 className="text-sm font-bold text-stone-900 tracking-tight">Inventory Distribution</h2>
              <p className="text-xs text-stone-400 mt-0.5">Properties mapped across territories</p>
            </div>

            {/* View Switcher Tabs */}
            <div className="flex items-center p-1 bg-stone-100 rounded-xl text-xs font-medium">
              <button
                onClick={() => setDonutView('regions')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  donutView === 'regions' 
                    ? 'bg-white text-stone-900 font-semibold shadow-xs' 
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                Valleys
              </button>
              <button
                onClick={() => setDonutView('types')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  donutView === 'types' 
                    ? 'bg-white text-stone-900 font-semibold shadow-xs' 
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                Types
              </button>
            </div>
          </div>

          {/* Donut Chart with Centered Total */}
          <div className="h-52 w-full relative flex items-center justify-center my-2">
            {isMounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={activeDonutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {activeDonutData.map((_, index) => (
                      <Cell key={`donut-${index}`} fill={EARTH_TONES[index % EARTH_TONES.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(28, 25, 23, 0.95)',
                      borderRadius: '12px',
                      border: '0px',
                      color: '#ffffff',
                      fontSize: '11px',
                    }}
                    formatter={(val) => [`${val} Stays`, 'Inventory']}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full bg-stone-50 animate-pulse rounded-xl" />
            )}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none">
              <span className="text-xl font-bold text-stone-900 tracking-tight">{stats.counters.totalStays}</span>
              <span className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold">Baseras</span>
            </div>
          </div>

          {/* Compact Minimal Legend */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 pt-2 border-t border-stone-100 max-h-28 overflow-y-auto">
            {activeDonutData.map((entry, index) => (
              <div key={entry.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 truncate">
                  <span 
                    className="w-2 h-2 rounded-full shrink-0" 
                    style={{ backgroundColor: EARTH_TONES[index % EARTH_TONES.length] }} 
                  />
                  <span className="text-stone-600 truncate text-[11px] font-medium">{entry.name}</span>
                </div>
                <span className="text-stone-400 font-mono text-[11px] ml-1">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Interactive Activity Ledger Table */}
      <div className="bg-white border border-stone-200/80 rounded-2xl shadow-xs overflow-hidden">
        
        {/* Table Controls Header */}
        <div className="p-6 border-b border-stone-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-stone-900 tracking-tight">Recent Reservations</h2>
            <p className="text-xs text-stone-400 mt-0.5">Live booking ledger entries from guests and travelers</p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            {/* Instant Filter Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input 
                type="text" 
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                placeholder="Search stay or guest email..."
                className="pl-8.5 pr-3 py-1.5 text-xs rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-stone-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-400 w-full sm:w-60 transition-colors"
              />
            </div>

            {/* Status Tabs */}
            <div className="flex items-center p-1 bg-stone-100 rounded-xl text-xs font-medium">
              {['ALL', 'CONFIRMED', 'PENDING', 'CANCELLED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer text-[11px] ${
                    statusFilter === st 
                      ? 'bg-white text-stone-900 font-semibold shadow-xs' 
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  {st.charAt(0) + st.slice(1).toLowerCase()}
                </button>
              ))}
            </div>

            {/* Full Ledger Link */}
            <Button 
              asChild
              variant="outline"
              size="sm"
              className="rounded-xl border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-medium px-3"
            >
              <Link href="/admin/bookings">
                Ledger <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50/70 border-b border-stone-100 text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                <th className="py-3.5 pl-6 pr-4">Property</th>
                <th className="py-3.5 px-4">Guest</th>
                <th className="py-3.5 px-4">Schedule</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 pl-4 pr-6 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-stone-400">
                    <p className="font-medium text-stone-600">No matching reservations</p>
                    <p className="text-[11px] mt-0.5">Try clearing filters or search terms.</p>
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-stone-50/60 transition-colors">
                    
                    {/* Property Column */}
                    <td className="py-4 pl-6 pr-4">
                      <div className="font-semibold text-stone-900">{b.property.title}</div>
                      <div className="flex items-center gap-1 text-[11px] text-stone-400 mt-0.5">
                        <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                        <span>{b.property.location || 'Himalayan Ridge'}</span>
                      </div>
                    </td>

                    {/* Guest Column */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-stone-100 text-stone-700 font-semibold text-[10px] flex items-center justify-center shrink-0 border border-stone-200">
                          {b.guest.email.charAt(0).toUpperCase()}
                        </div>
                        <div className="truncate max-w-[200px]">
                          <div className="font-medium text-stone-800 truncate">{b.guest.email}</div>
                          <div className="text-[10px] text-stone-400 font-mono">{b.guest.phoneNumber}</div>
                        </div>
                      </div>
                    </td>

                    {/* Schedule Column */}
                    <td className="py-4 px-4 text-stone-600">
                      <div className="flex items-center gap-1.5 font-medium">
                        <span>{formatDate(b.checkIn)}</span>
                        <span className="text-stone-300">→</span>
                        <span>{formatDate(b.checkOut)}</span>
                      </div>
                      <div className="text-[10px] text-stone-400 mt-0.5">
                        Stay length: <span className="font-semibold text-stone-600">{calculateNights(b.checkIn, b.checkOut)}</span>
                      </div>
                    </td>

                    {/* Amount Column */}
                    <td className="py-4 px-4 font-bold text-stone-900 tabular-nums">
                      {formatCurrency(b.totalCost)}
                    </td>

                    {/* Status Column */}
                    <td className="py-4 pl-4 pr-6 text-right">
                      {getStatusPill(b.status)}
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
