import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "@/utils/baseUrl";

interface TravelPackage {
  _id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  status: string;
  specialRequests: string;
  activities: string[];
  accommodation: {
    type: string;
    preferredRating: number;
  };
  transportation: {
    flights: {
      required: boolean;
      preferredClass: string;
    };
    localTransport: string;
  };
  meals: {
    included: boolean;
    preferences: string[];
  };
  travelers: {
    adults: number;
    children: number;
    infants: number;
  };
  city: string;
  hotel: string;
  createdAt: string; // <-- Important: include this field in backend response
}

const CustomPackageDetails = () => {
  const [pkg, setPkg] = useState<TravelPackage[]>([]);
  const [error, setError] = useState("");
  const [cities, setCities] = useState<{ _id: string; name: string }[]>([]);
  const [hotels, setHotels] = useState<{ _id: string; name: string }[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pkgRes, cityRes, hotelRes] = await Promise.all([
          axios.get(`${BASE_URL}/custom-packages/user`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          axios.get(`${BASE_URL}/locations`),
          axios.get(`${BASE_URL}/hotels`),
        ]);

        // Filter out cancelled packages here
        const filteredPackages = pkgRes.data.data.filter(
          (pkg: TravelPackage) => pkg.status !== "cancelled"
        );

        setPkg(filteredPackages);
        setCities(cityRes.data.data);
        setHotels(hotelRes.data.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load data");
      }
    };

    fetchData();
  }, []);

  const handleCancel = async (id: string) => {
    try {
      await axios.put(
        `${BASE_URL}/custom-packages/${id}/cancel`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setPkg((prev) => prev.filter((item) => item._id !== id)); // remove from UI
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to cancel package");
    }
  };

  const cityMap = new Map(cities.map((city) => [city._id, city.name]));
  const hotelMap = new Map(hotels.map((hotel) => [hotel._id, hotel.name]));

  return (
    <div className="p-4 bg-orange-50 min-h-screen">
      <div className="mb-6">
        <button
          onClick={() => navigate("/custom-Packages")}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium"
        >
          ⬅️ Back to Dashboard
        </button>
      </div>

      {error && (
        <p className="text-red-600 text-center mt-10 font-medium">{error}</p>
      )}

      {pkg.length === 0 ? (
        <p className="text-gray-600 text-lg text-center mt-16">
          🚫 You haven’t created any custom travel packages yet.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pkg.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="mb-3">
                <p className="text-sm text-gray-500">
                  <strong>📍 City:</strong> {cityMap.get(item.city) || "N/A"}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>🏨 Hotel:</strong> {hotelMap.get(item.hotel) || "N/A"}
                </p>
              </div>

              <h2 className="text-xl font-bold mb-1 text-orange-700">
                {item.name}
              </h2>
              <p className="text-xs text-gray-400 mb-3">
                🗓️ Created on: {new Date(item.createdAt).toLocaleDateString()}
              </p>

              <p className="text-sm text-gray-600 mb-1">
                <strong>📍 Destination:</strong> {item.destination}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>📅 Travel Dates:</strong>{" "}
                {new Date(item.startDate).toLocaleDateString()} to{" "}
                {new Date(item.endDate).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>💰 Budget:</strong> ₹{item.budget}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>📌 Status:</strong>{" "}
                <span
                  className={
                    item.status === "cancelled"
                      ? "text-red-600"
                      : "text-green-700"
                  }
                >
                  {item.status}
                </span>
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>🏨 Accommodation:</strong> {item.accommodation?.type} (
                {item.accommodation?.preferredRating}★)
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>🚗 Transport:</strong>{" "}
                {item.transportation?.flights?.required
                  ? "Flight"
                  : "No Flight"}{" "}
                ({item.transportation?.flights?.preferredClass}) &{" "}
                {item.transportation?.localTransport}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>🍽️ Meals:</strong>{" "}
                {item.meals?.included ? "Included" : "Not Included"} -{" "}
                {item.meals?.preferences?.join(", ") || "None"}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>🎯 Activities:</strong>{" "}
                {item.activities?.join(", ") || "None"}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>👨‍👩‍👧 Travelers:</strong> {item.travelers?.adults} Adults,{" "}
                {item.travelers?.children} Children, {item.travelers?.infants}{" "}
                Infants
              </p>
              <p className="text-sm text-gray-600">
                <strong>📌 Requests:</strong> {item.specialRequests || "None"}
              </p>

              <div className="mt-4 flex justify-between gap-2">
                <button
                  onClick={() =>
                    navigate(`/custom-packages/add`, {
                      state: { packageData: item },
                    })
                  }
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                  ✏️ Update
                </button>
                <button
                  onClick={() => handleCancel(item._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                  ❌ Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomPackageDetails;
