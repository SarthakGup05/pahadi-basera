export interface PackageItem {
  id: string;
  num: string;
  title: string;
  region: 'Uttarakhand' | 'Himachal' | 'Kashmir' | 'Sikkim';
  location: string;
  duration: string;
  durationDays: number;
  vibe: 'Adventure' | 'Wellness' | 'Celestial' | 'Heritage';
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  price: number;
  maxGuests: number;
  image: string;
  badge: string;
  description: string;
  longDescription: string;
  amenities: string[];
  includes: { name: string; iconName: string }[];
  altitude: string;
  bestTime: string;
  itinerary: { day: number; title: string; desc: string }[];
}

export const packagesList: PackageItem[] = [];
