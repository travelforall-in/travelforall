// src/components/PartnerSection.tsx
import React from "react";
import { Link } from "react-router-dom";
import PartnerLogo from "@/images/PartnerLogo.jpg";

const PartnerSection: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12">
          Our Trusted Product Partner
        </h2>

        {/* Horizontal Flexbox Card */}
        <div className="flex flex-col md:flex-row bg-white rounded-xl shadow p-6 md:p-10 items-center md:items-start space-y-6 md:space-y-0 md:space-x-20 transition-shadow duration-300 hover:shadow-2xl">
          <img
            src={PartnerLogo}
            alt="OCEANLUX Air Purifier"
            className="w-72 h-72 object-cover rounded-xl flex-shrink-0 shadow-lg border-2 border-gray-200"
          />

          <div className="text-center md:text-left flex-grow max-w-xl">
            <h3 className="text-3xl mb-2 font-[neue_machina] font-semibold">
              OCEANLUX AIR PURIFIER
            </h3>
            <blockquote className="italic text-gray-800 text-sm font-medium mb-4 -mt-2">
              “More than a lamp — it purifies, soothes, and elevates your
              space.”
            </blockquote>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2 text-base md:text-lg">
              <li>Cleans air naturally, silently</li>
              <li>Elegant design, zero clutter.</li>
              <li>Eco-smart, hotel-ready solution</li>
            </ul>
            <button
              onClick={() =>
                window.open(
                  "https://oceanlux.in/",
                  "_blank",
                  "noopener,noreferrer"
                )
              }
              className="inline-block mt-3 bg-gradient-to-r from-orange-400 to-orange-600 text-white px-6 py-2 rounded-md shadow cursor-pointer transition-all duration-300 hover:from-orange-500 hover:to-orange-700 hover:bg-gradient-to-l hover:shadow-xl focus:outline-none"
              type="button"
            >
              Click to know more →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnerSection;
