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
  Image as ImageIcon
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
  const [amenitiesInput, setAmenitiesInput] = useState('');
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
    setLatitude('30.0');
    setLongitude('79.0');
    setBedrooms('1');
    setBathrooms('1');
    setMaxGuests('2');
    setAbout('');
    setSpace('');
    setRules('');
    setCancellationPolicy('');
    setPetsAllowed(false);
    setSmokingPolicy('');
    setSecurityDeposit('0');
    setSelfCheckIn('');
    setCheckInTime('2:00 PM');
    setCheckOutTime('11:00 AM');
    setAmenitiesInput('Wi-Fi, Hot Water, Mountain View');
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
    setAltitude(p.altitude.toString());
    setLatitude(p.latitude.toString());
    setLongitude(p.longitude.toString());
    setBedrooms((p.bedrooms || 1).toString());
    setBathrooms((p.bathrooms || 1).toString());
    setMaxGuests((p.maxGuests || 1).toString());
    setAbout(p.about || '');
    setSpace(p.space || '');
    setRules(p.rules || '');
    setCancellationPolicy(p.cancellationPolicy || '');
    setPetsAllowed(p.petsAllowed || false);
    setSmokingPolicy(p.smokingPolicy || '');
    setSecurityDeposit((p.securityDeposit || 0).toString());
    setSelfCheckIn(p.selfCheckIn || '');
    setCheckInTime(p.checkInTime || '2:00 PM');
    setCheckOutTime(p.checkOutTime || '11:00 AM');
    setAmenitiesInput(p.amenities ? p.amenities.join(', ') : '');
    setImagesInput(p.images ? p.images.map(img => img.url).join('\n') : '');
    setIsOpenForm(true);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !locationName || !basePrice || !altitude) {
      toast.error('Please fill in all mandatory fields.');
      return;
    }

    const token = localStorage.getItem('pb_admin_token');
    if (!token) return;

    // Parse image URLs list
    const imageUrls = imagesInput
      .split('\n')
      .map(url => url.trim())
      .filter(url => url.length > 0);

    const parsedAmenities = amenitiesInput
      .split(',')
      .map(a => a.trim())
      .filter(a => a.length > 0);

    const payload = {
      title,
      type,
      location: locationName,
      basePrice: parseFloat(basePrice),
      altitude: parseFloat(altitude),
      latitude: parseFloat(latitude || '30.0'),
      longitude: parseFloat(longitude || '79.0'),
      bedrooms: parseInt(bedrooms),
      bathrooms: parseInt(bathrooms),
      maxGuests: parseInt(maxGuests),
      about,
      space,
      rules,
      cancellationPolicy,
      petsAllowed,
      smokingPolicy,
      securityDeposit: parseFloat(securityDeposit || '0'),
      selfCheckIn,
      checkInTime,
      checkOutTime,
      amenities: parsedAmenities,
      images: imageUrls.map((url, idx) => ({ url, isFeatured: idx === 0, displayOrder: idx }))
    };

    setIsLoading(true);
    try {
      if (editingProperty) {
        // Edit property
        await api.put(`/api/properties/update-property/${editingProperty.id}`, payload);
      } else {
        // Create property
        await api.post('/api/properties/create-property', payload);
      }

      toast.success(editingProperty ? 'Stay updated successfully!' : 'New stay created successfully!');
      setIsOpenForm(false);
      fetchProperties();
    } catch (err: any) {
      toast.error(err.message || 'Error processing stay details');
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
    p.host?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">STAYS MODERATION</h1>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mt-0.5">Approve, create, modify and manage stays catalog</p>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <Button 
            onClick={handleOpenCreateForm}
            className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-xs uppercase tracking-wider py-5 px-5 shadow-[0_4px_15px_rgba(16,185,129,0.25)] cursor-pointer shrink-0"
          >
            <PlusCircle className="w-4 h-4 mr-2" /> Add New Basera
          </Button>

          <div className="relative w-64 hidden md:block">
            <Input
              type="text"
              placeholder="Search stays catalog..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border-gray-200/80 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 rounded-xl pl-9 text-xs transition-all font-sans"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          </div>

          <Button 
            variant="outline" 
            onClick={fetchProperties}
            className="rounded-xl border-gray-200 bg-[#fcfbf9] hover:bg-gray-50 text-gray-600 gap-1.5 font-bold text-xs uppercase tracking-wider py-4 shrink-0 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
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
          className="bg-white border-gray-200/80 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 rounded-xl pl-9 text-xs transition-all font-sans"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
      </div>

      {/* Main Table Card */}
      <Card className="bg-white border-gray-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
        <CardContent className="p-0">
          {isLoading && properties.length === 0 ? (
            <div className="py-24 flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-4" />
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Syncing Mountain Dwellings...</p>
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="py-24 text-center">
              <ShieldAlert className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <h3 className="text-gray-900 font-bold text-xs uppercase tracking-wider mb-1">No dwellings found</h3>
              <p className="text-gray-400 text-[10px]">No properties match the search queries.</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow className="hover:bg-transparent border-gray-100">
                  <TableHead className="text-[9px] font-bold uppercase text-gray-400 tracking-wider pl-6 py-4 w-[80px]">Cover</TableHead>
                  <TableHead className="text-[9px] font-bold uppercase text-gray-400 tracking-wider py-4">Title & Type</TableHead>
                  <TableHead className="text-[9px] font-bold uppercase text-gray-400 tracking-wider py-4">Himalayan Region</TableHead>
                  <TableHead className="text-[9px] font-bold uppercase text-gray-400 tracking-wider py-4">Pricing</TableHead>
                  <TableHead className="text-[9px] font-bold uppercase text-gray-400 tracking-wider py-4 text-center">Status</TableHead>
                  <TableHead className="text-[9px] font-bold uppercase text-gray-400 tracking-wider pr-6 py-4 text-right">Moderation & Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProperties.map((p) => {
                  const defaultImg = p.images && p.images.length > 0 
                    ? p.images[0].url 
                    : 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=200&auto=format&fit=crop';
                  return (
                    <TableRow key={p.id} className="hover:bg-gray-50/50 transition-colors border-gray-100">
                      {/* Image Thumbnail */}
                      <TableCell className="pl-6 py-4">
                        <div className="w-14 h-11 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 relative shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={defaultImg} 
                            alt={p.title}
                            className="w-full h-full object-cover transition-transform hover:scale-110 duration-500"
                          />
                        </div>
                      </TableCell>

                      {/* Title & Type */}
                      <TableCell className="py-4 font-bold text-gray-900 text-xs">
                        <div className="flex items-center gap-1.5">
                          {p.title}
                          <a href={`/properties/${p.id}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-emerald-600 transition-colors">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                        <div className="text-[9px] font-extrabold text-emerald-600 mt-1 uppercase tracking-wider">{p.type}</div>
                      </TableCell>

                      {/* Location & Altitude */}
                      <TableCell className="py-4 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span>{p.location || 'Unknown'}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                          <Mountain className="w-3 h-3 text-gray-400 shrink-0" />
                          <span>{p.altitude} MASL</span>
                        </div>
                      </TableCell>

                      {/* Price */}
                      <TableCell className="py-4 text-xs text-gray-800">
                        <div className="font-extrabold">{formatCurrency(p.basePrice)}</div>
                        <div className="text-[9px] text-gray-400 uppercase tracking-wider font-semibold mt-0.5">per night stay</div>
                      </TableCell>

                      {/* Status Badge */}
                      <TableCell className="py-4 text-center">
                        {p.isActive ? (
                          <Badge className="bg-emerald-50 text-emerald-800 border-emerald-100 hover:bg-emerald-50">Active</Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-100">Inactive</Badge>
                        )}
                      </TableCell>

                      {/* Moderation & Edit/Delete Actions */}
                      <TableCell className="pr-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Publish/Unpublish toggle */}
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={updatingId === p.id}
                            onClick={() => handleToggleActive(p.id, p.isActive)}
                            className={`rounded-lg font-bold text-[10px] uppercase tracking-widest px-2.5 py-1.5 h-8 transition-all cursor-pointer ${
                              p.isActive 
                                ? 'bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100 hover:text-amber-700' 
                                : 'bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700'
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

                          {/* Edit button */}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenEditForm(p)}
                            className="bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 rounded-lg p-1.5 h-8 w-8 cursor-pointer"
                            title="Edit Stay"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </Button>

                          {/* Delete button */}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenDelete(p)}
                            className="bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-200 rounded-lg p-1.5 h-8 w-8 cursor-pointer"
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

      {/* CRUD Creation / Edit Modal Dialog */}
      <Dialog open={isOpenForm} onOpenChange={setIsOpenForm}>
        <DialogContent className="sm:max-w-2xl bg-white border border-gray-200 rounded-2xl shadow-2xl p-6 font-sans max-h-[90vh] overflow-y-auto">
          <DialogHeader className="border-b border-gray-100 pb-4">
            <DialogTitle className="text-base font-extrabold tracking-wider text-gray-900 uppercase">
              {editingProperty ? `Modify Stay: ${editingProperty.title}` : 'List New Himalayan Basera'}
            </DialogTitle>
            <DialogDescription className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
              Define homestay parameters matching schema requirements
            </DialogDescription>
          </DialogHeader>

          {/* Step Progress Bar Indicator */}
          <div className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 select-none mb-6">
            {[1, 2, 3, 4].map((step) => (
              <div 
                key={step} 
                onClick={() => setFormStep(step)}
                className="flex items-center gap-2 cursor-pointer group"
                title={`Jump to step ${step}`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black font-sans border transition-all ${
                  formStep === step
                    ? 'bg-emerald-500 text-white border-emerald-600 shadow-md shadow-emerald-500/20'
                    : formStep > step
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700 font-extrabold group-hover:bg-emerald-100'
                      : 'bg-white border-gray-200 text-gray-400 group-hover:border-gray-300'
                }`}>
                  {step}
                </div>
                <span className={`text-[9px] uppercase tracking-wider font-extrabold transition-colors ${
                  formStep === step ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-600'
                }`}>
                  {step === 1 ? 'Core Specs' : step === 2 ? 'Overview & Geo' : step === 3 ? 'Policies' : 'Media Gallery'}
                </span>
                {step < 4 && <div className="w-6 h-[1px] bg-gray-200 mx-1 hidden sm:block" />}
              </div>
            ))}
          </div>

          <form 
            onSubmit={handleSubmitForm} 
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
                e.preventDefault();
              }
            }}
            className="space-y-6 text-xs"
          >
            {/* Step 1: General Specs */}
            <div className={formStep === 1 ? "space-y-4" : "hidden"}>
              <h3 className="font-extrabold text-[10px] text-emerald-600 uppercase tracking-widest border-b border-emerald-100 pb-1.5">1. General Specifications</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] tracking-wider uppercase font-bold text-gray-500">Stay Title *</label>
                  <Input 
                    type="text" 
                    value={title} 
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. Oakwood Premium Chalet"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] tracking-wider uppercase font-bold text-gray-500">Property Type *</label>
                  <select 
                    value={type} 
                    onChange={e => setType(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg p-2.5 bg-white text-xs text-gray-800 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="RESORT">Resort</option>
                    <option value="VILLAS">Villa</option>
                    <option value="CASTLE">Castle</option>
                    <option value="HOMESTAYS">Homestay</option>
                    <option value="COTTAGE">Cottage</option>
                    <option value="GUEST_HOUSE">Guest House</option>
                    <option value="APARTMENT">Apartment</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] tracking-wider uppercase font-bold text-gray-500">Location/Region *</label>
                  <Input 
                    type="text" 
                    value={locationName} 
                    onChange={e => setLocationName(e.target.value)}
                    placeholder="e.g. Chopta, Uttarakhand"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] tracking-wider uppercase font-bold text-gray-500">Base Price (Per Night) *</label>
                  <Input 
                    type="number" 
                    value={basePrice} 
                    onChange={e => setBasePrice(e.target.value)}
                    placeholder="INR e.g. 6500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] tracking-wider uppercase font-bold text-gray-500">MASL Altitude (Meters) *</label>
                  <Input 
                    type="number" 
                    value={altitude} 
                    onChange={e => setAltitude(e.target.value)}
                    placeholder="e.g. 2680"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] tracking-wider uppercase font-bold text-gray-500">Bedrooms</label>
                  <Input 
                    type="number" 
                    value={bedrooms} 
                    onChange={e => setBedrooms(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] tracking-wider uppercase font-bold text-gray-500">Bathrooms</label>
                  <Input 
                    type="number" 
                    value={bathrooms} 
                    onChange={e => setBathrooms(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] tracking-wider uppercase font-bold text-gray-500">Max Guests</label>
                  <Input 
                    type="number" 
                    value={maxGuests} 
                    onChange={e => setMaxGuests(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Coordinates & Overview */}
            <div className={formStep === 2 ? "space-y-4" : "hidden"}>
              <h3 className="font-extrabold text-[10px] text-emerald-600 uppercase tracking-widest border-b border-emerald-100 pb-1.5">2. Coordinates & Overview</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] tracking-wider uppercase font-bold text-gray-500">Latitude</label>
                  <Input 
                    type="number" 
                    step="0.000001" 
                    value={latitude} 
                    onChange={e => setLatitude(e.target.value)}
                    placeholder="e.g. 30.4853"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] tracking-wider uppercase font-bold text-gray-500">Longitude</label>
                  <Input 
                    type="number" 
                    step="0.000001" 
                    value={longitude} 
                    onChange={e => setLongitude(e.target.value)}
                    placeholder="e.g. 79.2154"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] tracking-wider uppercase font-bold text-gray-500">Short Summary (About) *</label>
                <Textarea 
                  value={about} 
                  onChange={e => setAbout(e.target.value)}
                  placeholder="Summary displayed on listing index page..."
                  rows={3}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] tracking-wider uppercase font-bold text-gray-500">Space Layout & Description</label>
                <Textarea 
                  value={space} 
                  onChange={e => setSpace(e.target.value)}
                  placeholder="Describe rooms layout, bohemian styled, balcony details..."
                  rows={3}
                />
              </div>
            </div>

            {/* Step 3: Policies & Amenities */}
            <div className={formStep === 3 ? "space-y-4" : "hidden"}>
              <h3 className="font-extrabold text-[10px] text-emerald-600 uppercase tracking-widest border-b border-emerald-100 pb-1.5">3. Amenities, Policies & Media</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] tracking-wider uppercase font-bold text-gray-500">Amenities (comma-separated)</label>
                  <Input 
                    type="text" 
                    value={amenitiesInput} 
                    onChange={e => setAmenitiesInput(e.target.value)}
                    placeholder="Wi-Fi, Heating, Fireplace, Telescope"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] tracking-wider uppercase font-bold text-gray-500">Refundable Security Deposit (INR)</label>
                  <Input 
                    type="number" 
                    value={securityDeposit} 
                    onChange={e => setSecurityDeposit(e.target.value)}
                    placeholder="e.g. 3000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] tracking-wider uppercase font-bold text-gray-500">Self Check-In Guidelines</label>
                  <Input 
                    type="text" 
                    value={selfCheckIn} 
                    onChange={e => setSelfCheckIn(e.target.value)}
                    placeholder="e.g. Keybox lock code"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] tracking-wider uppercase font-bold text-gray-500">Check-In Time</label>
                  <Input 
                    type="text" 
                    value={checkInTime} 
                    onChange={e => setCheckInTime(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] tracking-wider uppercase font-bold text-gray-500">Check-Out Time</label>
                  <Input 
                    type="text" 
                    value={checkOutTime} 
                    onChange={e => setCheckOutTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] tracking-wider uppercase font-bold text-gray-500">Smoking Policy</label>
                  <Input 
                    type="text" 
                    value={smokingPolicy} 
                    onChange={e => setSmokingPolicy(e.target.value)}
                    placeholder="e.g. Balcony only, no indoor smoking"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] tracking-wider uppercase font-bold text-gray-500">Cancellation Policy</label>
                  <Input 
                    type="text" 
                    value={cancellationPolicy} 
                    onChange={e => setCancellationPolicy(e.target.value)}
                    placeholder="e.g. 100% refund up to 72 hours before check-in"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 py-1 bg-gray-50 border border-gray-100 rounded-lg px-3 w-fit select-none">
                <input 
                  type="checkbox" 
                  id="petsAllowed" 
                  checked={petsAllowed} 
                  onChange={e => setPetsAllowed(e.target.checked)}
                  className="rounded border-gray-300 text-emerald-500 focus:ring-emerald-500 h-4 w-4 cursor-pointer"
                />
                <label htmlFor="petsAllowed" className="text-[10px] font-bold text-gray-600 uppercase tracking-wider cursor-pointer">Pets Allowed</label>
              </div>
            </div>

            {/* Step 4: Photo Gallery & Media (ImageKit CDN) */}
            <div className={formStep === 4 ? "space-y-4" : "hidden"}>
              <div className="flex items-center justify-between border-b border-emerald-100 pb-1.5">
                <h3 className="font-extrabold text-[10px] text-emerald-600 uppercase tracking-widest flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5" />
                  4. Media & High-Res Photography (ImageKit CDN)
                </h3>
                <span className="text-[10px] text-gray-400 font-semibold">
                  {imagesInput.split('\n').filter(s => s.trim().length > 0).length} photos attached
                </span>
              </div>

              <ImageUploadDropzone
                folder="properties"
                multiple={true}
                maxFiles={10}
                maxSizeMB={15}
                label="Upload Property Photos"
                hint="Drag & drop or click to upload high-res photos directly to ImageKit"
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

              {/* Live Attached Gallery Thumbnails */}
              {imagesInput.split('\n').filter(s => s.trim().length > 0).length > 0 && (
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] uppercase tracking-wider font-bold text-gray-400 block">Current Gallery Photos</span>
                    <span className="text-[9px] text-emerald-600 font-semibold">First image is listing cover</span>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 max-h-48 overflow-y-auto p-1.5 bg-gray-50/70 border border-gray-100 rounded-xl">
                    {imagesInput.split('\n').filter(s => s.trim().length > 0).map((url, idx) => (
                      <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 bg-white group shadow-2xs">
                        <img src={url} alt={`Property photo ${idx + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            const list = imagesInput.split('\n').filter(s => s.trim().length > 0);
                            list.splice(idx, 1);
                            setImagesInput(list.join('\n'));
                          }}
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-gray-900/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 cursor-pointer"
                          title="Remove photo"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        {idx === 0 && (
                          <span className="absolute bottom-1 left-1 bg-emerald-600 text-white text-[8px] font-bold px-1 rounded-sm">Cover</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Direct Raw URLs Fallback */}
              <details className="text-[11px] text-gray-500 pt-1">
                <summary className="cursor-pointer hover:text-gray-700 font-medium">Edit Raw Image URLs</summary>
                <Textarea 
                  value={imagesInput} 
                  onChange={e => setImagesInput(e.target.value)}
                  placeholder="https://ik.imagekit.io/skhds42rl/..."
                  rows={2}
                  className="mt-1 text-xs font-mono"
                />
              </details>
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between items-center border-t border-gray-100 pt-4 mt-6">
              <div>
                {formStep > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setFormStep(prev => prev - 1)}
                    className="rounded-xl border border-gray-200 text-gray-600 font-bold text-xs uppercase tracking-wider py-4 px-5 cursor-pointer"
                  >
                    Back
                  </Button>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setIsOpenForm(false)}
                  className="rounded-xl border border-gray-200 text-gray-450 font-bold text-xs uppercase tracking-wider py-4 px-5 cursor-pointer"
                >
                  Cancel
                </Button>
                
                {formStep < 4 ? (
                  <Button
                    type="button"
                    onClick={() => {
                      if (formStep === 1) {
                        if (!title || !locationName || !basePrice || !altitude) {
                          toast.error('Please fill in all mandatory fields.');
                          return;
                        }
                      }
                      setFormStep(prev => prev + 1);
                    }}
                    className="bg-[#10b981] hover:bg-[#0e9f6e] text-white rounded-xl font-bold text-xs uppercase tracking-wider py-4 px-6 shadow-[0_4px_15px_rgba(16,185,129,0.25)] cursor-pointer"
                  >
                    Next
                  </Button>
                ) : (
                  <Button 
                    type="submit"
                    disabled={isLoading}
                    className="bg-[#10b981] hover:bg-[#0e9f6e] text-white rounded-xl font-bold text-xs uppercase tracking-wider py-4 px-6 shadow-[0_4px_15px_rgba(16,185,129,0.25)] cursor-pointer"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-1.5">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
                      </span>
                    ) : (
                      editingProperty ? 'Save Changes' : 'Create Listing'
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
        <DialogContent className="sm:max-w-md bg-white border border-gray-200 rounded-2xl shadow-2xl p-6 font-sans">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-base font-extrabold tracking-wider text-rose-600 uppercase">
              CONFIRM DWELLING DELETE
            </DialogTitle>
            <DialogDescription className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
              This action is permanent and cannot be undone
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 text-xs text-gray-600 leading-relaxed border-t border-b border-gray-100">
            Are you sure you want to delete <strong className="text-gray-900">{propertyToDelete?.title}</strong>? All booking histories linked to this stay in the database will be permanently affected.
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button 
              onClick={() => setIsOpenDeleteConfirm(false)} 
              variant="ghost"
              className="rounded-xl border border-gray-200 text-gray-600 font-bold text-xs uppercase tracking-wider py-4 px-5 cursor-pointer"
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
