import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface Package {
  _id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  dateRange?: {
    startDate?: string;
    endDate?: string;
  };
}

interface LocationState {
  data?: Package[];
  destination?: string;
  checkIn?: string;
  checkOut?: string;
}

const SearchResultsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | null;

  // Safely extract data with defaults
  const data = Array.isArray(state?.data) ? state.data : [];
  const destination = state?.destination || "All Destinations";
  const checkIn = state?.checkIn;
  const checkOut = state?.checkOut;

  const handlePackageClick = (pkg: Package) => {
    navigate(`/package/${pkg._id}`, { state: { package: pkg } });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">
          Packages {destination !== "All Destinations" ? `for ${destination}` : ''}
        </h2>
        {(checkIn || checkOut) && (
          <p className="text-gray-600">
            {checkIn && `From: ${formatDate(checkIn)} `}
            {checkOut && `To: ${formatDate(checkOut)}`}
          </p>
        )}
      </div>

      {data.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-lg">No packages found for your search criteria.</p>
          <button 
            onClick={() => navigate('/packages')}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition"
          >
            Browse All Packages
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((pkg) => (
            <div
              key={pkg._id}
              className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition"
              onClick={() => handlePackageClick(pkg)}
            >
              <img
                src={pkg.image || 'https://via.placeholder.com/300x200?text=No+Image'}
                alt={pkg.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold">{pkg.title || 'Untitled Package'}</h3>
                {pkg.dateRange?.startDate && (
                  <p className="text-sm text-gray-500 mt-1">
                    {formatDate(pkg.dateRange.startDate)}
                    {pkg.dateRange.endDate && ` - ${formatDate(pkg.dateRange.endDate)}`}
                  </p>
                )}
                <p className="text-gray-600 mt-2 line-clamp-2">
                  {pkg.description || 'No description available'}
                </p>
                <p className="text-primary font-bold mt-4">
                  ₹{pkg.price?.toLocaleString('en-IN') || 'Price not available'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;