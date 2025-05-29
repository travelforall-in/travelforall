// src/components/PartnerSection.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import PartnerLogo from '@/images/PartnerLogo.jpg';

const PartnerSection: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12">
          Our Trusted Product Partner
        </h2>

        {/* Horizontal Flexbox Card */}
        <div className="flex flex-col md:flex-row bg-white rounded-xl shadow p-6 md:p-10 items-center md:items-start space-y-6 md:space-y-0 md:space-x-20">
          <img
            src={PartnerLogo}
            alt="OCEANLUX Air Purifier"
            className="w-48 h-48 object-cover rounded-lg flex-shrink-0"
          />

          <div className="text-center md:text-left flex-grow max-w-xl">
            <h3 className="text-2xl font-semibold mb-2">OCEANLUX</h3>
            <p className="text-gray-600 mb-4">
              OCEANLUX is a next-generation air purifier featuring artificial
              photosynthesis, anion purification, triple-layer HEPA filters, and
              smart app control. Designed for healthy living, it ensures clean air
              in every breath.
            </p>
           <Link
  to="/partner-details"
  className="inline-block mt-3 bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-800 transition-colors duration-300"
>
  View Details →
</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnerSection;
