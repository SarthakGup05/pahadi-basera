'use client';

import React, { useState, useEffect } from 'react';
import { 
  Home, 
  MapPin, 
  User, 
  Mountain, 
  ShieldAlert, 
  ShieldCheck,
  RefreshCw, 
  Search, 
  Loader2, 
  ExternalLink, 
  Edit2, 
  Trash2, 
  PlusCircle, 
  X, 
  Compass, 
  Image as ImageIcon,
  Sparkles,
  Check,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Building2,
  Bed,
  Bath,
  Users,
  CheckCircle2,
  ArrowRight,
  Shield,
  Info,
  Clock,
  Flame,
  CheckCheck
} from 'lucide-react';
import ImageUploadDropzone from '@/components/ui/ImageUploadDropzone';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import api from '@/lib/api';

interface Property {
  id: string;
  title: string;
  type: string;
  location: string;
  altitude: number;
  latitude: number;
  longitude: number;
  basePrice: number;
  isActive: boolean;
  isFeatured: boolean;
  isPopular: boolean;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  about: string;
  space: string;
  rules: string;
  cancellationPolicy: string;
  petsAllowed: boolean;
  smokingPolicy: string;
  securityDeposit: number;
  selfCheckIn: string;
  checkInTime: string;
  checkOutTime: string;
  host: { email: string; phoneNumber: string };
  images: Array<{ url: string; isFeatured?: boolean; displayOrder?: number }>;
  amenities: string[];
}

const PROPERTY_TYPES = [
  { value: 'COTTAGE', label: 'Cottage', desc: 'Wooden chalets & alpine log cabins', icon: Home },
  { value: 'HOMESTAYS', label: 'Homestay', desc: 'Authentic village dwellings & baseras', icon: Mountain },
  { value: 'VILLAS', label: 'Luxury Villa', desc: 'Private luxury Himalayan estates', icon: Sparkles },
  { value: 'RESORT', label: 'Resort', desc: 'Full-service wellness retreats', icon: Compass },
  { value: 'GUEST_HOUSE', label: 'Guest House', desc: 'Traveler & trekker lodge stays', icon: Users },
  { value: 'APARTMENT', label: 'Serviced Apt', desc: 'Serviced high-altitude apartments', icon: Building2 },
  { value: 'CASTLE', label: 'Heritage Castle', desc: 'Historic stone fortresses & havelis', icon: ShieldCheck },
];

const POPULAR_AMENITIES = [
  'Mountain View',
  'High-Speed Wi-Fi',
  '24/7 Hot Water',
  'Fireplace',
  'Stargazing Telescope',
  'Organic Mountain Meals',
  'Free Parking',
  'Room Heater',
  'Bonfire Setup',
  'Yoga Deck',
  'Cedar Balcony',
  'Tea / Coffee Station',
  'Pet Friendly',
  'Chauffeur Transit',
  'Trekking Guides',
  'Work Desk',
  'Private Jacuzzi',
  'Kitchen Access'
];

