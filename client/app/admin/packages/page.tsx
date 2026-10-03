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
  Image as ImageIcon,
  Check,
  Minus,
  Car,
  UtensilsCrossed,
  Tent,
  CheckCircle2,
  Shield,
  X
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

const VIBE_OPTIONS = [
  { value: 'Adventure', label: 'Adventure', desc: 'Alpine summits, high passes & glacier trekking', icon: Flame },
  { value: 'Wellness', label: 'Wellness', desc: 'Forest bathing, silent valleys & yoga retreats', icon: Sparkles },
  { value: 'Celestial', label: 'Celestial', desc: 'Dark sky astrophotography & Milky Way stargazing', icon: Compass },
  { value: 'Heritage', label: 'Heritage', desc: 'Ancient stone villages, shrines & folklore paths', icon: Mountain },
];

const POPULAR_PACKAGE_AMENITIES = [
  'Professional Mountain Guide',
  'All Organic Meals',
  'Private Chauffeur Transit',
  'Luxury Alpine Domes',
  'High-End Stargazing Telescope',
  'Campfire & Folk Music Nights',
  'High-Altitude Oxygen Support',
  'Forest Department Permits',
  'Mountaineering Crampons & Poles',
  'Warm Sleeping Bags (-10°C)',
  'Trail Snacks & Dry Fruits',
  'Action Camera / Drone Footage'
];

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
  const [durationDays, setDurationDays] = useState('4');
  const [vibe, setVibe] = useState('Adventure');
  const [difficulty, setDifficulty] = useState('Moderate');
  const [maxGuests, setMaxGuests] = useState('6');
  const [image, setImage] = useState('');
  const [badge, setBadge] = useState('');
  const [description, setDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [altitude, setAltitude] = useState('');
  const [bestTime, setBestTime] = useState('');
  const [amenitiesList, setAmenitiesList] = useState<string[]>([
    'Professional Mountain Guide', 'All Organic Meals', 'High-Altitude Oxygen Support'
  ]);
  const [customAmenity, setCustomAmenity] = useState<string>('');

  // Includes Checkboxes
  const [includeTransit, setIncludeTransit] = useState(true);
  const [includeMeals, setIncludeMeals] = useState(true);
  const [includeShelter, setIncludeShelter] = useState(true);
  const [includeGuide, setIncludeGuide] = useState(true);

  // Itinerary Builder
  const [itinerary, setItinerary] = useState<{ day: number; title: string; desc: string }[]>([
    { day: 1, title: 'Arrival & Basecamp Setup', desc: 'Arrive at the base camp, settle into tents, and enjoy dinner by the woodfire.' },
    { day: 2, title: 'Ascent to the Summit Peak', desc: 'Acclimatize and trek up to the mountain summit peak for panoramic sunset views.' },
    { day: 3, title: 'Descent and Departure', desc: 'Pack bags, return to base, and drive back to transit hub.' }
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
    setDescription('Conquer high peaks and experience slow living across high meadows...');
    setLongDescription('Embark on an epic adventure through mountain trails, alpine meadows, and cedar forest paths...');
    setAltitude('3,500m');
    setBestTime('Sep to Nov');
    setAmenitiesList(['Professional Mountain Guide', 'All Organic Meals', 'High-Altitude Oxygen Support', 'Warm Sleeping Bags (-10°C)']);
    setCustomAmenity('');
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
    setAmenitiesList(p.amenities && p.amenities.length > 0 ? p.amenities : ['Professional Mountain Guide', 'All Organic Meals']);
    setCustomAmenity('');

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

  const handleRemoveSpecificDay = (dayIndex: number) => {
    if (itinerary.length <= 1) return;
    setItinerary(prev => 
      prev
        .filter((_, idx) => idx !== dayIndex)
        .map((item, idx) => ({ ...item, day: idx + 1 }))
    );
  };

  const handleItineraryChange = (index: number, key: 'title' | 'desc', val: string) => {
    setItinerary(prev => prev.map((item, idx) => 
      idx === index ? { ...item, [key]: val } : item
    ));
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

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !region || !price || !duration.trim() || !durationDays) {
      toast.error('Please complete all mandatory fields on Step 1.');
      setFormStep(1);
      return;
    }

    const token = localStorage.getItem('pb_admin_token');
    if (!token) {
      toast.error('Admin session expired. Please log in again.');
      return;
    }

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
      title: title.trim(),
      region,
      location: locationName.trim() || region,
      duration: duration.trim(),
      durationDays: Number(durationDays),
      vibe,
      difficulty,
      price: parseFloat(price),
      maxGuests: Number(maxGuests),
      image,
      badge: badge.trim() || null,
      description: description.trim(),
      longDescription: longDescription.trim(),
      amenities: amenitiesList,
      includes: includesArr,
      altitude: altitude.trim(),
      bestTime: bestTime.trim(),
      itinerary
    };

    try {
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

  const STEPS = [
    { id: 1, title: 'Expedition Specs', subtitle: 'Region, Duration & Vibe', icon: Compass },
    { id: 2, title: 'Mountain Specs', subtitle: 'Altitude, Season & Cover', icon: Mountain },
    { id: 3, title: 'Itinerary & Inclusions', subtitle: 'Daily Plan & Amenities', icon: Calendar },
  ];

  return (
    <div className="space-y-6 font-sans animate-fade-in">
      
      {/* Search and Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-stone-200/80 rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.015)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-xl font-black text-stone-900 tracking-tight uppercase">Packages & Expeditions</h1>
          </div>
          <p className="text-xs text-stone-500 mt-1">Curate high-altitude trekking, wellness journeys, and celestial experiences</p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <Button
            onClick={handleOpenCreateForm}
            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider py-5 px-5 shadow-sm shadow-emerald-500/20 flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add New Package
          </Button>

          <div className="relative w-64 hidden md:block">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
            <Input
              type="text"
              placeholder="Search packages by title, region..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10 rounded-xl bg-stone-50/70 border-stone-200 focus:bg-white text-xs py-4"
            />
          </div>

          <Button 
            variant="outline" 
            onClick={fetchPackages}
            title="Refresh Ledger"
            className="rounded-xl border-stone-200 bg-white hover:bg-stone-50 text-stone-600 gap-1.5 font-bold text-xs uppercase tracking-wider py-4 shrink-0 cursor-pointer"
          >
            <Loader2 className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-emerald-600' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Main Grid Ledger Card */}
      <Card className="bg-white border-stone-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.015)] overflow-hidden rounded-2xl">
        <CardHeader className="px-6 py-5 border-b border-stone-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-black tracking-wider text-stone-900 uppercase">Himalayan Packages Ledger</CardTitle>
            <CardDescription className="text-[10px] text-stone-400 uppercase tracking-widest font-bold mt-1">
              Active expeditions on the Pahadi Basera platform
            </CardDescription>
          </div>
          <Badge className="bg-stone-100 hover:bg-stone-100 text-stone-600 border-stone-200 text-[10px] font-bold py-1 px-3.5">
            {packages.length} listed
          </Badge>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="py-24 flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-4" />
              <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">Gathering Packages Ledger...</p>
            </div>
          ) : filteredList.length === 0 ? (
            <div className="py-24 text-center">
              <Compass className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <p className="text-xs text-stone-500 font-bold uppercase tracking-wider">No matching packages found</p>
              <p className="text-[10px] text-stone-400 mt-1 uppercase font-semibold">Try modifying your query in the search bar</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-stone-50/70 border-b border-stone-100">
                <TableRow>
                  <TableHead className="w-20 pl-6 text-[10px] font-bold text-stone-400 uppercase tracking-wider">Cover</TableHead>
                  <TableHead className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Expedition Details</TableHead>
                  <TableHead className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Region & Altitude</TableHead>
                  <TableHead className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Vibe & Difficulty</TableHead>
                  <TableHead className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Pricing & duration</TableHead>
                  <TableHead className="text-[10px] font-bold text-stone-400 uppercase tracking-wider text-center">Publish</TableHead>
                  <TableHead className="pr-6 text-[10px] font-bold text-stone-400 uppercase tracking-wider text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredList.map((pkg: any) => (
                  <TableRow key={pkg.id} className="hover:bg-stone-50/40 transition-colors border-b border-stone-100/60">
                    
                    {/* Thumbnail image */}
                    <TableCell className="pl-6 py-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden border border-stone-200 shadow-2xs shrink-0 bg-stone-50">
                        <img 
                          src={pkg.image} 
                          alt="" 
                          className="w-full h-full object-cover transition-transform hover:scale-110 duration-300"
                        />
                      </div>
                    </TableCell>

                    {/* Title details */}
                    <TableCell className="py-4 font-bold text-stone-900 text-xs">
                      <div className="flex items-center gap-1.5">
                        {pkg.title}
                        <a href={`/packages/${pkg.id}`} target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-emerald-600 transition-colors">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                      <div className="text-[9px] font-extrabold text-emerald-600 mt-1 uppercase tracking-wider">
                        #{pkg.num} &bull; {pkg.badge || 'Standard'}
                      </div>
                    </TableCell>

                    {/* Region */}
                    <TableCell className="py-4 text-xs text-stone-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span>{pkg.location || pkg.region}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-[9px] font-bold text-stone-400 uppercase tracking-widest">
                        <Mountain className="w-3 h-3 text-stone-400 shrink-0" />
                        <span>{pkg.altitude || 'N/A'}</span>
                      </div>
                    </TableCell>

                    {/* Vibe */}
                    <TableCell className="py-4 text-xs text-stone-600">
                      <div className="flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
                        <span>{pkg.vibe}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-[9px] font-bold text-stone-400 uppercase tracking-widest">
                        <Flame className="w-3 h-3 text-red-500 shrink-0" />
                        <span>{pkg.difficulty}</span>
                      </div>
                    </TableCell>

                    {/* Pricing */}
                    <TableCell className="py-4 text-xs text-stone-800">
                      <div className="font-extrabold">{formatCurrency(pkg.price)}</div>
                      <div className="flex items-center gap-1 mt-0.5 text-[9px] text-stone-400 uppercase tracking-wider font-semibold">
                        <Clock className="w-3 h-3 text-stone-400" />
                        <span>{pkg.duration}</span>
                      </div>
                    </TableCell>

                    {/* Publish toggle */}
                    <TableCell className="py-4 text-center">
                      {pkg.isActive ? (
                        <Badge className="bg-emerald-50 text-emerald-800 border-emerald-100 hover:bg-emerald-50">Active</Badge>
                      ) : (
                        <Badge className="bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-100">Inactive</Badge>
                      )}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="pr-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        
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

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenEditForm(pkg)}
                          className="bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100 rounded-lg p-1.5 h-8 w-8 cursor-pointer"
                          title="Edit Package"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>

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

      {/* Modern 3-Step Creation / Edit Modal Dialog */}
      <Dialog open={isOpenForm} onOpenChange={setIsOpenForm}>
        <DialogContent showCloseButton={false} className="sm:max-w-3xl lg:max-w-4xl w-full p-0 bg-white border border-stone-200/90 rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col font-sans">
          
          {/* Glowing Top Accent Bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500 shrink-0" />

          {/* Dialog Header */}
          <div className="px-8 pt-6 pb-5 border-b border-stone-100 shrink-0 bg-stone-50/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200/60 flex items-center justify-center shrink-0 shadow-2xs">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <DialogTitle className="text-lg font-black tracking-tight text-stone-900">
                      {editingPackage ? `Modify Package: ${editingPackage.title}` : 'List New Experiential Tour'}
                    </DialogTitle>
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-100/70 text-emerald-800 border border-emerald-200">
                      {editingPackage ? 'Live Edit' : 'New Package'}
                    </span>
                  </div>
                  <DialogDescription className="text-xs text-stone-500 mt-0.5">
                    Define target regions, durations, mountain itineraries, and comprehensive inclusions
                  </DialogDescription>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpenForm(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Interactive Step Navigator Tabs */}
            <div className="grid grid-cols-3 gap-2 mt-5">
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
                        ? 'bg-white border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                        : isPassed
                          ? 'bg-emerald-50/40 border-emerald-200/70 text-emerald-800 hover:bg-emerald-50'
                          : 'bg-white/60 border-stone-200/70 text-stone-400 hover:border-stone-300'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                      isCurrent
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : isPassed
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-stone-100 text-stone-400'
                    }`}>
                      {isPassed ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : s.id}
                    </div>
                    <div className="min-w-0">
                      <p className={`text-xs font-bold truncate leading-tight ${isCurrent ? 'text-stone-900' : isPassed ? 'text-emerald-900' : 'text-stone-500'}`}>
                        {s.title}
                      </p>
                      <p className="text-[10px] text-stone-400 truncate mt-0.5">{s.subtitle}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Step Progress Line */}
            <div className="w-full bg-stone-100 h-1 rounded-full mt-3 overflow-hidden">
              <div 
                className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
                style={{ width: `${(formStep / 3) * 100}%` }}
              />
            </div>
          </div>

          {/* Form Content */}
          <form 
            onSubmit={handleSubmitForm} 
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
                e.preventDefault();
              }
            }}
            className="flex-1 overflow-y-auto p-8 space-y-6 text-xs"
          >
            {/* Step 1: Core Specifications */}
            {formStep === 1 && (
              <div className="space-y-6 animate-fade-in">
                
                <div className="border-b border-stone-100 pb-3">
                  <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
                    <Compass className="w-4 h-4 text-emerald-600" /> 1. General Specifications & Region
                  </h3>
                  <p className="text-stone-400 text-[11px] mt-0.5">Expedition title, geography, base pricing, duration, and difficulty theme</p>
                </div>

                {/* Package Title */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Package Title *</label>
                  <Input 
                    type="text" 
                    value={title} 
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. Kedarnath Valley Spiritual Ridge Trek & Astrostay"
                    className="text-sm py-5 rounded-xl border-stone-200 focus:border-emerald-500 bg-stone-50/30 focus:bg-white"
                  />
                </div>

                {/* Region & Specific Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Target Himalayan Region *</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {['Uttarakhand', 'Himachal', 'Kashmir', 'Sikkim'].map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setRegion(r)}
                          className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                            region === r
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs ring-1 ring-emerald-700'
                              : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Specific Location / Trailhead *</label>
                    <div className="relative">
                      <Input 
                        type="text" 
                        value={locationName} 
                        onChange={e => setLocationName(e.target.value)}
                        placeholder="e.g. Kedarnath Valley, Garhwal"
                        className="pl-9 py-5 rounded-xl border-stone-200 text-xs"
                      />
                      <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                </div>

                {/* Duration & Pricing Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Duration Label *</label>
                    <Input 
                      type="text" 
                      value={duration} 
                      onChange={e => setDuration(e.target.value)}
                      placeholder="e.g. 5 Days / 4 Nights"
                      className="py-5 rounded-xl border-stone-200 text-xs"
                    />
                  </div>

                  {/* Duration Days Counter */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Duration (Days) *</label>
                    <div className="flex items-center justify-between p-2.5 bg-stone-50 border border-stone-200 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setDurationDays(prev => Math.max(1, (parseInt(prev) || 1) - 1).toString())}
                        className="w-7 h-7 rounded-lg bg-white border border-stone-200 flex items-center justify-center hover:bg-stone-100 cursor-pointer"
                      >
                        <Minus className="w-3 h-3 text-stone-600" />
                      </button>
                      <span className="font-bold text-sm text-stone-900">{durationDays} Days</span>
                      <button
                        type="button"
                        onClick={() => setDurationDays(prev => ((parseInt(prev) || 1) + 1).toString())}
                        className="w-7 h-7 rounded-lg bg-white border border-stone-200 flex items-center justify-center hover:bg-stone-100 cursor-pointer"
                      >
                        <Plus className="w-3 h-3 text-stone-600" />
                      </button>
                    </div>
                  </div>

                  {/* Base Price */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Price (INR) *</label>
                      {price && (
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                          {formatCurrency(parseFloat(price) || 0)}
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <Input 
                        type="number" 
                        value={price} 
                        onChange={e => setPrice(e.target.value)}
                        placeholder="e.g. 14999"
                        className="pl-8 py-5 rounded-xl border-stone-200 text-xs font-mono font-bold"
                      />
                      <span className="text-stone-400 font-bold absolute left-3 top-1/2 -translate-y-1/2">₹</span>
                    </div>
                  </div>
                </div>

                {/* Vibe & Difficulty */}
                <div className="space-y-3 pt-2">
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Expedition Vibe Theme</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {VIBE_OPTIONS.map((vo) => {
                      const VibeIcon = vo.icon;
                      const isSelected = vibe === vo.value;
                      return (
                        <div
                          key={vo.value}
                          onClick={() => setVibe(vo.value)}
                          className={`p-3 rounded-2xl border transition-all cursor-pointer select-none ${
                            isSelected 
                              ? 'border-emerald-500 bg-emerald-50/50 shadow-xs ring-2 ring-emerald-500/20' 
                              : 'border-stone-200 hover:border-stone-300 bg-white hover:bg-stone-50/50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isSelected ? 'bg-emerald-600 text-white' : 'bg-stone-100 text-stone-600'}`}>
                              <VibeIcon className="w-4 h-4" />
                            </div>
                            {isSelected && (
                              <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                              </span>
                            )}
                          </div>
                          <p className="font-bold text-xs text-stone-900">{vo.label}</p>
                          <p className="text-[10px] text-stone-400 line-clamp-1 mt-0.5">{vo.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Difficulty & Guests */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Trek Difficulty Level</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Easy', 'Moderate', 'Hard'].map((diff) => (
                        <button
                          key={diff}
                          type="button"
                          onClick={() => setDifficulty(diff)}
                          className={`py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                            difficulty === diff
                              ? diff === 'Easy' 
                                ? 'bg-emerald-600 text-white border-emerald-600' 
                                : diff === 'Moderate'
                                  ? 'bg-amber-600 text-white border-amber-600'
                                  : 'bg-rose-600 text-white border-rose-600'
                              : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                          }`}
                        >
                          {diff}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Max Group Size</label>
                    <div className="flex items-center justify-between p-2.5 bg-stone-50 border border-stone-200 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setMaxGuests(prev => Math.max(1, (parseInt(prev) || 1) - 1).toString())}
                        className="w-7 h-7 rounded-lg bg-white border border-stone-200 flex items-center justify-center hover:bg-stone-100 cursor-pointer"
                      >
                        <Minus className="w-3 h-3 text-stone-600" />
                      </button>
                      <span className="font-bold text-sm text-stone-900">{maxGuests} Explorers</span>
                      <button
                        type="button"
                        onClick={() => setMaxGuests(prev => ((parseInt(prev) || 1) + 1).toString())}
                        className="w-7 h-7 rounded-lg bg-white border border-stone-200 flex items-center justify-center hover:bg-stone-100 cursor-pointer"
                      >
                        <Plus className="w-3 h-3 text-stone-600" />
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* Step 2: Marketing & Mountain Specs */}
            {formStep === 2 && (
              <div className="space-y-6 animate-fade-in">
                
                <div className="border-b border-stone-100 pb-3">
                  <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
                    <Mountain className="w-4 h-4 text-emerald-600" /> 2. Mountain Specs & Visual Narrative
                  </h3>
                  <p className="text-stone-400 text-[11px] mt-0.5">Elevation, optimal season, promotional tags, cover photograph, and descriptions</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Altitude Peak (MASL)</label>
                    <div className="relative">
                      <Input 
                        type="text" 
                        value={altitude} 
                        onChange={e => setAltitude(e.target.value)}
                        placeholder="e.g. 3,580m"
                        className="pl-9 py-5 rounded-xl border-stone-200 text-xs"
                      />
                      <Mountain className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Best Season Window</label>
                    <div className="relative">
                      <Input 
                        type="text" 
                        value={bestTime} 
                        onChange={e => setBestTime(e.target.value)}
                        placeholder="e.g. Sep to Nov, Apr to Jun"
                        className="pl-9 py-5 rounded-xl border-stone-200 text-xs"
                      />
                      <Calendar className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Promotional Tagline Badge</label>
                    <Input 
                      type="text" 
                      value={badge} 
                      onChange={e => setBadge(e.target.value)}
                      placeholder="e.g. Alpine Special, Limited Autumn"
                      className="py-5 rounded-xl border-stone-200 text-xs"
                    />
                  </div>
                </div>

                {/* Expedition Cover Photo Upload */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-emerald-600" />
                      Expedition Hero Cover Photo (ImageKit CDN)
                    </label>
                    {image && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                        Active Cover Attached
                      </span>
                    )}
                  </div>

                  <ImageUploadDropzone
                    folder="packages"
                    multiple={false}
                    maxFiles={1}
                    maxSizeMB={15}
                    label="Upload Expedition Cover"
                    hint="Drag & drop high-resolution landscape photo for package banners"
                    showPreviews={false}
                    onUploadSuccess={(results) => {
                      if (results.length > 0) {
                        setImage(results[0].url);
                        toast.success('Expedition cover photo attached!');
                      }
                    }}
                  />

                  {image && (
                    <div className="relative aspect-video max-w-md rounded-2xl overflow-hidden border border-stone-200 bg-stone-50 shadow-xs group">
                      <img src={image} alt="Package cover preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setImage('')}
                        className="absolute top-2 right-2 bg-stone-900/80 hover:bg-rose-600 text-white rounded-lg p-1.5 transition-colors cursor-pointer"
                        title="Clear photo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <span className="absolute bottom-2 left-2 bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                        Hero Cover Image
                      </span>
                    </div>
                  )}

                  <details className="text-xs text-stone-500 pt-1">
                    <summary className="cursor-pointer hover:text-stone-700 font-bold uppercase tracking-wider text-[10px]">
                      Edit Raw Image URL
                    </summary>
                    <Input 
                      type="text" 
                      value={image} 
                      onChange={e => setImage(e.target.value)}
                      placeholder="https://ik.imagekit.io/skhds42rl/..."
                      className="mt-1 text-xs font-mono rounded-xl border-stone-200"
                    />
                  </details>
                </div>

                {/* Descriptions */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Short Summary Excerpt *</label>
                  <Textarea 
                    value={description} 
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Brief 2-line overview shown on index cards and previews..."
                    rows={2}
                    className="rounded-xl border-stone-200 text-xs p-3 focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Detailed Scope & Narrative</label>
                  <Textarea 
                    value={longDescription} 
                    onChange={e => setLongDescription(e.target.value)}
                    placeholder="Comprehensive description of the expedition route, cultural immersion, mountain philosophy, and camping atmosphere..."
                    rows={3}
                    className="rounded-xl border-stone-200 text-xs p-3 focus:border-emerald-500"
                  />
                </div>

              </div>
            )}

            {/* Step 3: Inclusions, Amenities & Timeline Itinerary */}
            {formStep === 3 && (
              <div className="space-y-6 animate-fade-in">
                
                <div className="border-b border-stone-100 pb-3">
                  <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-600" /> 3. Inclusions, Amenities & Day-by-Day Itinerary
                  </h3>
                  <p className="text-stone-400 text-[11px] mt-0.5">Configure full tour inclusions and build a sequential daily timeline planner</p>
                </div>

                {/* 4 Inclusions Toggle Cards */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block">Package Inclusions (Badged on Card)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    
                    <div 
                      onClick={() => setIncludeTransit(!includeTransit)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer select-none flex items-center gap-2.5 ${
                        includeTransit 
                          ? 'border-emerald-500 bg-emerald-50/50 shadow-2xs ring-1 ring-emerald-500/20' 
                          : 'border-stone-200 bg-white hover:bg-stone-50'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${includeTransit ? 'bg-emerald-600 text-white' : 'bg-stone-100 text-stone-500'}`}>
                        <Car className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-xs text-stone-900 leading-tight">Transit Included</p>
                        <p className="text-[10px] text-stone-400">4x4 Mountain Cab</p>
                      </div>
                    </div>

                    <div 
                      onClick={() => setIncludeMeals(!includeMeals)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer select-none flex items-center gap-2.5 ${
                        includeMeals 
                          ? 'border-emerald-500 bg-emerald-50/50 shadow-2xs ring-1 ring-emerald-500/20' 
                          : 'border-stone-200 bg-white hover:bg-stone-50'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${includeMeals ? 'bg-emerald-600 text-white' : 'bg-stone-100 text-stone-500'}`}>
                        <UtensilsCrossed className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-xs text-stone-900 leading-tight">Organic Meals</p>
                        <p className="text-[10px] text-stone-400">All Trail Dining</p>
                      </div>
                    </div>

                    <div 
                      onClick={() => setIncludeShelter(!includeShelter)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer select-none flex items-center gap-2.5 ${
                        includeShelter 
                          ? 'border-emerald-500 bg-emerald-50/50 shadow-2xs ring-1 ring-emerald-500/20' 
                          : 'border-stone-200 bg-white hover:bg-stone-50'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${includeShelter ? 'bg-emerald-600 text-white' : 'bg-stone-100 text-stone-500'}`}>
                        <Tent className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-xs text-stone-900 leading-tight">Shelter Stay</p>
                        <p className="text-[10px] text-stone-400">Tents / Chalets</p>
                      </div>
                    </div>

                    <div 
                      onClick={() => setIncludeGuide(!includeGuide)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer select-none flex items-center gap-2.5 ${
                        includeGuide 
                          ? 'border-emerald-500 bg-emerald-50/50 shadow-2xs ring-1 ring-emerald-500/20' 
                          : 'border-stone-200 bg-white hover:bg-stone-50'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${includeGuide ? 'bg-emerald-600 text-white' : 'bg-stone-100 text-stone-500'}`}>
                        <Shield className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-xs text-stone-900 leading-tight">Mountain Guide</p>
                        <p className="text-[10px] text-stone-400">Certified Guru</p>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Interactive Amenities Cloud */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                      Expedition Gear & Amenities ({amenitiesList.length})
                    </label>
                    <span className="text-[11px] text-emerald-600 font-semibold">
                      Click to toggle on/off
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 p-4 bg-stone-50/70 border border-stone-200/70 rounded-2xl">
                    {POPULAR_PACKAGE_AMENITIES.map((item) => {
                      const isSelected = amenitiesList.includes(item);
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => handleToggleAmenity(item)}
                          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer select-none flex items-center gap-1.5 ${
                            isSelected
                              ? 'bg-emerald-600 text-white shadow-xs shadow-emerald-500/20 ring-1 ring-emerald-700'
                              : 'bg-white text-stone-600 border border-stone-200/80 hover:border-stone-300 hover:bg-stone-50'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          <span>{item}</span>
                        </button>
                      );
                    })}
                  </div>

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
                      placeholder="Add custom expedition inclusion..."
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

                {/* Dynamic Daily Itinerary Timeline Planner */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                    <div>
                      <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
                        Timeline Daily Itinerary ({itinerary.length} Days)
                      </label>
                      <p className="text-[11px] text-stone-400 mt-0.5">Sequential route milestones and activities</p>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleAddItineraryDay}
                      className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl px-3 py-1.5 text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Day {itinerary.length + 1}
                    </Button>
                  </div>

                  <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                    {itinerary.map((dayPlan, index) => (
                      <div key={index} className="bg-stone-50/70 border border-stone-200 rounded-2xl p-4 space-y-3 relative group">
                        
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2 flex-1">
                            <span className="w-8 h-8 rounded-xl bg-emerald-600 font-black text-xs flex items-center justify-center text-white select-none shrink-0 shadow-2xs">
                              D{index + 1}
                            </span>
                            <Input
                              type="text"
                              value={dayPlan.title}
                              onChange={e => handleItineraryChange(index, 'title', e.target.value)}
                              placeholder={`Day ${index + 1} title (e.g. Trek from Sari to Deoriatal Lake)`}
                              className="py-4 rounded-xl border-stone-200 text-xs font-bold bg-white"
                            />
                          </div>

                          {itinerary.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveSpecificDay(index)}
                              className="w-7 h-7 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors cursor-pointer"
                              title="Delete this day"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        <Textarea
                          value={dayPlan.desc}
                          onChange={e => handleItineraryChange(index, 'desc', e.target.value)}
                          placeholder="Detail distance covered, elevation gain, meals, photography stops, and overnight campsite location..."
                          className="rounded-xl border-stone-200 text-xs bg-white p-3"
                          rows={2}
                        />
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* Bottom Form Actions - Sticky Footer */}
            <div className="sticky -bottom-8 -mx-8 -mb-8 px-8 py-4 bg-white/95 backdrop-blur-md border-t border-stone-200 flex items-center justify-between shrink-0 shadow-lg">
              <div className="flex items-center gap-2 text-stone-500">
                <span className="text-xs font-bold text-stone-900">Step {formStep} of 3</span>
                <span className="text-stone-300">•</span>
                <span className="text-xs text-stone-500 hidden sm:inline">{STEPS[formStep - 1].title}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setIsOpenForm(false)}
                  className="rounded-xl border border-stone-200 text-stone-500 hover:text-stone-800 font-bold text-xs uppercase tracking-wider py-4 px-4 cursor-pointer"
                >
                  Cancel
                </Button>
                
                {formStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setFormStep(prev => prev - 1)}
                    className="rounded-xl border-stone-200 text-stone-700 font-bold text-xs uppercase tracking-wider py-4 px-4 cursor-pointer flex items-center gap-1.5"
                  >
                    <ChevronLeft className="w-4 h-4" /> Back
                  </Button>
                )}
                
                {formStep < 3 ? (
                  <Button
                    type="button"
                    onClick={() => {
                      if (formStep === 1) {
                        if (!title.trim() || !region || !price || !duration.trim() || !durationDays) {
                          toast.error('Please complete all mandatory fields on Step 1.');
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
                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider py-4 px-6 shadow-md shadow-emerald-500/25 cursor-pointer flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-emerald-200" />
                    {editingPackage ? 'Save & Update Expedition' : 'Publish Expedition Package'}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isOpenDeleteConfirm} onOpenChange={setIsOpenDeleteConfirm}>
        <DialogContent className="sm:max-w-md bg-white border border-stone-200 rounded-2xl shadow-2xl p-6 font-sans">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-base font-extrabold tracking-wider text-rose-600 uppercase">
              CONFIRM PACKAGE DELETE
            </DialogTitle>
            <DialogDescription className="text-xs uppercase font-bold text-stone-400 tracking-wider">
              This action is permanent and cannot be undone
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 text-xs text-stone-600 leading-relaxed border-t border-b border-stone-100">
            Are you sure you want to delete the package <strong className="text-stone-900">{packageToDelete?.title}</strong>? All public descriptions and bookings attached to this listing will be permanently removed.
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button 
              onClick={() => setIsOpenDeleteConfirm(false)} 
              variant="ghost"
              className="rounded-xl border border-stone-200 text-stone-600 font-bold text-xs uppercase tracking-wider py-4 px-5 cursor-pointer"
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
