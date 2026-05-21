import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Calendar, 
  Users, 
  Search, 
  Flame, 
  Utensils, 
  Compass, 
  Wifi, 
  Star, 
  ArrowRight,
  Shield,
  Heart,
  TrendingUp
} from "lucide-react";
import HeroSection from "@/components/home/Hero";
import FeaturesBadges from "@/components/home/FeatureBadges";
import ExploreRegion from "@/components/home/ExploreRegion";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import WhyPahadiBasera from "@/components/WhypahadiBasera";
import OurStory from "@/components/home/OurStory";

export default function Home() {
  const featuredStays = [
    {
      id: 1,
      title: "Oakwood Premium Chalet",
      location: "Manali, Himachal Pradesh",
      price: "₹8,500",
      rating: "4.9",
      reviews: 124,
      image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80",
      badge: "Best Seller",
      amenities: ["Bonfire", "Mountain View", "Local Chef"]
    },
    {
      id: 2,
      title: "The Whispering Pines Cabin",
      location: "Shimla, Himachal Pradesh",
      price: "₹6,200",
      rating: "4.8",
      reviews: 98,
      image: "https://images.unsplash.com/photo-1549693578-d683be217e58?auto=format&fit=crop&w=800&q=80",
      badge: "Cozy Escape",
      amenities: ["Fireplace", "High-Speed Wi-Fi", "Pet Friendly"]
    },
    {
      id: 3,
      title: "Glacier Nest Villa",
      location: "Dharamshala, Himachal Pradesh",
      price: "₹12,000",
      rating: "4.95",
      reviews: 76,
      image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80",
      badge: "Luxury Stay",
      amenities: ["Private Deck", "Heating", "Stargazing"]
    }
  ];

  return (
    <div className="bg-zinc-50 font-sans min-h-screen text-gray-800">
      
      {/* Hero Section */}
      <HeroSection />
      {/* Features Section */}
      <FeaturesBadges />
      {/* Regions */}
      <ExploreRegion />

      {/* Our Story */}
      <OurStory />

      {/* Featured Properties */}
    <FeaturedProperties />

      {/* The Pahadi Experience */}
     <WhyPahadiBasera />
      
    </div>
  );
}
