import React from 'react';
import { Link } from 'react-router-dom';
import PartnerLogo from '@/images/PartnerLogo.jpg';

const PartnerDetails = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-10">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-2xl w-full">
        <img
          src={PartnerLogo}
          alt="OCEANLUX"
          className="h-24 w-24 object-cover rounded-lg mx-auto mb-6"
        />
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">OCEANLUX</h1>
        <p className="text-gray-600 text-md text-center mb-6">
          OCEANLUX is a revolutionary air purifier using advanced artificial photosynthesis 
          to absorb CO₂ and release fresh oxygen through microalgae. It purifies air while 
          contributing to a greener environment, making your space healthier and more 
          sustainable.
        </p>

        <ul className="text-gray-700 mb-6 list-disc pl-6 space-y-2">
          <li><strong>Artificial Photosynthesis Technology:</strong> Converts CO₂ into oxygen using microalgae.</li>
          <li><strong>Continuous Air Purification:</strong> Works 24/7 to keep your indoor air clean and fresh.</li>
          <li><strong>Energy-Efficient Design:</strong> LED lighting promotes microalgae growth with minimal energy usage.</li>
          <li><strong>Health Benefits:</strong> Reduces CO₂ levels to improve concentration, reduce fatigue, and enhance well-being.</li>
          <li><strong>Eco-Friendly:</strong> Supports sustainable living and aligns with green building standards.</li>
        </ul>

        <div className="text-center">
          <Link to="/" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PartnerDetails;
