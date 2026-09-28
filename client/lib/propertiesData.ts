export interface PropertyService {
  id: string;
  serviceType: 'STAY' | 'KITCHEN' | 'COOK' | 'GUIDE' | 'LOCAL_CHEF' | 'FOREST_SAUNA' | 'NATIVE_GUIDE' | string;
  pricePerUnit: number;
  label?: string;
}

export interface PropertyImage {
  url: string;
  isFeatured?: boolean;
  displayOrder?: number;
}

export interface PropertyItem {
  id: string;
  title: string;
  description: string;
  location: string;
  pricePerNight: number;
  rating: string | number;
  reviewsCount: number;
  badge?: string | null;
  bgImage?: string;
  image?: string;
  images?: string[];
  about?: string;
  space?: string;
  maxGuests: number;
  guests?: number;
  bedrooms?: number;
  bathrooms?: number;
  securityDeposit?: number;
  checkInTime?: string;
  checkOutTime?: string;
  checkIn?: string;
  checkOut?: string;
  selfCheckIn?: string;
  petsAllowed?: boolean;
  smokingPolicy?: string;
  cancellationPolicy?: string;
  amenities: string[];
  altitude: number;
  type: string;
  services: PropertyService[];
  isActive?: boolean;
  isFeatured?: boolean;
  isPopular?: boolean;
  tag?: string;
  tagVariant?: string;
  shortDescription?: string;
  hostName?: string;
  hostBio?: string;
  hostPhone?: string;
  hostEmail?: string;
  hostAvatar?: string;
  hostResponseTime?: string;
}

export const propertiesCatalog: Record<string, PropertyItem> = {};

export const propertiesList: PropertyItem[] = [];