export default function AdminProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // CRUD Form States
  const [isOpenForm, setIsOpenForm] = useState<boolean>(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [formStep, setFormStep] = useState<number>(1);
  
  // Dialog confirmation states
  const [isOpenDeleteConfirm, setIsOpenDeleteConfirm] = useState<boolean>(false);
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [type, setType] = useState('COTTAGE');
  const [locationName, setLocationName] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [altitude, setAltitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [bedrooms, setBedrooms] = useState('1');
  const [bathrooms, setBathrooms] = useState('1');
  const [maxGuests, setMaxGuests] = useState('2');
  const [about, setAbout] = useState('');
  const [space, setSpace] = useState('');
  const [rules, setRules] = useState('');
  const [cancellationPolicy, setCancellationPolicy] = useState('');
  const [petsAllowed, setPetsAllowed] = useState(false);
  const [smokingPolicy, setSmokingPolicy] = useState('');
  const [securityDeposit, setSecurityDeposit] = useState('0');
  const [selfCheckIn, setSelfCheckIn] = useState('');
  const [checkInTime, setCheckInTime] = useState('2:00 PM');
  const [checkOutTime, setCheckOutTime] = useState('11:00 AM');
  const [amenitiesList, setAmenitiesList] = useState<string[]>([
    'Mountain View', 'High-Speed Wi-Fi', '24/7 Hot Water', 'Room Heater'
  ]);
  const [customAmenity, setCustomAmenity] = useState<string>('');
  const [imagesInput, setImagesInput] = useState('');

  const fetchProperties = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get('/api/admin/properties');
      setProperties(data);
    } catch (err: any) {
      toast.error(err.message || 'Error loading listings');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const q = params.get('q') || params.get('search');
      if (q) setSearchQuery(q);
    }
  }, []);

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    setUpdatingId(id);
    try {
      await api.put(`/api/admin/properties/${id}/toggle-active`);
      setProperties(prev => prev.map(p => p.id === id ? { ...p, isActive: !currentStatus } : p));
      toast.success(currentStatus ? 'Listing unpublished.' : 'Listing published successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Error toggling state');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleOpenCreateForm = () => {
    setEditingProperty(null);
    setFormStep(1);
    setTitle('');
    setType('COTTAGE');
    setLocationName('');
    setBasePrice('');
    setAltitude('');
    setLatitude('30.4853');
    setLongitude('79.2154');
    setBedrooms('1');
    setBathrooms('1');
    setMaxGuests('2');
    setAbout('');
    setSpace('');
    setRules('');
    setCancellationPolicy('100% refund up to 72 hours before check-in');
    setPetsAllowed(false);
    setSmokingPolicy('Balcony only, no indoor smoking');
    setSecurityDeposit('0');
    setSelfCheckIn('Keypad lockbox code provided on day of arrival');
    setCheckInTime('2:00 PM');
    setCheckOutTime('11:00 AM');
    setAmenitiesList(['Mountain View', 'High-Speed Wi-Fi', '24/7 Hot Water', 'Room Heater', 'Fireplace']);
    setCustomAmenity('');
    setImagesInput('');
    setIsOpenForm(true);
  };

  const handleOpenEditForm = (p: Property) => {
    setEditingProperty(p);
    setFormStep(1);
    setTitle(p.title);
    setType(p.type);
    setLocationName(p.location || '');
    setBasePrice(p.basePrice.toString());
    setAltitude(p.altitude ? p.altitude.toString() : '');
    setLatitude((p.latitude || 30.4853).toString());
    setLongitude((p.longitude || 79.2154).toString());
    setBedrooms((p.bedrooms || 1).toString());
    setBathrooms((p.bathrooms || 1).toString());
    setMaxGuests((p.maxGuests || 1).toString());
    setAbout(p.about || '');
    setSpace(p.space || '');
    setRules(p.rules || '');
    setCancellationPolicy(p.cancellationPolicy || '100% refund up to 72 hours before check-in');
    setPetsAllowed(p.petsAllowed || false);
    setSmokingPolicy(p.smokingPolicy || 'Balcony only, no indoor smoking');
    setSecurityDeposit((p.securityDeposit || 0).toString());
    setSelfCheckIn(p.selfCheckIn || '');
    setCheckInTime(p.checkInTime || '2:00 PM');
    setCheckOutTime(p.checkOutTime || '11:00 AM');
    setAmenitiesList(p.amenities && p.amenities.length > 0 ? p.amenities : ['Mountain View', 'High-Speed Wi-Fi']);
    setCustomAmenity('');
    setImagesInput(p.images ? p.images.map(img => img.url).join('\n') : '');
    setIsOpenForm(true);
  };

  const handleToggleAmenity = (item: string) => {
    setAmenitiesList(prev => 
      prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]
    );
  };

  const handleAddCustomAmenity = () => {
    const trimmed = customAmenity.trim();
    if (!trimmed) return;
    if (!amenitiesList.includes(trimmed)) {
      setAmenitiesList(prev => [...prev, trimmed]);
    }
    setCustomAmenity('');
  };

  const handleSetCoverImage = (index: number) => {
    const list = imagesInput.split('\n').map(s => s.trim()).filter(Boolean);
    if (index === 0 || index >= list.length) return;
    const target = list[index];
    list.splice(index, 1);
    list.unshift(target);
    setImagesInput(list.join('\n'));
    toast.success('Cover photo set as primary');
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !locationName.trim() || !basePrice || !altitude) {
      toast.error('Please complete all mandatory fields on Step 1 (Title, Location, Base Price, Altitude).');
      setFormStep(1);
      return;
    }

    const token = localStorage.getItem('pb_admin_token');
    if (!token) {
      toast.error('Admin session expired. Please log in again.');
      return;
    }

    // Parse image URLs list
    const imageUrls = imagesInput
      .split('\n')
      .map(url => url.trim())
      .filter(url => url.length > 0);

    const payload = {
      title: title.trim(),
      type,
      location: locationName.trim(),
      basePrice: parseFloat(basePrice),
      altitude: parseFloat(altitude),
      latitude: parseFloat(latitude || '30.4853'),
      longitude: parseFloat(longitude || '79.2154'),
      bedrooms: parseInt(bedrooms) || 1,
      bathrooms: parseInt(bathrooms) || 1,
      maxGuests: parseInt(maxGuests) || 2,
      about: about.trim(),
      space: space.trim(),
      rules: rules.trim(),
      cancellationPolicy: cancellationPolicy.trim(),
      petsAllowed,
      smokingPolicy: smokingPolicy.trim(),
      securityDeposit: parseFloat(securityDeposit || '0'),
      selfCheckIn: selfCheckIn.trim(),
      checkInTime,
      checkOutTime,
      amenities: amenitiesList,
      images: imageUrls.map((url, idx) => ({ url, isFeatured: idx === 0, displayOrder: idx }))
    };

    setIsLoading(true);
    try {
      if (editingProperty) {
        await api.put(`/api/properties/update-property/${editingProperty.id}`, payload);
      } else {
        await api.post('/api/properties/create-property', payload);
      }

      toast.success(editingProperty ? 'Stay updated successfully!' : 'New stay created successfully!');
      setIsOpenForm(false);
      fetchProperties();
    } catch (err: any) {
      toast.error(err.message || 'Error processing stay details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDelete = (p: Property) => {
    setPropertyToDelete(p);
    setIsOpenDeleteConfirm(true);
  };

  const handleDeleteProperty = async () => {
    if (!propertyToDelete) return;
    setIsLoading(true);
    try {
      await api.delete(`/api/properties/delete-property/${propertyToDelete.id}`);
      toast.success(`Deleted property: ${propertyToDelete.title}`);
      setIsOpenDeleteConfirm(false);
      setProperties(prev => prev.filter(p => p.id !== propertyToDelete.id));
    } catch (err: any) {
      toast.error(err.message || 'Error deleting stay');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProperties = properties.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.host?.email && p.host.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const STEPS = [
    { id: 1, title: 'Stay Identity', subtitle: 'Title, Type & Price', icon: Home },
    { id: 2, title: 'Spaces & Geo', subtitle: 'Rooms, Altitude & Map', icon: Compass },
    { id: 3, title: 'Amenities & Rules', subtitle: 'Features & Policies', icon: Sparkles },
    { id: 4, title: 'Visual Gallery', subtitle: 'ImageKit CDN Media', icon: ImageIcon },
  ];

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-[#121212] border border-stone-200/80 dark:border-[#262626] rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.015)] transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-xl font-black text-stone-900 dark:text-stone-100 tracking-tight uppercase">Stays Catalog Ledger</h1>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">Manage verified Himalayan homestays, private chalets, and luxury lodges</p>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <Button 
            onClick={handleOpenCreateForm}
            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider py-5 px-5 shadow-sm shadow-emerald-500/20 cursor-pointer shrink-0 flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" /> Add New Basera
          </Button>

          <div className="relative w-64 hidden md:block">
            <Input
              type="text"
              placeholder="Search stays by title, region..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-stone-50/70 dark:bg-[#161616]/80 border-stone-200 dark:border-[#262626] focus:bg-white dark:focus:bg-stone-900 focus:border-emerald-500 rounded-xl pl-9 text-xs transition-all font-sans py-4 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
          </div>

          <Button 
            variant="outline" 
            onClick={fetchProperties}
            title="Refresh Ledger"
            className="rounded-xl border-stone-200 dark:border-[#262626] bg-white dark:bg-[#161616] hover:bg-stone-50 dark:hover:bg-[#222222] text-stone-600 dark:text-stone-300 gap-1.5 font-bold text-xs uppercase tracking-wider py-4 shrink-0 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-emerald-600' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Mobile search bar */}
      <div className="relative w-full md:hidden">
        <Input
          type="text"
          placeholder="Search stays catalog..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-white dark:bg-[#161616] border-stone-200 dark:border-[#262626] text-stone-900 dark:text-stone-100 focus:border-emerald-500 rounded-xl pl-9 text-xs py-4"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
      </div>

      {/* Main Table Card */}
      <Card className="bg-white dark:bg-[#121212] border-stone-200/80 dark:border-[#262626] shadow-[0_4px_25px_rgba(0,0,0,0.015)] overflow-hidden rounded-2xl transition-colors">
        <CardContent className="p-0">
          {isLoading && properties.length === 0 ? (
            <div className="py-24 flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-4" />
              <p className="text-xs text-stone-500 font-bold uppercase tracking-wider">Syncing Mountain Dwellings...</p>
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="py-24 text-center">
              <ShieldAlert className="w-10 h-10 text-stone-300 mx-auto mb-3" />
              <h3 className="text-stone-900 font-bold text-xs uppercase tracking-wider mb-1">No dwellings found</h3>
              <p className="text-stone-400 text-xs">No properties match your current search queries.</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-stone-50/70 dark:bg-[#161616]/80 border-b border-stone-100 dark:border-[#262626]">
                <TableRow className="hover:bg-transparent border-stone-100">
                  <TableHead className="text-[10px] font-bold uppercase text-stone-400 tracking-wider pl-6 py-4 w-[80px]">Cover</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase text-stone-400 tracking-wider py-4">Title & Type</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase text-stone-400 tracking-wider py-4">Himalayan Region</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase text-stone-400 tracking-wider py-4">Pricing</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase text-stone-400 tracking-wider py-4 text-center">Status</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase text-stone-400 tracking-wider pr-6 py-4 text-right">Moderation & Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProperties.map((p) => {
                  const defaultImg = p.images && p.images.length > 0 
                    ? p.images[0].url 
                    : 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=200&auto=format&fit=crop';
                  return (
                    <TableRow key={p.id} className="hover:bg-stone-50/40 dark:hover:bg-[#222222]/40 transition-colors border-b border-stone-100/60 dark:border-[#262626]/60">
                      {/* Image Thumbnail */}
                      <TableCell className="pl-6 py-4">
                        <div className="w-14 h-11 rounded-xl overflow-hidden border border-stone-200 bg-stone-100 relative shrink-0 shadow-2xs">
                          <img 
                            src={defaultImg} 
                            alt={p.title}
                            className="w-full h-full object-cover transition-transform hover:scale-110 duration-300"
                          />
                        </div>
                      </TableCell>

                      {/* Title & Type */}
                      <TableCell className="py-4 font-bold text-stone-900 dark:text-stone-100 text-xs">
                        <div className="flex items-center gap-1.5">
                          <span>{p.title}</span>
                          <a href={`/properties/${p.id}`} target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-emerald-600 transition-colors">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                        <div className="text-[9px] font-extrabold text-emerald-600 mt-1 uppercase tracking-wider">{p.type}</div>
                      </TableCell>

                      {/* Location & Altitude */}
                      <TableCell className="py-4 text-xs text-stone-600 dark:text-stone-300">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                          <span>{p.location || 'Unknown'}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1 text-[9px] font-bold text-stone-400 uppercase tracking-widest">
                          <Mountain className="w-3 h-3 text-stone-400 shrink-0" />
                          <span>{p.altitude} MASL</span>
                        </div>
                      </TableCell>

                      {/* Price */}
                      <TableCell className="py-4 text-xs text-stone-800 dark:text-stone-200">
                        <div className="font-extrabold">{formatCurrency(p.basePrice)}</div>
                        <div className="text-[9px] text-stone-400 uppercase tracking-wider font-semibold mt-0.5">per night stay</div>
                      </TableCell>

                      {/* Status Badge */}
                      <TableCell className="py-4 text-center">
                        {p.isActive ? (
                          <Badge className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-50 text-[10px] shadow-[0_0_10px_rgba(16,185,129,0.15)] font-bold">Active</Badge>
                        ) : (
                          <Badge className="bg-stone-100 dark:bg-[#1f1f1f] text-stone-600 dark:text-neutral-400 border border-stone-200 dark:border-[#333333] hover:bg-stone-100 text-[10px] font-medium">Inactive</Badge>
                        )}
                      </TableCell>

                      {/* Moderation & Edit/Delete Actions */}
                      <TableCell className="pr-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={updatingId === p.id}
                            onClick={() => handleToggleActive(p.id, p.isActive)}
                            className={`rounded-lg font-bold text-[10px] uppercase tracking-widest px-2.5 py-1.5 h-8 transition-all cursor-pointer ${
                              p.isActive 
                                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/50 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/50' 
                                : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/50 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50'
                            }`}
                          >
                            {updatingId === p.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : p.isActive ? (
                              'Deactivate'
                            ) : (
                              'Activate'
                            )}
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenEditForm(p)}
                            className="bg-stone-50 dark:bg-[#202020] text-stone-600 dark:text-stone-300 border-stone-200 dark:border-[#2a2a2a] hover:bg-stone-100 dark:hover:bg-[#282828] rounded-lg p-1.5 h-8 w-8 cursor-pointer"
                            title="Edit Stay"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenDelete(p)}
                            className="bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/50 rounded-lg p-1.5 h-8 w-8 cursor-pointer"
                            title="Delete Stay"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Premium Modern 4-Step Creation / Edit Modal Dialog */}
      <Dialog open={isOpenForm} onOpenChange={setIsOpenForm}>
        <DialogContent showCloseButton={false} className="sm:max-w-3xl lg:max-w-4xl w-full p-0 bg-white dark:bg-[#121212] border border-stone-200/90 dark:border-[#262626] text-stone-900 dark:text-stone-100 rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col font-sans transition-colors">
          
          {/* Glowing Top Accent Bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500 shrink-0" />

          {/* Dialog Header */}
          <div className="px-8 pt-6 pb-5 border-b border-stone-100 dark:border-[#262626] shrink-0 bg-stone-50/40 dark:bg-[#161616]/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60 flex items-center justify-center shrink-0 shadow-2xs">
                  <Mountain className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <DialogTitle className="text-lg font-black tracking-tight text-stone-900 dark:text-stone-100">
                      {editingProperty ? `Modify Stay: ${editingProperty.title}` : 'List New Himalayan Basera'}
                    </DialogTitle>
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-100/70 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      {editingProperty ? 'Live Edit' : 'New Listing'}
                    </span>
                  </div>
                  <DialogDescription className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                    Curate a high-altitude sanctuary with verified specifications, amenities & photography
                  </DialogDescription>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpenForm(false)}
                className="w-8 h-8 rounded-full bg-stone-100 dark:bg-[#202020] hover:bg-stone-200 dark:hover:bg-[#282828] text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Interactive Step Navigator Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-5">
              {STEPS.map((s) => {
                const IconComponent = s.icon;
                const isCurrent = formStep === s.id;
                const isPassed = formStep > s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setFormStep(s.id)}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-white dark:bg-[#161616] border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs text-stone-900 dark:text-stone-100'
                        : isPassed
                          ? 'bg-emerald-50/40 dark:bg-emerald-950/30 border-emerald-200/70 dark:border-emerald-800/50 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/50'
                          : 'bg-white/60 dark:bg-[#161616]/40 border-stone-200/70 dark:border-[#262626] text-stone-400 dark:text-stone-500 hover:border-stone-300 dark:hover:border-stone-700'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                      isCurrent
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : isPassed
                          ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                          : 'bg-stone-100 dark:bg-[#202020] text-stone-400 dark:text-neutral-500'
                    }`}>
                      {isPassed ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : s.id}
                    </div>
                    <div className="min-w-0">
                      <p className={`text-xs font-bold truncate leading-tight ${isCurrent ? 'text-stone-900 dark:text-white' : isPassed ? 'text-emerald-900 dark:text-emerald-300' : 'text-stone-500 dark:text-neutral-400'}`}>
                        {s.title}
                      </p>
                      <p className="text-[10px] text-stone-400 truncate mt-0.5">{s.subtitle}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Animated Step Progress Line */}
            <div className="w-full bg-stone-100 h-1 rounded-full mt-3 overflow-hidden">
              <div 
                className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
                style={{ width: `${(formStep / 4) * 100}%` }}
              />
            </div>
          </div>

          {/* Scrollable Form Body */}
          <form 
            onSubmit={handleSubmitForm} 
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
                e.preventDefault();
              }
            }}
            className="flex-1 overflow-y-auto p-8 space-y-6 text-xs"
          >
            {/* Step 1: Stay Identity & Base Pricing */}
            {formStep === 1 && (
              <div className="space-y-6 animate-fade-in">
                
                {/* Title & Category Header */}
                <div className="border-b border-stone-100 dark:border-[#262626] pb-3">
                  <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider flex items-center gap-2">
                    <Home className="w-4 h-4 text-emerald-600" /> 1. Stay Identity & Category
                  </h3>
                  <p className="text-stone-400 dark:text-stone-500 text-[11px] mt-0.5">Primary public listing title, mountain category, and nightly tariff</p>
                </div>

                {/* Title */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">Stay Title *</label>
                  <Input 
                    type="text" 
                    value={title} 
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. Oakwood Alpine Chalet & Glasshouse"
                    className="text-sm py-5 rounded-xl border-stone-200 dark:border-[#2a2a2a] focus:border-emerald-500 bg-stone-50/30 dark:bg-[#161616] focus:bg-white dark:focus:bg-[#181818] text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-600"
                  />
                  <p className="text-[11px] text-stone-400">Make it evocative of Himalayan heritage and serenity</p>
                </div>

                {/* Interactive Property Type Selector Grid */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-700 dark:text-neutral-200 uppercase tracking-wider">Property Architecture Type *</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                    {PROPERTY_TYPES.map((pt) => {
                      const TypeIcon = pt.icon;
                      const isSelected = type === pt.value;
                      return (
                        <div
                          key={pt.value}
                          onClick={() => setType(pt.value)}
                          className={`p-3 rounded-2xl border transition-all cursor-pointer select-none ${
                            isSelected 
                              ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 shadow-xs ring-2 ring-emerald-500/20' 
                              : 'border-stone-200 dark:border-[#262626] hover:border-stone-300 dark:hover:border-stone-700 bg-white dark:bg-[#161616] hover:bg-stone-50/50 dark:hover:bg-[#222222]/40'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isSelected ? 'bg-emerald-600 text-white' : 'bg-stone-100 dark:bg-[#202020] text-stone-600 dark:text-stone-300'}`}>
                              <TypeIcon className="w-4 h-4" />
                            </div>
                            {isSelected && (
                              <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                              </span>
                            )}
                          </div>
                          <p className="font-bold text-xs text-stone-900 dark:text-stone-100">{pt.label}</p>
                          <p className="text-[10px] text-stone-400 line-clamp-1 mt-0.5">{pt.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Location, Pricing & Altitude */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  
                  {/* Location */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Location / Valley *</label>
                    <div className="relative">
                      <Input 
                        type="text" 
                        value={locationName} 
                        onChange={e => setLocationName(e.target.value)}
                        placeholder="e.g. Chopta, Uttarakhand"
                        className="pl-9 py-5 rounded-xl border-stone-200 dark:border-[#2a2a2a] bg-white dark:bg-[#161616] text-stone-900 dark:text-stone-100 text-xs"
                      />
                      <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                    {/* Quick suggestion chips */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {['Chopta', 'Munsiyari', 'Kausani', 'Jibhi', 'Spiti'].map(loc => (
                        <button
                          key={loc}
                          type="button"
                          onClick={() => setLocationName(`${loc}, Uttarakhand`)}
                          className="px-2 py-0.5 rounded-md bg-stone-100 text-[10px] text-stone-600 hover:bg-stone-200 cursor-pointer"
                        >
                          +{loc}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Base Price */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Base Price (Per Night) *</label>
                      {basePrice && (
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                          {formatCurrency(parseFloat(basePrice) || 0)}
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <Input 
                        type="number" 
                        value={basePrice} 
                        onChange={e => setBasePrice(e.target.value)}
                        placeholder="e.g. 6500"
                        className="pl-8 py-5 rounded-xl border-stone-200 dark:border-[#2a2a2a] bg-white dark:bg-[#161616] text-stone-900 dark:text-stone-100 text-xs font-mono font-bold"
                      />
                      <span className="text-stone-400 font-bold absolute left-3 top-1/2 -translate-y-1/2">₹</span>
                    </div>
                    <div className="flex gap-1 pt-1">
                      {['3500', '6500', '11000', '18000'].map(pVal => (
                        <button
                          key={pVal}
                          type="button"
                          onClick={() => setBasePrice(pVal)}
                          className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-[#202020] text-[10px] text-stone-600 dark:text-neutral-300 hover:bg-stone-200 dark:hover:bg-[#2a2a2a] cursor-pointer"
                        >
                          ₹{parseInt(pVal)/1000}k
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Altitude */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700 dark:text-neutral-200 uppercase tracking-wider">Altitude (Meters MASL) *</label>
                    <div className="relative">
                      <Input 
                        type="number" 
                        value={altitude} 
                        onChange={e => setAltitude(e.target.value)}
                        placeholder="e.g. 2680"
                        className="pl-9 py-5 rounded-xl border-stone-200 dark:border-[#2a2a2a] bg-white dark:bg-[#161616] text-stone-900 dark:text-stone-100 text-xs font-mono"
                      />
                      <Mountain className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                    <div className="flex gap-1 pt-1">
                      {[{ m: '1800', lbl: 'Valley' }, { m: '2680', lbl: 'Alpine' }, { m: '3500', lbl: 'High' }].map(alt => (
                        <button
                          key={alt.m}
                          type="button"
                          onClick={() => setAltitude(alt.m)}
                          className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-[#202020] text-[10px] text-stone-600 dark:text-neutral-300 hover:bg-stone-200 dark:hover:bg-[#2a2a2a] cursor-pointer"
                        >
                          {alt.m}m ({alt.lbl})
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* Step 2: Spaces, Capacity & Coordinates */}
            {formStep === 2 && (
              <div className="space-y-6 animate-fade-in">
                
                <div className="border-b border-stone-100 pb-3">
                  <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
                    <Compass className="w-4 h-4 text-emerald-600" /> 2. Space Layout, Capacity & Coordinates
                  </h3>
                  <p className="text-stone-400 text-[11px] mt-0.5">Define guest limits, room setup, GPS coordinates, and storytelling narrative</p>
                </div>

                {/* Counter Steppers */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-stone-50/70 dark:bg-[#161616]/60 border border-stone-200/80 dark:border-[#262626] rounded-2xl p-4">
                  
                  {/* Bedrooms */}
                  <div className="flex items-center justify-between p-3 bg-white dark:bg-[#161616] border border-stone-200/70 dark:border-[#262626] rounded-xl shadow-2xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-[#202020] flex items-center justify-center text-stone-600 dark:text-stone-300">
                        <Bed className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-stone-900">Bedrooms</p>
                        <p className="text-[10px] text-stone-400">Total sleeping rooms</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setBedrooms(prev => Math.max(1, (parseInt(prev) || 1) - 1).toString())}
                        className="w-7 h-7 rounded-lg border border-stone-200 dark:border-[#2a2a2a] bg-white dark:bg-[#161616] flex items-center justify-center hover:bg-stone-100 dark:hover:bg-[#222222] text-stone-600 dark:text-stone-300 active:scale-95 cursor-pointer"
                      >
                        <Minus className="w-3 h-3 text-stone-600" />
                      </button>
                      <span className="w-6 text-center font-bold text-sm text-stone-900">{bedrooms}</span>
                      <button
                        type="button"
                        onClick={() => setBedrooms(prev => ((parseInt(prev) || 1) + 1).toString())}
                        className="w-7 h-7 rounded-lg border border-stone-200 flex items-center justify-center hover:bg-stone-100 active:scale-95 cursor-pointer"
                      >
                        <Plus className="w-3 h-3 text-stone-600" />
                      </button>
                    </div>
                  </div>

                  {/* Bathrooms */}
                  <div className="flex items-center justify-between p-3 bg-white dark:bg-[#161616] border border-stone-200/70 dark:border-[#262626] rounded-xl shadow-2xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-[#202020] flex items-center justify-center text-stone-600 dark:text-stone-300">
                        <Bath className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-stone-900 dark:text-stone-100">Bathrooms</p>
                        <p className="text-[10px] text-stone-400">Private & ensuite</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setBathrooms(prev => Math.max(1, (parseInt(prev) || 1) - 1).toString())}
                        className="w-7 h-7 rounded-lg border border-stone-200 dark:border-[#2a2a2a] bg-white dark:bg-[#161616] flex items-center justify-center hover:bg-stone-100 dark:hover:bg-[#222222] text-stone-600 dark:text-stone-300 active:scale-95 cursor-pointer"
                      >
                        <Minus className="w-3 h-3 text-stone-600 dark:text-stone-300" />
                      </button>
                      <span className="w-6 text-center font-bold text-sm text-stone-900 dark:text-stone-100">{bathrooms}</span>
                      <button
                        type="button"
                        onClick={() => setBathrooms(prev => ((parseInt(prev) || 1) + 1).toString())}
                        className="w-7 h-7 rounded-lg border border-stone-200 dark:border-[#2a2a2a] bg-white dark:bg-[#161616] flex items-center justify-center hover:bg-stone-100 dark:hover:bg-[#222222] text-stone-600 dark:text-stone-300 active:scale-95 cursor-pointer"
                      >
                        <Plus className="w-3 h-3 text-stone-600 dark:text-stone-300" />
                      </button>
                    </div>
                  </div>

                  {/* Max Guests */}
                  <div className="flex items-center justify-between p-3 bg-white dark:bg-[#161616] border border-stone-200/70 dark:border-[#262626] rounded-xl shadow-2xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-[#202020] flex items-center justify-center text-stone-600 dark:text-stone-300">
                        <Users className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-stone-900 dark:text-stone-100">Max Guests</p>
                        <p className="text-[10px] text-stone-400">Total capacity</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setMaxGuests(prev => Math.max(1, (parseInt(prev) || 1) - 1).toString())}
                        className="w-7 h-7 rounded-lg border border-stone-200 dark:border-[#2a2a2a] bg-white dark:bg-[#161616] flex items-center justify-center hover:bg-stone-100 dark:hover:bg-[#222222] text-stone-600 dark:text-stone-300 active:scale-95 cursor-pointer"
                      >
                        <Minus className="w-3 h-3 text-stone-600 dark:text-stone-300" />
                      </button>
                      <span className="w-6 text-center font-bold text-sm text-stone-900 dark:text-stone-100">{maxGuests}</span>
                      <button
                        type="button"
                        onClick={() => setMaxGuests(prev => ((parseInt(prev) || 1) + 1).toString())}
                        className="w-7 h-7 rounded-lg border border-stone-200 dark:border-[#2a2a2a] bg-white dark:bg-[#161616] flex items-center justify-center hover:bg-stone-100 dark:hover:bg-[#222222] text-stone-600 dark:text-stone-300 active:scale-95 cursor-pointer"
                      >
                        <Plus className="w-3 h-3 text-stone-600 dark:text-stone-300" />
                      </button>
                    </div>
                  </div>

                </div>

                {/* GPS Coordinates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Latitude</label>
                    <Input 
                      type="number" 
                      step="0.000001" 
                      value={latitude} 
                      onChange={e => setLatitude(e.target.value)}
                      placeholder="e.g. 30.4853"
                      className="font-mono text-xs py-5 rounded-xl border-stone-200"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Longitude</label>
                      <button
                        type="button"
                        onClick={() => {
                          setLatitude('30.4853');
                          setLongitude('79.2154');
                          toast.info('Applied Central Garhwal coordinates');
                        }}
                        className="text-[10px] text-emerald-600 hover:text-emerald-700 font-semibold cursor-pointer"
                      >
                        Set Central Himalaya Default
                      </button>
                    </div>
                    <Input 
                      type="number" 
                      step="0.000001" 
                      value={longitude} 
                      onChange={e => setLongitude(e.target.value)}
                      placeholder="e.g. 79.2154"
                      className="font-mono text-xs py-5 rounded-xl border-stone-200"
                    />
                  </div>
                </div>

                {/* Overview & About */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Short Summary (About Stay) *</label>
                  <Textarea 
                    value={about} 
                    onChange={e => setAbout(e.target.value)}
                    placeholder="Evocative summary displayed on cards and search results (e.g. Perched on a quiet cedar ridge in Chopta, this wooden chalet features panoramic sunrise views of Chaukhamba peaks...)"
                    rows={3}
                    className="rounded-xl border-stone-200 text-xs p-3 focus:border-emerald-500"
                  />
                </div>

                {/* Space Layout & Architecture */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Space Layout & Architecture Details</label>
                  <Textarea 
                    value={space} 
                    onChange={e => setSpace(e.target.value)}
                    placeholder="Describe interior woodwork, fireplace ambiance, balcony layout, loft bedroom, heated flooring, and viewing decks..."
                    rows={3}
                    className="rounded-xl border-stone-200 text-xs p-3 focus:border-emerald-500"
                  />
                </div>

              </div>
            )}

            {/* Step 3: Interactive Amenity Cloud & House Policies */}
            {formStep === 3 && (
              <div className="space-y-6 animate-fade-in">
                
                <div className="border-b border-stone-100 pb-3">
                  <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600" /> 3. Interactive Amenity Cloud & Policies
                  </h3>
                  <p className="text-stone-400 text-[11px] mt-0.5">Toggle luxury mountain amenities with one click and define house guidelines</p>
                </div>

                {/* Amenity Cloud */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                      Selected Amenities ({amenitiesList.length})
                    </label>
                    <span className="text-[11px] text-emerald-600 font-semibold">
                      Click any pill to toggle on/off
                    </span>
                  </div>

                  {/* Pills Grid */}
                  <div className="flex flex-wrap gap-2 p-4 bg-stone-50/70 dark:bg-[#161616]/60 border border-stone-200/70 dark:border-[#262626] rounded-2xl">
                    {POPULAR_AMENITIES.map((item) => {
                      const isSelected = amenitiesList.includes(item);
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => handleToggleAmenity(item)}
                          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer select-none flex items-center gap-1.5 ${
                            isSelected
                              ? 'bg-emerald-600 text-white shadow-xs shadow-emerald-500/20 ring-1 ring-emerald-700'
                              : 'bg-white dark:bg-[#161616] text-stone-600 dark:text-stone-300 border border-stone-200/80 dark:border-[#2a2a2a]/80 hover:border-stone-300 dark:hover:border-stone-600 hover:bg-stone-50 dark:hover:bg-[#222222]'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          <span>{item}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Amenity Adder */}
                  <div className="flex items-center gap-2 pt-1">
                    <Input 
                      type="text"
                      value={customAmenity}
                      onChange={e => setCustomAmenity(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCustomAmenity();
                        }
                      }}
                      placeholder="Add custom amenity (e.g. Traditional Tandoor Oven, Woodcut Sauna)..."
                      className="rounded-xl border-stone-200 text-xs py-4"
                    />
                    <Button
                      type="button"
                      onClick={handleAddCustomAmenity}
                      className="bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold py-4 px-4 shrink-0 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" /> Add
                    </Button>
                  </div>
                </div>

                {/* Timings & Security Deposit */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Check-In Time</label>
                    <div className="relative">
                      <Input 
                        type="text" 
                        value={checkInTime} 
                        onChange={e => setCheckInTime(e.target.value)}
                        placeholder="2:00 PM"
                        className="pl-9 py-5 rounded-xl border-stone-200 text-xs"
                      />
                      <Clock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Check-Out Time</label>
                    <div className="relative">
                      <Input 
                        type="text" 
                        value={checkOutTime} 
                        onChange={e => setCheckOutTime(e.target.value)}
                        placeholder="11:00 AM"
                        className="pl-9 py-5 rounded-xl border-stone-200 text-xs"
                      />
                      <Clock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Security Deposit (Refundable)</label>
                    <div className="relative">
                      <Input 
                        type="number" 
                        value={securityDeposit} 
                        onChange={e => setSecurityDeposit(e.target.value)}
                        placeholder="0"
                        className="pl-8 py-5 rounded-xl border-stone-200 text-xs font-mono"
                      />
                      <span className="text-stone-400 font-bold absolute left-3 top-1/2 -translate-y-1/2">₹</span>
                    </div>
                  </div>
                </div>

                {/* Self Check-In Guide */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Self Check-In Guidelines</label>
                  <Input 
                    type="text" 
                    value={selfCheckIn} 
                    onChange={e => setSelfCheckIn(e.target.value)}
                    placeholder="e.g. Smart digital keybox on main front deck. Code dispatched via SMS 3 hours prior."
                    className="py-5 rounded-xl border-stone-200 dark:border-[#2a2a2a] bg-white dark:bg-[#161616] text-stone-900 dark:text-white text-xs"
                  />
                </div>

                {/* Policies & Pet Friendly Card */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Cancellation Policy</label>
                    <Input 
                      type="text" 
                      value={cancellationPolicy} 
                      onChange={e => setCancellationPolicy(e.target.value)}
                      placeholder="e.g. 100% refund up to 72 hours before check-in"
                      className="py-5 rounded-xl border-stone-200 text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Smoking Guidelines</label>
                    <Input 
                      type="text" 
                      value={smokingPolicy} 
                      onChange={e => setSmokingPolicy(e.target.value)}
                      placeholder="e.g. Balcony and outdoor bonfire area only"
                      className="py-5 rounded-xl border-stone-200 text-xs"
                    />
                  </div>
                </div>

                {/* Pet Friendly Toggle Card */}
                <div 
                  onClick={() => setPetsAllowed(!petsAllowed)}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer select-none ${
                    petsAllowed 
                      ? 'border-emerald-500 bg-emerald-50/40 ring-1 ring-emerald-500/20' 
                      : 'border-stone-200 dark:border-[#262626] bg-stone-50/50 dark:bg-[#161616]/60 hover:bg-stone-50 dark:hover:bg-[#222222]/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${petsAllowed ? 'bg-emerald-600 text-white' : 'bg-stone-200 text-stone-600'}`}>
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-xs text-stone-900">Pet Friendly Mountain Sanctuary</p>
                      <p className="text-[11px] text-stone-500">Allow travelers to bring furry companions with open garden access</p>
                    </div>
                  </div>
                  <div className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-1 ${petsAllowed ? 'bg-emerald-600' : 'bg-stone-300'}`}>
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${petsAllowed ? 'translate-x-6' : 'translate-x-0'}`} />
                  </div>
                </div>

              </div>
            )}

            {/* Step 4: Photo Gallery & High-Res Visuals */}
            {formStep === 4 && (
              <div className="space-y-6 animate-fade-in">
                
                <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-emerald-600" /> 4. Media & High-Res Photography (ImageKit CDN)
                    </h3>
                    <p className="text-stone-400 text-[11px] mt-0.5">Stream high-resolution Himalayan photography directly to ImageKit CDN storage</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                    {imagesInput.split('\n').filter(s => s.trim().length > 0).length} photos attached
                  </span>
                </div>

                {/* ImageKit Dropzone */}
                <ImageUploadDropzone
                  folder="properties"
                  multiple={true}
                  maxFiles={15}
                  maxSizeMB={20}
                  label="Upload High-Res Property Photos"
                  hint="Drag & drop or click to upload. First uploaded image serves as the public catalog cover."
                  showPreviews={false}
                  onUploadSuccess={(results) => {
                    const newUrls = results.map(r => r.url);
                    setImagesInput(prev => {
                      const existing = prev.split('\n').map(s => s.trim()).filter(Boolean);
                      const combined = Array.from(new Set([...existing, ...newUrls]));
                      return combined.join('\n');
                    });
                    toast.success(`Attached ${results.length} ImageKit photos to property`);
                  }}
                />

                {/* Gallery Grid with Reorder/Cover capabilities */}
                {imagesInput.split('\n').filter(s => s.trim().length > 0).length > 0 ? (
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase tracking-wider font-bold text-stone-700">
                        Current Attached Photos ({imagesInput.split('\n').filter(s => s.trim().length > 0).length})
                      </span>
                      <span className="text-[11px] text-stone-400">
                        Hover any image and click "Set Cover" to make it primary
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-72 overflow-y-auto p-2 bg-stone-50/70 dark:bg-[#161616]/80 border border-stone-200/80 dark:border-[#262626] rounded-2xl">
                      {imagesInput.split('\n').filter(s => s.trim().length > 0).map((url, idx) => (
                        <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-stone-200 dark:border-[#262626] bg-white dark:bg-[#161616] group shadow-2xs">
                          <img src={url} alt={`Property photo ${idx + 1}`} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300" />
                          
                          {/* Top Actions */}
                          <div className="absolute top-1.5 right-1.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={() => {
                                const list = imagesInput.split('\n').filter(s => s.trim().length > 0);
                                list.splice(idx, 1);
                                setImagesInput(list.join('\n'));
                              }}
                              className="w-6 h-6 rounded-full bg-stone-900/80 text-white flex items-center justify-center hover:bg-rose-600 transition-colors cursor-pointer"
                              title="Delete photo"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Cover Badge or Make Cover Action */}
                          {idx === 0 ? (
                            <span className="absolute bottom-1.5 left-1.5 bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                              <Check className="w-2.5 h-2.5 stroke-[3]" /> Cover Photo
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSetCoverImage(idx)}
                              className="absolute bottom-1.5 left-1.5 bg-stone-900/80 hover:bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                            >
                              Set as Cover
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center bg-stone-50/50 dark:bg-[#161616]/40 rounded-2xl border border-dashed border-stone-200 dark:border-[#262626]">
                    <ImageIcon className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                    <p className="text-xs text-stone-500 font-bold uppercase tracking-wider">No photos attached yet</p>
                    <p className="text-[11px] text-stone-400 mt-0.5">Upload photos above to give guests an inspiring preview of the stay</p>
                  </div>
                )}

                {/* Direct Raw URLs Fallback Accordion */}
                <details className="text-xs text-stone-500 pt-2 border-t border-stone-100">
                  <summary className="cursor-pointer hover:text-stone-800 font-bold uppercase tracking-wider text-[10px]">
                    Advanced: Manual Image URLs Fallback
                  </summary>
                  <Textarea 
                    value={imagesInput} 
                    onChange={e => setImagesInput(e.target.value)}
                    placeholder="https://ik.imagekit.io/skhds42rl/... (one per line)"
                    rows={3}
                    className="mt-2 text-xs font-mono rounded-xl border-stone-200 dark:border-[#2a2a2a] bg-white dark:bg-[#161616] text-stone-900 dark:text-white"
                  />
                </details>

              </div>
            )}

            {/* Bottom Form Actions - Sticky Footer */}
            <div className="sticky -bottom-8 -mx-8 -mb-8 px-8 py-4 bg-white/95 dark:bg-[#121212]/95 backdrop-blur-md border-t border-stone-200 dark:border-[#262626] flex items-center justify-between shrink-0 shadow-lg">
              <div className="flex items-center gap-2 text-stone-500">
                <span className="text-xs font-bold text-stone-900">Step {formStep} of 4</span>
                <span className="text-stone-300">•</span>
                <span className="text-xs text-stone-500 hidden sm:inline">{STEPS[formStep - 1].title}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setIsOpenForm(false)}
                  className="rounded-xl border border-stone-200 dark:border-[#2a2a2a] text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 font-bold text-xs uppercase tracking-wider py-4 px-4 cursor-pointer"
                >
                  Cancel
                </Button>
                
                {formStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setFormStep(prev => prev - 1)}
                    className="rounded-xl border border-stone-200 dark:border-[#2a2a2a] text-stone-700 dark:text-stone-300 bg-white dark:bg-[#161616] hover:bg-stone-50 dark:hover:bg-[#222222] font-bold text-xs uppercase tracking-wider py-4 px-4 cursor-pointer flex items-center gap-1.5"
                  >
                    <ChevronLeft className="w-4 h-4" /> Back
                  </Button>
                )}
                
                {formStep < 4 ? (
                  <Button
                    type="button"
                    onClick={() => {
                      if (formStep === 1) {
                        if (!title.trim() || !locationName.trim() || !basePrice || !altitude) {
                          toast.error('Please fill in Title, Location, Base Price and Altitude before advancing.');
                          return;
                        }
                      }
                      setFormStep(prev => prev + 1);
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider py-4 px-6 shadow-sm shadow-emerald-500/20 cursor-pointer flex items-center gap-1.5"
                  >
                    Next: {STEPS[formStep].title} <ChevronRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button 
                    type="submit"
                    disabled={isLoading}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider py-4 px-6 shadow-md shadow-emerald-500/25 cursor-pointer flex items-center gap-2"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-1.5">
                        <Loader2 className="w-4 h-4 animate-spin" /> Saving Listing...
                      </span>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-emerald-200" />
                        {editingProperty ? 'Save & Update Stay' : 'Publish Mountain Stay'}
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert Dialog Modal */}
      <Dialog open={isOpenDeleteConfirm} onOpenChange={setIsOpenDeleteConfirm}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-[#121212] border border-stone-200 dark:border-[#262626] text-stone-900 dark:text-stone-100 rounded-2xl shadow-2xl p-6 font-sans">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-base font-extrabold tracking-wider text-rose-600 dark:text-rose-400 uppercase">
              CONFIRM DWELLING DELETE
            </DialogTitle>
            <DialogDescription className="text-xs uppercase font-bold text-stone-400 dark:text-stone-500 tracking-wider">
              This action is permanent and cannot be undone
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 text-xs text-stone-600 dark:text-stone-300 leading-relaxed border-t border-b border-stone-100 dark:border-[#262626]">
            Are you sure you want to delete <strong className="text-stone-900 dark:text-stone-100">{propertyToDelete?.title}</strong>? All booking histories linked to this stay in the database will be permanently affected.
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button 
              onClick={() => setIsOpenDeleteConfirm(false)} 
              variant="ghost"
              className="rounded-xl border border-stone-200 dark:border-[#262626] text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-[#222222] font-bold text-xs uppercase tracking-wider py-4 px-5 cursor-pointer"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDeleteProperty}
              className="bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold text-xs uppercase tracking-wider py-4 px-6 shadow-[0_4px_15px_rgba(244,63,94,0.25)] cursor-pointer"
            >
              Confirm Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
