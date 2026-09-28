export interface BlogAuthor {
  name: string;
  role: string;
  avatar: string;
  socials: { instagram: string; twitter: string; substack: string };
}

export interface BlogItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  altitude: string;
  duration: string;
  author: BlogAuthor;
  images: string[];
  views: string;
  tags: string[];
  difficulty: 'Easy' | 'Moderate' | 'Strenuous' | 'Demanding';
  bestSeason: string;
  gearList: string[];
  routeCoordinates: { name: string; alt: string }[];
  isVerifiedCreator?: boolean;
  taggedPropertyId?: string;
  likesCount?: number;
  authorReferralCode?: string;
}

export interface CommunityTrail {
  id: string;
  title: string;
  location: string;
  altitude: string;
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  description: string;
  author: string;
  coordinates: string;
}

export interface CommunityMember {
  id: string;
  name: string;
  avatar: string;
  role: string;
  badge: string;
  badgeColor: string;
  bio: string;
  tripsCount: number;
}

export interface CommunityThread {
  id: string;
  title: string;
  author: { name: string; avatar: string };
  category: 'Gear' | 'Routes' | 'Homestays' | 'Permits';
  replies: number;
  upvotes: number;
  timeAgo: string;
}

export interface LocalRecipe {
  id: string;
  name: string;
  image: string;
  origin: string;
  ingredients: string[];
  steps: string[];
}

export const blogLogs: BlogItem[] = [];

export const communityTrails: CommunityTrail[] = [];

export const communityMembers: CommunityMember[] = [];

export const communityThreads: CommunityThread[] = [];

export const localRecipes: LocalRecipe[] = [];
