import React from "react";
import { useLocation } from "react-router-dom";

const SearchResultsPage = () => {
  const location = useLocation();
  const { data = [], from, to, checkIn, checkOut } = location.state || {};

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-4">
        Packages from {from || "N/A"} to {to || "N/A"}
      </h2>
      <p className="text-gray-600 mb-8">
        Check-in: {checkIn || "N/A"} | Check-out: {checkOut || "N/A"}
      </p>

      {data.length === 0 ? (
        <p>No packages found for this route.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((pkg) => (
            <div
              key={pkg._id}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <img
                src={pkg.image}
                alt={pkg.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold">{pkg.title}</h3>
                <p className="text-gray-600 mt-2">{pkg.description}</p>
                <p className="text-primary font-bold mt-4">₹{pkg.price}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;
