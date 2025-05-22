import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import FeaturedDestinations from '@/components/FeaturedDestinations';
// import PopularPackages from '@/components/PopularPackages';
import Testimonials from '@/components/Testimonials';
import NewsletterSection from '@/components/NewsletterSection';
import { useParams, Link } from 'react-router-dom';
import PartnerLogo from '@/images/PartnerLogo.jpg';
import FeaturedPackages from '@/components/FeaturedPackages';

const Index = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16">
        <HeroSection />
        <FeaturedDestinations />

         <FeaturedPackages />

        {/* 👇 Modern Partner Section */}
        <section className="py-10 bg-gray-50">
          <h2 className="text-3xl font-bold text-center mb-8">Our Trusted Travel Partner</h2>
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-6">
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
              <img src={PartnerLogo} alt="Partner" className="h-20 w-auto mx-auto mb-4" />
              <h3 className="text-center font-semibold text-lg">XYZ Travels</h3>
              <p className="text-sm text-gray-600 text-center mt-2">
                Premium travel experiences across the globe.
              </p>
              <div className="flex justify-center mt-4">
                <Link to="/partner-details" className=" text-green-700 hover:underline">
                  View Details →
                </Link>
              </div>
            </div>
            {/* You can duplicate this card for more partners if needed */}
          </div>
        </section>


        

        <Testimonials />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
