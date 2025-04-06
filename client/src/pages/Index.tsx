
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import FeaturedDestinations from '@/components/FeaturedDestinations';
import PopularPackages from '@/components/PopularPackages';
import Testimonials from '@/components/Testimonials';
import NewsletterSection from '@/components/NewsletterSection';
import { useParams } from 'react-router-dom';

const Index = () => {
  const { id } = useParams();
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16">
        <HeroSection />
        <FeaturedDestinations />
        <PopularPackages />
        <Testimonials />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
