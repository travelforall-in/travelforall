// UserCustomNavbar.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "@/utils/baseUrl";

interface City {
  _id: string;
  name: string;
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

interface Transport {
  _id: string;
  name: string;
  type: string;
  description: string;
  operator: string;
  amenities: string[];
  contactInfo: {
    phone: string;
    email: string;
    website: string;
  };
}

const UserCustomNavbar = () => {
  const navigate = useNavigate();
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [transportations, setTransportations] = useState<Transport[]>([]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/locations`);
        if (Array.isArray(res.data)) {
          setCities(res.data);
        } else if (res.data?.data && Array.isArray(res.data.data)) {
          setCities(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };
    fetchCities();
  }, []);

  const fetchCityData = async (cityId: string) => {
    try {
      const [hotelRes, transportRes] = await Promise.all([
        axios.get(`${BASE_URL}/locations/${cityId}/hotels`),
        axios.get(`${BASE_URL}/locations/${cityId}/transportation`)
      ]);

      setHotels(hotelRes.data?.data || []);
      setTransportations(transportRes.data?.data || []);
    } catch (error) {
      console.error("Error fetching city data:", error);
    }
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cityId = e.target.value;
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
          <button
            onClick={() => navigate("/custom-packages/add")}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-2xl shadow"
          >
            + Create Package
          </button>
        </div>
      </div>

      {/* City Dropdown */}
      <div className="flex items-center gap-3">
        <label htmlFor="city" className="font-medium text-gray-700">
          🌍 Choose a City:
        </label>
        <select
          id="city"
          value={selectedCity}
          onChange={handleCityChange}
          className="px-4 py-2 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">-- Select City --</option>
          {cities.map((city) => (
            <option key={city._id} value={city._id}>
              {city.name}
            </option>
          ))}
        </select>
      </div>

      {/* Hotels Section */}
      {hotels.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-orange-700 mt-4 mb-2">🏨 Hotels</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hotels.map((hotel) => (
              <div
                key={hotel._id}
                className="cursor-pointer bg-white rounded-xl shadow border p-4 hover:shadow-md transition"
                onClick={() => navigate(`/hotels/${hotel._id}`, { state: { hotel } })}
              >
                <img
                  src={hotel.fullImageUrls[0]}
                  alt={hotel.name}
                  className="w-full h-40 object-cover rounded-md mb-2"
                />
                <h3 className="text-lg font-bold text-green-700">{hotel.name}</h3>
                <p className="text-sm text-gray-600">{hotel.description}</p>
                <p className="text-sm text-gray-800 mt-2">📍 {hotel.address}</p>
                <p className="text-sm text-gray-800">💰 ${hotel.priceRange.min} - ${hotel.priceRange.max}</p>
                <div className="flex flex-wrap gap-1 mt-2 text-xs text-white">
                  {hotel.amenities.map((a, i) => (
                    <span key={i} className="bg-green-500 px-2 py-1 rounded">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transportation Section */}
      {transportations.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-blue-700 mt-6 mb-2">🚆 Transportation Options</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {transportations.map((transport) => (
              <div key={transport._id} className="bg-white rounded-xl shadow border p-4 hover:shadow-md transition">
                <h3 className="text-lg font-bold text-blue-800">{transport.name}</h3>
                <p className="text-sm text-gray-600 italic">{transport.type} operated by {transport.operator}</p>
                <p className="text-sm text-gray-700 mt-2">{transport.description}</p>
                <div className="mt-2 text-sm text-gray-800">
                  📞 {transport.contactInfo.phone}<br />
                  📧 {transport.contactInfo.email}<br />
                  🔗 <a href={`https://${transport.contactInfo.website}`} target="_blank" className="text-blue-600 underline">
                    Website
                  </a>
                </div>
                <div className="flex flex-wrap gap-1 mt-2 text-xs text-white">
                  {transport.amenities.map((a, i) => (
                    <span key={i} className="bg-blue-500 px-2 py-1 rounded">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserCustomNavbar;
