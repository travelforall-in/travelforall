// src/pages/AllPackages.js
import React from 'react';
// import { packages } from '../data/packages';
import { PackageCard } from '../components/PopularPackages';

const AllPackages = () => {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">All Travel Packages</h1>
          <p className="text-gray-600">
            Browse our complete collection of travel experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AllPackages;