'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit2, 
  Compass, 
  MapPin, 
  Clock,
  Flame,
  Sparkles,
  Mountain,
  Calendar,
  Users,
  Loader2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon
} from 'lucide-react';
import ImageUploadDropzone from '@/components/ui/ImageUploadDropzone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { PackageItem } from '@/lib/packagesData';
import api from '@/lib/api';

export default function AdminPackages() {
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // CRUD Form States
  const [isOpenForm, setIsOpenForm] = useState<boolean>(false);
  const [editingPackage, setEditingPackage] = useState<PackageItem | null>(null);
  const [formStep, setFormStep] = useState<number>(1);
  
  // Dialog confirmation states
  const [isOpenDeleteConfirm, setIsOpenDeleteConfirm] = useState<boolean>(false);
  const [packageToDelete, setPackageToDelete] = useState<PackageItem | null>(null);

  // Form Fields State
  const [title, setTitle] = useState('');
  const [region, setRegion] = useState('Uttarakhand');
  const [locationName, setLocationName] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [durationDays, setDurationDays] = useState('1');
  const [vibe, setVibe] = useState('Adventure');
  const [difficulty, setDifficulty] = useState('Easy');
  const [maxGuests, setMaxGuests] = useState('4');
  const [image, setImage] = useState('');
  const [badge, setBadge] = useState('');
  const [description, setDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [altitude, setAltitude] = useState('');
  const [bestTime, setBestTime] = useState('');
  const [amenitiesInput, setAmenitiesInput] = useState('');

  // Includes Checkboxes
  const [includeTransit, setIncludeTransit] = useState(true);
  const [includeMeals, setIncludeMeals] = useState(true);
  const [includeShelter, setIncludeShelter] = useState(true);
  const [includeGuide, setIncludeGuide] = useState(true);

  // Itinerary Builder
  const [itinerary, setItinerary] = useState<{ day: number; title: string; desc: string }[]>([
    { day: 1, title: '', desc: '' }
  ]);

  const fetchPackages = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get('/api/packages/admin/all');
      setPackages(data);
    } catch (err: any) {
      toast.error(err.message || 'Error loading packages');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    setUpdatingId(id);
    try {
      const { data } = await api.put(`/api/packages/toggle-active/${id}`);
      setPackages(prev => prev.map(p => p.id === id ? { ...p, isActive: data.isActive } : p));
      toast.success(currentStatus ? 'Package set to inactive.' : 'Package published successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Error toggling package state');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleOpenCreateForm = () => {
    setEditingPackage(null);
    setFormStep(1);
    setTitle('');
    setRegion('Uttarakhand');
    setLocationName('');
    setPrice('');
    setDuration('4 Days / 3 Nights');
    setDurationDays('4');
    setVibe('Adventure');
    setDifficulty('Moderate');
    setMaxGuests('6');
    setImage('https://images.unsplash.com/photo-1589136777351-fd6e473e09a5?q=80&w=800&auto=format&fit=crop');
    setBadge('Alpine Special');
    setDescription('Conquer high peaks and experience slow living...');
    setLongDescription('Embark on an epic adventure through mountain trails, alpine meadows, and cedar forest paths...');
    setAltitude('3,500m');
    setBestTime('Sep to Nov');
    setAmenitiesInput('Professional Guide, Organic Meals, Warm Stay');
    setIncludeTransit(true);
    setIncludeMeals(true);
    setIncludeShelter(true);
    setIncludeGuide(true);
    setItinerary([
      { day: 1, title: 'Arrival & Basecamp Setup', desc: 'Arrive at the base camp, settle into tents, and enjoy dinner by the woodfire.' },
      { day: 2, title: 'Ascent to the Summit Peak', desc: 'Acclimatize and trek up to the mountain summit peak for panoramic sunset views.' },
      { day: 3, title: 'Descent and Departure', desc: 'Pack bags, return to base, and drive back to transit hub.' }
    ]);
    setIsOpenForm(true);
  };

  const handleOpenEditForm = (p: any) => {
    setEditingPackage(p);
    setFormStep(1);
    setTitle(p.title);
    setRegion(p.region);
    setLocationName(p.location || '');
    setPrice(p.price.toString());
    setDuration(p.duration);
    setDurationDays(p.durationDays.toString());
    setVibe(p.vibe);
    setDifficulty(p.difficulty);
    setMaxGuests((p.maxGuests || 4).toString());
    setImage(p.image);
    setBadge(p.badge || '');
    setDescription(p.description || '');
    setLongDescription(p.longDescription || '');
    setAltitude(p.altitude || '');
    setBestTime(p.bestTime || '');
    setAmenitiesInput(p.amenities ? p.amenities.join(', ') : '');

    // Set includes checkboxes
    const incList = p.includes || [];
    setIncludeTransit(incList.some((i: any) => i.name.toLowerCase().includes('transit') || i.name.toLowerCase().includes('chauffeur')));
    setIncludeMeals(incList.some((i: any) => i.name.toLowerCase().includes('meal') || i.name.toLowerCase().includes('dining')));
    setIncludeShelter(incList.some((i: any) => i.name.toLowerCase().includes('shelter') || i.name.toLowerCase().includes('tent') || i.name.toLowerCase().includes('cabin') || i.name.toLowerCase().includes('villa') || i.name.toLowerCase().includes('dome')));
    setIncludeGuide(incList.some((i: any) => i.name.toLowerCase().includes('guide') || i.name.toLowerCase().includes('guru') || i.name.toLowerCase().includes('telescope')));

    // Set itinerary
    setItinerary(p.itinerary || [{ day: 1, title: '', desc: '' }]);
    setIsOpenForm(true);
  };

  const handleOpenDelete = (p: any) => {
    setPackageToDelete(p);
    setIsOpenDeleteConfirm(true);
  };

  const handleDeletePackage = async () => {
    if (!packageToDelete) return;
    try {
      await api.delete(`/api/packages/delete-package/${packageToDelete.id}`);
      setPackages(prev => prev.filter(p => p.id !== packageToDelete.id));
      toast.success('Package deleted successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Error deleting package');
    } finally {
      setIsOpenDeleteConfirm(false);
      setPackageToDelete(null);
    }
  };

  // Itinerary builders helpers
  const handleAddItineraryDay = () => {
    setItinerary(prev => [
      ...prev,
      { day: prev.length + 1, title: '', desc: '' }
    ]);
  };

  const handleRemoveItineraryDay = () => {
    if (itinerary.length <= 1) return;
    setItinerary(prev => prev.slice(0, -1));
  };

  const handleItineraryChange = (index: number, key: 'title' | 'desc', val: string) => {
    setItinerary(prev => prev.map((item, idx) => 
      idx === index ? { ...item, [key]: val } : item
    ));
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !region || !price || !duration || !durationDays) {
      toast.error('Please complete all mandatory fields.');
      return;
    }

    const token = localStorage.getItem('pb_admin_token');
    if (!token) return;

    // Build includes array
    const includesArr = [];
    if (includeTransit) includesArr.push({ name: 'Chauffeur Transit', iconName: 'Car' });
    if (includeMeals) includesArr.push({ name: 'All Organic Meals', iconName: 'UtensilsCrossed' });
    if (includeShelter) includesArr.push({ name: 'Luxury Shelter Stay', iconName: 'Tent' });
    if (includeGuide) includesArr.push({ name: 'Dedicated Guide', iconName: 'Guide' });

    // Generate package id slug
    const idSlug = editingPackage ? editingPackage.id : title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const payload = {
      num: editingPackage ? editingPackage.num : (packages.length + 1).toString().padStart(2, '0'),
      title,
      region,
      location: locationName || region,
      duration,
      durationDays: Number(durationDays),
      vibe,
      difficulty,
      price: parseFloat(price),
      maxGuests: Number(maxGuests),
      image,
      badge: badge || null,
      description,
      longDescription,
      amenities: amenitiesInput.split(',').map(s => s.trim()).filter(s => s.length > 0),
      includes: includesArr,
      altitude,
      bestTime,
      itinerary
    };

    try {
      // Attach ID for creations
      const fullPayload = editingPackage ? payload : { ...payload, id: idSlug };

      let saved;
      if (editingPackage) {
        const { data } = await api.put(`/api/packages/update-package/${editingPackage.id}`, fullPayload);
        saved = data;
      } else {
        const { data } = await api.post('/api/packages/create-package', fullPayload);
        saved = data;
      }
      if (editingPackage) {
        setPackages(prev => prev.map(p => p.id === editingPackage.id ? saved : p));
        toast.success('Package details updated successfully!');
      } else {
        setPackages(prev => [...prev, saved]);
        toast.success('New experiential package listed successfully!');
      }

      setIsOpenForm(false);
    } catch (err: any) {
      toast.error(err.message || 'Error saving package');
    }
  };

  const filteredList = packages.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.region && p.region.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (p.vibe && p.vibe.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Search and Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-gray-200/80 rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.015)]">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search packages by title, region, or vibe..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10 rounded-xl bg-gray-50/50 border-gray-200 focus:bg-white text-xs py-5"
          />
        </div>

        <Button
          onClick={handleOpenCreateForm}
          className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-xs uppercase tracking-wider py-5 px-6 shadow-sm shadow-emerald-500/10 flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add New Package
        </Button>
      </div>

      {/* Main Grid Ledger Card */}
      <Card className="bg-white border-gray-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.015)] overflow-hidden rounded-2xl">
        <CardHeader className="px-6 py-5 border-b border-gray-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-black tracking-wider text-gray-900 uppercase">Himalayan Packages Ledger</CardTitle>
            <CardDescription className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-1">
              Active expeditions on the Pahadi Basera platform
            </CardDescription>
          </div>
          <Badge className="bg-gray-100 hover:bg-gray-100 text-gray-600 border-gray-200 text-[10px] font-bold py-1 px-3.5">
            {packages.length} listed
          </Badge>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="py-24 flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-4" />
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Gathering Packages Ledger...</p>
            </div>
          ) : filteredList.length === 0 ? (
            <div className="py-24 text-center">
              <Compass className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">No matching packages found</p>
              <p className="text-[10px] text-gray-400 mt-1 uppercase font-semibold">Try modifying your query in the search bar</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-gray-50/70 border-b border-gray-100">
                <TableRow>
                  <TableHead className="w-20 pl-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Cover</TableHead>
                  <TableHead className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Expedition Details</TableHead>
                  <TableHead className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Region & Altitude</TableHead>
                  <TableHead className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Vibe & Difficulty</TableHead>
                  <TableHead className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pricing & duration</TableHead>
                  <TableHead className="text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">Publish</TableHead>
                  <TableHead className="pr-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredList.map((pkg: any) => (
                  <TableRow key={pkg.id} className="hover:bg-gray-50/40 transition-colors border-b border-gray-100/60">
                    
                    {/* Thumbnail image */}
                    <TableCell className="pl-6 py-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-200 shadow-sm shrink-0 bg-gray-50">
                        <img 
                          src={pkg.image} 
                          alt="" 
                          className="w-full h-full object-cover transition-transform hover:scale-110 duration-300"
                        />
                      </div>
                    </TableCell>

                    {/* Title details */}
                    <TableCell className="py-4 font-bold text-gray-900 text-xs">
                      <div className="flex items-center gap-1.5">
                        {pkg.title}
                        <a href={`/packages/${pkg.id}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-emerald-600 transition-colors">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                      <div className="text-[9px] font-extrabold text-emerald-600 mt-1 uppercase tracking-wider">
                        #{pkg.num} &bull; {pkg.badge || 'Standard'}
                      </div>
                    </TableCell>

                    {/* Region */}
                    <TableCell className="py-4 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span>{pkg.location || pkg.region}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                        <Mountain className="w-3 h-3 text-gray-400 shrink-0" />
                        <span>{pkg.altitude || 'N/A'}</span>
                      </div>
                    </TableCell>

                    {/* Vibe */}
                    <TableCell className="py-4 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
                        <span>{pkg.vibe}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                        <Flame className="w-3 h-3 text-red-500 shrink-0" />
                        <span>{pkg.difficulty}</span>
                      </div>
                    </TableCell>

                    {/* Pricing */}
                    <TableCell className="py-4 text-xs text-gray-800">
                      <div className="font-extrabold">{formatCurrency(pkg.price)}</div>
                      <div className="flex items-center gap-1 mt-0.5 text-[9px] text-gray-400 uppercase tracking-wider font-semibold">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span>{pkg.duration}</span>
                      </div>
                    </TableCell>

                    {/* Publish toggle */}
                    <TableCell className="py-4 text-center">
                      {pkg.isActive ? (
                        <Badge className="bg-emerald-50 text-emerald-800 border-emerald-100 hover:bg-emerald-50">Active</Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-100">Inactive</Badge>
                      )}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="pr-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        
                        {/* Publish toggle button */}
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={updatingId === pkg.id}
                          onClick={() => handleToggleActive(pkg.id, pkg.isActive)}
                          className={`rounded-lg font-bold text-[10px] uppercase tracking-widest px-2.5 py-1.5 h-8 transition-all cursor-pointer ${
                            pkg.isActive 
                              ? 'bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100 hover:text-amber-700' 
                              : 'bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700'
                          }`}
                        >
                          {updatingId === pkg.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : pkg.isActive ? (
                            'Deactivate'
                          ) : (
                            'Activate'
                          )}
                        </Button>

                        {/* Edit button */}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenEditForm(pkg)}
                          className="bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 rounded-lg p-1.5 h-8 w-8 cursor-pointer"
                          title="Edit Package"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>

                        {/* Delete button */}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenDelete(pkg)}
                          className="bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-200 rounded-lg p-1.5 h-8 w-8 cursor-pointer"
                          title="Delete Package"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>

                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Package Creation / Edit Form Dialog (3 Step Wizard) */}
      <Dialog open={isOpenForm} onOpenChange={setIsOpenForm}>
        <DialogContent className="sm:max-w-2xl bg-white border border-gray-200 rounded-2xl shadow-2xl p-6 font-sans max-h-[90vh] overflow-y-auto">
          <DialogHeader className="border-b border-gray-100 pb-4">
            <DialogTitle className="text-base font-extrabold tracking-wider text-gray-900 uppercase">
              {editingPackage ? `Modify Package: ${editingPackage.title}` : 'List New Experiential Tour'}
            </DialogTitle>
            <DialogDescription className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
              Define target regions, durations, itineraries, and inclusions
            </DialogDescription>
          </DialogHeader>

          {/* Form Step Progress bar */}
          <div className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 select-none mb-6">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black font-sans border transition-all ${
                  formStep === step
                    ? 'bg-emerald-500 text-white border-emerald-600 shadow-md shadow-emerald-500/20'
                    : formStep > step
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700 font-extrabold'
                      : 'bg-white border-gray-200 text-gray-400'
                }`}>
                  {step}
                </div>
                <span className={`text-[9px] uppercase tracking-wider font-extrabold transition-colors ${
                  formStep === step ? 'text-gray-900' : 'text-gray-400'
                }`}>
                  {step === 1 ? 'Core Specs' : step === 2 ? 'Visuals & Description' : 'Itinerary & Inclusions'}
                </span>
                {step < 3 && <div className="w-8 h-[1px] bg-gray-200 mx-1 hidden sm:block" />}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmitForm} className="space-y-6 text-xs">
            
            {/* Step 1: Core Specifications */}
            <div className={formStep === 1 ? "space-y-4" : "hidden"}>
              <h3 className="font-extrabold text-[10px] text-emerald-600 uppercase tracking-widest border-b border-emerald-100 pb-1.5">1. General Specifications</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] tracking-wider uppercase font-bold text-gray-500">Package Title *</label>
                  <Input 
                    type="text" 
                    value={title} 
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. Kedarnath Valley Spiritual Hike"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] tracking-wider uppercase font-bold text-gray-500">Target Region *</label>
                    <select 
                      value={region} 
                      onChange={e => setRegion(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg p-2.5 bg-white text-xs text-gray-800 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Uttarakhand">Uttarakhand</option>
                      <option value="Himachal">Himachal</option>
                      <option value="Kashmir">Kashmir</option>
                      <option value="Sikkim">Sikkim</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] tracking-wider uppercase font-bold text-gray-500">Specific Location *</label>
                    <Input 
                      type="text" 
                      value={locationName} 
                      onChange={e => setLocationName(e.target.value)}
                      placeholder="e.g. Kedarnath, Uttarakhand"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-1 md:col-span-2">
                  <label className="text-[10px] tracking-wider uppercase font-bold text-gray-500">Duration Text *</label>
                  <Input 
                    type="text" 
                    value={duration} 
                    onChange={e => setDuration(e.target.value)}
                    placeholder="e.g. 5 Days / 4 Nights"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] tracking-wider uppercase font-bold text-gray-500">Duration (Days) *</label>
                  <Input 
                    type="number" 
                    value={durationDays} 
                    onChange={e => setDurationDays(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] tracking-wider uppercase font-bold text-gray-500">Base Price (INR) *</label>
                  <Input 
                    type="number" 
                    value={price} 
                    onChange={e => setPrice(e.target.value)}
                    placeholder="e.g. 14999"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] tracking-wider uppercase font-bold text-gray-500">Max Guests</label>
                  <Input 
                    type="number" 
                    value={maxGuests} 
                    onChange={e => setMaxGuests(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] tracking-wider uppercase font-bold text-gray-500">Vibe Theme</label>
                  <select 
                    value={vibe} 
                    onChange={e => setVibe(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg p-2.5 bg-white text-xs text-gray-800 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Adventure">Adventure</option>
                    <option value="Wellness">Wellness</option>
                    <option value="Celestial">Celestial</option>
                    <option value="Heritage">Heritage</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] tracking-wider uppercase font-bold text-gray-500">Difficulty</label>
                  <select 
                    value={difficulty} 
                    onChange={e => setDifficulty(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg p-2.5 bg-white text-xs text-gray-800 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Step 2: Marketing & Media & Descriptions */}
            <div className={formStep === 2 ? "space-y-4" : "hidden"}>
              <h3 className="font-extrabold text-[10px] text-emerald-600 uppercase tracking-widest border-b border-emerald-100 pb-1.5">2. Marketing & Overview</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] tracking-wider uppercase font-bold text-gray-500">MASL Altitude (e.g., 3,580m)</label>
                  <Input 
                    type="text" 
                    value={altitude} 
                    onChange={e => setAltitude(e.target.value)}
                    placeholder="e.g. 3,580m"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] tracking-wider uppercase font-bold text-gray-500">Best Time to Visit</label>
                  <Input 
                    type="text" 
                    value={bestTime} 
                    onChange={e => setBestTime(e.target.value)}
                    placeholder="e.g. May to Oct"
                  />
                </div>
              </div>

              {/* ImageKit Expedition Cover Upload */}
              <div className="space-y-2 pt-1 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] tracking-wider uppercase font-bold text-gray-700 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                    Expedition Cover Media (ImageKit CDN)
                  </label>
                  {image && (
                    <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                      Cover Active
                    </span>
                  )}
                </div>

                <ImageUploadDropzone
                  folder="packages"
                  multiple={false}
                  maxFiles={1}
                  maxSizeMB={15}
                  label="Upload Expedition Cover"
                  hint="Streams directly to ImageKit CDN storage for fast responsive delivery"
                  onUploadSuccess={(results) => {
                    if (results.length > 0) {
                      setImage(results[0].url);
                      toast.success('ImageKit expedition cover photo attached!');
                    }
                  }}
                />

                {image && (
                  <div className="relative aspect-video max-w-sm rounded-xl overflow-hidden border border-gray-200 bg-gray-50 shadow-xs group">
                    <img src={image} alt="Package cover preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImage('')}
                      className="absolute top-2 right-2 bg-gray-900/80 hover:bg-red-600 text-white rounded-lg p-1.5 transition-colors cursor-pointer"
                      title="Clear photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <span className="absolute bottom-2 left-2 bg-emerald-600/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs">
                      Active Cover
                    </span>
                  </div>
                )}

                <details className="text-[11px] text-gray-500 pt-1">
                  <summary className="cursor-pointer hover:text-gray-700 font-medium">Edit Raw Image URL</summary>
                  <Input 
                    type="text" 
                    value={image} 
                    onChange={e => setImage(e.target.value)}
                    placeholder="https://ik.imagekit.io/skhds42rl/..."
                    className="mt-1 text-xs font-mono"
                  />
                </details>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] tracking-wider uppercase font-bold text-gray-500">Badge Tagline</label>
                  <Input 
                    type="text" 
                    value={badge} 
                    onChange={e => setBadge(e.target.value)}
                    placeholder="e.g. Explorer Special, Hot Deal"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] tracking-wider uppercase font-bold text-gray-500">Excerpt / Short Description *</label>
                <Textarea 
                  value={description} 
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Summary displayed on listing index page..."
                  rows={2}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] tracking-wider uppercase font-bold text-gray-500">Detailed long description</label>
                <Textarea 
                  value={longDescription} 
                  onChange={e => setLongDescription(e.target.value)}
                  placeholder="Complete travel scope detail..."
                  rows={3}
                />
              </div>
            </div>

            {/* Step 3: Inclusions, Amenities, and Itineraries */}
            <div className={formStep === 3 ? "space-y-5" : "hidden"}>
              <h3 className="font-extrabold text-[10px] text-emerald-600 uppercase tracking-widest border-b border-emerald-100 pb-1.5">3. Inclusions, Amenities & Daily Itinerary</h3>
              
              {/* Inclusions Checkboxes */}
              <div className="space-y-2">
                <label className="text-[10px] tracking-wider uppercase font-bold text-gray-500 block">Package Inclusions (Icons)</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-gray-50 border border-gray-100 rounded-xl p-3 select-none">
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="incTransit"
                      checked={includeTransit} 
                      onChange={e => setIncludeTransit(e.target.checked)}
                      className="rounded border-gray-300 text-emerald-500 focus:ring-emerald-500 cursor-pointer h-4 w-4"
                    />
                    <label htmlFor="incTransit" className="text-[10px] font-bold text-gray-600 uppercase tracking-wide cursor-pointer">Transit (Car)</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="incMeals"
                      checked={includeMeals} 
                      onChange={e => setIncludeMeals(e.target.checked)}
                      className="rounded border-gray-300 text-emerald-500 focus:ring-emerald-500 cursor-pointer h-4 w-4"
                    />
                    <label htmlFor="incMeals" className="text-[10px] font-bold text-gray-600 uppercase tracking-wide cursor-pointer">Meals (Food)</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="incShelter"
                      checked={includeShelter} 
                      onChange={e => setIncludeShelter(e.target.checked)}
                      className="rounded border-gray-300 text-emerald-500 focus:ring-emerald-500 cursor-pointer h-4 w-4"
                    />
                    <label htmlFor="incShelter" className="text-[10px] font-bold text-gray-600 uppercase tracking-wide cursor-pointer">Shelter (Tent)</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="incGuide"
                      checked={includeGuide} 
                      onChange={e => setIncludeGuide(e.target.checked)}
                      className="rounded border-gray-300 text-emerald-500 focus:ring-emerald-500 cursor-pointer h-4 w-4"
                    />
                    <label htmlFor="incGuide" className="text-[10px] font-bold text-gray-600 uppercase tracking-wide cursor-pointer">Guide</label>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] tracking-wider uppercase font-bold text-gray-500">Amenities (comma-separated list)</label>
                <Input 
                  type="text" 
                  value={amenitiesInput} 
                  onChange={e => setAmenitiesInput(e.target.value)}
                  placeholder="e.g. Certified Mountain Guide, All Organic Meals, High-End Telescope"
                />
              </div>

              {/* Dynamic Daily Itinerary Builder */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-gray-100 pb-1.5">
                  <label className="text-[10px] tracking-wider uppercase font-bold text-gray-500">Itinerary Planner ({itinerary.length} Days)</label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleRemoveItineraryDay}
                      disabled={itinerary.length <= 1}
                      className="rounded-lg h-7 px-2.5 font-bold text-[9px] uppercase border-gray-200 text-gray-500 hover:bg-gray-50 cursor-pointer"
                    >
                      Remove Last Day
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddItineraryDay}
                      className="rounded-lg h-7 px-2.5 font-bold text-[9px] uppercase border-emerald-200 text-emerald-600 bg-emerald-50/30 hover:bg-emerald-50 cursor-pointer"
                    >
                      Add Day
                    </Button>
                  </div>
                </div>

                <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                  {itinerary.map((dayPlan, index) => (
                    <div key={index} className="bg-gray-50 border border-gray-150 rounded-xl p-3 space-y-2 relative">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-lg bg-gray-200/80 font-black text-[9px] flex items-center justify-center text-gray-600 select-none shrink-0">
                          D{index + 1}
                        </span>
                        <Input
                          type="text"
                          value={dayPlan.title}
                          onChange={e => handleItineraryChange(index, 'title', e.target.value)}
                          placeholder={`Day ${index + 1} title (e.g. Ascent to high top camp)`}
                          className="h-8 rounded-lg text-xs"
                          required
                        />
                      </div>
                      <Textarea
                        value={dayPlan.desc}
                        onChange={e => handleItineraryChange(index, 'desc', e.target.value)}
                        placeholder="Description of activities, meals, and overnight locations..."
                        className="rounded-lg text-xs"
                        rows={2}
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>
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
                  className="rounded-xl border border-gray-200 text-gray-400 font-bold text-xs uppercase tracking-wider py-4 px-5 cursor-pointer"
                >
                  Cancel
                </Button>
                
                {formStep < 3 ? (
                  <Button
                    type="button"
                    onClick={() => {
                      if (formStep === 1) {
                        if (!title || !locationName || !price || !duration || !durationDays) {
                          toast.error('Please complete all mandatory fields.');
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
                    className="bg-[#10b981] hover:bg-[#0e9f6e] text-white rounded-xl font-bold text-xs uppercase tracking-wider py-4 px-6 shadow-[0_4px_15px_rgba(16,185,129,0.25)] cursor-pointer"
                  >
                    {editingPackage ? 'Save Changes' : 'Create Listing'}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isOpenDeleteConfirm} onOpenChange={setIsOpenDeleteConfirm}>
        <DialogContent className="sm:max-w-md bg-white border border-gray-200 rounded-2xl shadow-2xl p-6 font-sans">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-base font-extrabold tracking-wider text-rose-600 uppercase">
              CONFIRM PACKAGE DELETE
            </DialogTitle>
            <DialogDescription className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
              This action is permanent and cannot be undone
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 text-xs text-gray-600 leading-relaxed border-t border-b border-gray-100">
            Are you sure you want to delete the package <strong className="text-gray-900">{packageToDelete?.title}</strong>? All public descriptions and bookings attached to this listing will be permanently removed.
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
              onClick={handleDeletePackage}
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
