import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import BASE_URL from "@/utils/baseUrl";

interface Hotel {
  _id: string;
  name: string;
  description: string;
  fullImageUrls: string[];
  address: string;
  rating: number;
  category: string;
  amenities: string[];
  priceRange: { min: number; max: number };
  contactInfo: {
    phone: string;
    email: string;
    website: string;
  };
  policies: {
    checkIn: string;
    checkOut: string;
    cancellation: string;
  };
  roomTypes: {
    _id: string;
    type: string;
    sleeps: number;
    price: number;
    amenities: string[];
    description: string;
  }[];
}

const HotelDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState<Hotel | null>(null);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/hotels/${id}`);
        if (res.data?.data) {
          setHotel(res.data.data);
        } else {
          console.warn("Hotel not found.");
        }
      } catch (error) {
        console.error("Error fetching hotel:", error);
      }
    };
    fetchHotel();
  }, [id]);

  if (!hotel) return <p className="p-4">Loading hotel details...</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white rounded-xl shadow-md">
      {/* Top controls: Back button, Hotel name, Create Package button */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded-2xl shadow"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-bold text-green-700">{hotel.name}</h1>

        <button
          onClick={() => navigate("/custom-packages/add")}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-2xl shadow"
        >
          + Create Package
        </button>
      </div>

      {/* Hotel Images */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {hotel.fullImageUrls.length > 0 ? (
          hotel.fullImageUrls.map((url, idx) => (
            <img
              key={idx}
              src={url}
              alt={`Hotel ${idx}`}
              className="w-full h-60 object-cover rounded"
            />
          ))
        ) : (
          <p className="text-sm text-gray-500">No images available.</p>
        )}
      </div>

      {/* Description, Address, Rating, Price */}
      <p className="text-gray-700 mb-2">{hotel.description}</p>
      <p className="text-sm text-gray-600">📍 {hotel.address}</p>
      <p className="text-sm text-gray-600">
        ⭐ {hotel.rating} | 🏷️ {hotel.category}
      </p>
      <p className="text-sm text-gray-800 mt-2">
        💰 Price Range: ₹{hotel.priceRange.min} - ₹{hotel.priceRange.max}
      </p>

      {/* Amenities */}
      <h2 className="text-xl font-semibold mt-6 text-green-800">Amenities</h2>
      <div className="flex flex-wrap gap-2 mt-1">
        {hotel.amenities.length > 0 ? (
          hotel.amenities.map((a, i) => (
            <span
              key={i}
              className="bg-green-300 text-green-900 px-2 py-1 rounded text-xs"
            >
              {a}
            </span>
          ))
        ) : (
          <span className="text-sm text-gray-500">No amenities listed.</span>
        )}
      </div>

      {/* Policies */}
      {hotel.policies && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-green-800">Policies</h2>
          <ul className="text-sm text-gray-700 mt-1 space-y-1 list-disc ml-6">
            <li>🕒 Check-In: {hotel.policies.checkIn}</li>
            <li>🕘 Check-Out: {hotel.policies.checkOut}</li>
            <li>❌ Cancellation: {hotel.policies.cancellation}</li>
          </ul>
        </div>
      )}

      {/* Contact Info */}
      {hotel.contactInfo && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-green-800">Contact Info</h2>
          <p className="text-sm text-gray-700">📞 {hotel.contactInfo.phone}</p>
          <p className="text-sm text-gray-700">✉️ {hotel.contactInfo.email}</p>
          <p className="text-sm text-gray-700">
            🌐{" "}
            <a
              href={hotel.contactInfo.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              {hotel.contactInfo.website}
            </a>
          </p>
        </div>
      )}

      {/* Room Types */}
      {hotel.roomTypes && hotel.roomTypes.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-green-800 mb-2">
            Available Room Types
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hotel.roomTypes.map((room) => (
              <div
                key={room._id}
                className="border p-4 rounded shadow-sm bg-gray-50"
              >
                <h3 className="font-semibold text-lg text-green-700">
                  {room.type}
                </h3>
                <p className="text-sm text-gray-600">🛏 Sleeps: {room.sleeps}</p>
                <p className="text-sm text-gray-600">💸 Price: ₹{room.price}</p>
                <p className="text-sm text-gray-700 mt-1">{room.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {room.amenities.map((amenity, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded"
                    >
                      {amenity}
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

export default HotelDetailsPage;
