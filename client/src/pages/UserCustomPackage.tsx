import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "@/utils/baseUrl";

interface City {
  _id: string;
  name: string;
  country: string;
}

interface Hotel {
  _id: string;
  name: string;
  description: string;
  fullImageUrls: string[];
  rating: number;
  address: string;
  priceRange: { min: number; max: number };
  amenities: string[];
}

const UserCustomNavbar = () => {
  const navigate = useNavigate();
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [showCities, setShowCities] = useState<boolean>(false);

  const fetchCitiesInIndia = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/locations?country=India`);
      if (Array.isArray(res.data)) {
        setCities(res.data);
      } else if (res.data?.data && Array.isArray(res.data.data)) {
        setCities(res.data.data);
      }
      setShowCities(true);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const fetchCityData = async (cityId: string) => {
    try {
      const res = await axios.get(`${BASE_URL}/locations/${cityId}/hotels`);
      setHotels(res.data?.data || []);
    } catch (error) {
      console.error("Error fetching hotels for city:", error);
    }
  };

  const handleCityClick = (cityId: string) => {
    setSelectedCity(cityId);
    fetchCityData(cityId);
  };

  return (
    <div className="flex flex-col gap-6 bg-white shadow-lg px-6 py-5 rounded-2xl border border-orange-200">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-green-700">🎒 Your Custom Packages</h1>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => navigate("/")}
            className="bg-orange-200 hover:bg-orange-300 text-orange-900 font-semibold px-4 py-2 rounded-2xl shadow"
          >
            ← Home
          </button>
          <button
            onClick={() => navigate("/custom-packages/view")}
            className="bg-blue-200 hover:bg-blue-300 text-blue-900 font-semibold px-4 py-2 rounded-2xl shadow"
          >
            👁️ View Custom Packages
          </button>
        </div>
      </div>

      {/* India Button */}
      <button
        onClick={fetchCitiesInIndia}
        className="w-fit bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded shadow"
      >
        Show Cities in India
      </button>

      {/* Cities List */}
      {showCities && (
        <div className="mt-4 flex flex-wrap gap-3">
          {cities.length > 0 ? (
            cities.map((city) => (
              <button
                key={city._id}
                onClick={() => handleCityClick(city._id)}
                className={`px-4 py-2 border rounded-lg shadow-sm ${
                  selectedCity === city._id
                    ? "bg-green-200 font-semibold"
                    : "hover:bg-green-50"
                }`}
              >
                {city.name}
              </button>
            ))
          ) : (
            <p>No cities available.</p>
          )}
        </div>
      )}

      {/* Hotels Section */}
      {hotels.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-orange-700 mt-6 mb-2">
            🏨 Hotels in {cities.find(c => c._id === selectedCity)?.name}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hotels.map((hotel) => (
              <div
                key={hotel._id}
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/hotels/${hotel._id}`, { state: { hotel } })}
                onKeyDown={(e) => {
                  if (e.key === "Enter") navigate(`/hotels/${hotel._id}`, { state: { hotel } });
                }}
                className="border p-4 rounded-lg shadow hover:shadow-md cursor-pointer"
              >
                <img
                  src={hotel.fullImageUrls[0] || "/placeholder.jpg"}
                  alt={hotel.name}
                  className="w-full h-40 object-cover rounded mb-2"
                />
                <h3 className="text-lg font-semibold text-green-800">{hotel.name}</h3>
                <p className="text-sm text-gray-600">{hotel.address}</p>
                <p className="text-sm">⭐ {hotel.rating}</p>
                <p className="text-sm text-green-700">
                  ₹{hotel.priceRange.min} - ₹{hotel.priceRange.max}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserCustomNavbar;
