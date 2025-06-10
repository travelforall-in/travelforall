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
  amenities?: string[];
  priceRange: { min: number; max: number };
  location?: {
    name: string;
    country: string;
  };
  contactInfo?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  policies?: {
    checkIn?: string;
    checkOut?: string;
    cancellation?: string;
  };
  roomTypes?: {
    _id: string;
    type: string;
    sleeps: number;
    price: number;
    amenities?: string[];
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
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-4 py-2 rounded"
        >
          ← Back
        </button>
        <h1 className="text-2xl md:text-3xl font-bold text-green-700 text-center">
          {hotel.name}
        </h1>
        <button
          onClick={() => navigate("/custom-packages/add")}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded"
        >
          + Create Package
        </button>
      </div>

      {/* Images */}
      {hotel.fullImageUrls?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {hotel.fullImageUrls.map((url, i) => (
            <img
              key={i}
              src={url}
              alt={`Hotel Image ${i + 1}`}
              className="rounded h-64 object-cover w-full"
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No images available.</p>
      )}

      {/* Hotel Info */}
      <div className="space-y-2 text-gray-700 mb-6">
        <p className="text-lg">{hotel.description}</p>
        <p>📍 {hotel.address}</p>
        <p>
          🌍 {hotel.location?.name}, {hotel.location?.country}
        </p>
        <p>
          ⭐ {hotel.rating} | 🏷️ {hotel.category}
        </p>
        <p>
          💰 Price Range: ₹{hotel.priceRange.min} - ₹{hotel.priceRange.max}
        </p>
      </div>

      {/* Amenities */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-green-800 mb-2">Amenities</h2>
        <div className="flex flex-wrap gap-2">
          {hotel.amenities?.length ? (
            hotel.amenities.map((amenity, index) => (
              <span
                key={index}
                className="bg-green-200 text-green-900 px-2 py-1 rounded text-xs"
              >
                {amenity}
              </span>
            ))
          ) : (
            <p className="text-sm text-gray-500">No amenities listed.</p>
          )}
        </div>
      </div>

      {/* Policies */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-green-800 mb-1">Policies</h2>
        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
          <li>🕒 Check-In: {hotel.policies?.checkIn ?? "Not specified"}</li>
          <li>🕘 Check-Out: {hotel.policies?.checkOut ?? "Not specified"}</li>
          <li>❌ Cancellation: {hotel.policies?.cancellation ?? "Not specified"}</li>
        </ul>
      </div>

      {/* Contact Info */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-green-800 mb-1">
          Contact Information
        </h2>
        {hotel.contactInfo ? (
          <>
            <p>📞 {hotel.contactInfo.phone || "N/A"}</p>
            <p>✉️ {hotel.contactInfo.email || "N/A"}</p>
            <p>
              🌐{" "}
              {hotel.contactInfo.website ? (
                <a
                  href={hotel.contactInfo.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  {hotel.contactInfo.website}
                </a>
              ) : (
                "N/A"
              )}
            </p>
          </>
        ) : (
          <p className="text-sm text-gray-500">No contact information available.</p>
        )}
      </div>

      {/* Room Types */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-green-800 mb-2">
          Available Room Types
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {hotel.roomTypes?.length ? (
            hotel.roomTypes.map((room) => (
              <div
                key={room._id}
                className="border bg-gray-50 p-4 rounded-lg shadow-sm"
              >
                <h3 className="text-lg font-semibold text-green-700">
                  {room.type}
                </h3>
                <p className="text-sm text-gray-600">🛏 Sleeps: {room.sleeps}</p>
                <p className="text-sm text-gray-600">💸 ₹{room.price}</p>
                <p className="text-sm mt-1">{room.description}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {room.amenities?.length ? (
                    room.amenities.map((item, i) => (
                      <span
                        key={i}
                        className="bg-green-100 text-green-900 text-xs px-2 py-1 rounded"
                      >
                        {item}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400">No amenities listed.</span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No room types available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HotelDetailsPage;
