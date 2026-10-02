import React from "react";
import HeroSection from "@/components/home/Hero";
import FeaturesBadges from "@/components/home/FeatureBadges";
import ExploreRegion from "@/components/home/ExploreRegion";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import WhyPahadiBasera from "@/components/WhypahadiBasera";
import OurStory from "@/components/home/OurStory";
import Packages from "@/components/home/Packages";
import TaxiRental from "@/components/home/TaxiRental";
import TravelCommunity from "@/components/home/TravelCommunity";

export default function Home() {
  return (
    <div className="bg-zinc-50 font-sans min-h-screen text-gray-800">
      {/* Hero Section */}
      <HeroSection />
      {/* Featured Properties (Immediate Stay Discovery with Categories) */}
      <FeaturedProperties />
      {/* Regions */}
      <ExploreRegion />
      {/* Our Story */}
      <OurStory />
      {/* Features Section */}
      <FeaturesBadges />
      {/* Packages Tour Section */}
      <Packages />
      {/* Taxi & Hill Car Rental Section */}
      <TaxiRental />
      {/* The Pahadi Experience */}
      <WhyPahadiBasera />
      {/* Travel Community & Blogs Section */}
      <TravelCommunity />
    </div>
  );
}
