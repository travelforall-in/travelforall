// pages/HotelDetailsPage.tsx
import { useLocation, useNavigate } from "react-router-dom";

const HotelDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const hotel = location.state?.hotel;

  if (!hotel) {
    return <div className="p-6 text-red-500">Hotel data not found.</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-2xl border border-gray-200">
      <button onClick={() => navigate(-1)} className="mb-4 text-blue-600 underline">
        ← Back
      </button>
      <img src={hotel.fullImageUrls[0]} alt={hotel.name} className="w-full h-64 object-cover rounded-xl mb-4" />
      <h1 className="text-2xl font-bold text-green-700">{hotel.name}</h1>
      <p className="text-gray-700 mt-2">{hotel.description}</p>
      <p className="mt-2 text-gray-800">📍 Address: {hotel.address}</p>
      <p className="mt-1 text-gray-800">💰 Price Range: ${hotel.priceRange.min} - ${hotel.priceRange.max}</p>
      <p className="mt-1 text-gray-800">⭐ Rating: {hotel.rating}</p>
      <div className="mt-2">
        <h2 className="font-semibold text-gray-700">🧰 Amenities:</h2>
        <div className="flex flex-wrap gap-2 mt-1">
          {hotel.amenities.map((a: string, i: number) => (
            <span key={i} className="bg-green-500 text-white text-sm px-2 py-1 rounded">
              {a}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HotelDetailsPage;
