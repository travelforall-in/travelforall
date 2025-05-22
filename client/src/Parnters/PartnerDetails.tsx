import React from 'react';
import { Link } from 'react-router-dom';
import PartnerLogo from '@/images/PartnerLogo.jpg';

const PartnerDetails = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-10">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-2xl w-full">
        <img
          src={PartnerLogo}
          alt="Partner Logo"
          className="h-24 w-24 object-cover rounded-lg mx-auto mb-6"
        />
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">XYZ Travels</h1>
        <p className="text-gray-600 text-md text-center mb-6">
          XYZ Travels is one of the most reliable partners, offering top-quality travel packages for domestic and international destinations. With over 20 years of experience, their service guarantees a memorable journey.
        </p>

        <ul className="text-gray-700 mb-6 list-disc pl-6 space-y-2">
          <li>Customized tour packages</li>
          <li>Affordable rates</li>
          <li>24/7 customer support</li>
          <li>Trusted by over 50K travelers</li>
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
