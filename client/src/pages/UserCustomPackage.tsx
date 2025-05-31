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
}

const UserCustomPackage = () => {
  const navigate = useNavigate();
  const [pkg, setPkg] = useState<TravelPackage[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/custom-packages/user`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setPkg(response.data.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load package");
      }
    };

    fetchPackage();
  }, []);

  const handleCancel = async (id: string) => {
    try {
      await axios.put(
        `${BASE_URL}/custom-packages/${id}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setPkg((prev) => prev.filter((pkg) => pkg._id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to cancel package");
    }
  };

  return (
    <div className="p-4 bg-orange-50 min-h-screen">
      {/* Navbar */}
      <div className="flex justify-between items-center bg-white shadow-lg px-6 py-5 rounded-2xl mb-6 border border-orange-200">
        <h1 className="text-2xl font-bold text-green-700">🎒 Your Custom Packages</h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/")}
            className="bg-orange-200 hover:bg-orange-300 text-orange-900 font-semibold px-4 py-2 rounded-2xl shadow"
          >
            ← Home
          </button>
          <button
            onClick={() => navigate("/custom-packages/add")}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-2xl shadow"
          >
            + Create Package
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && <p className="text-red-600 text-center mt-10 font-medium">{error}</p>}

      {/* No Packages */}
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
              <div>
                <h2 className="text-xl font-bold mb-3 text-orange-700">{item.name}</h2>
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
                  <span className="capitalize text-green-700 font-semibold">{item.status}</span>
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>🏨 Accommodation:</strong> {item.accommodation.type} (
                  {item.accommodation.preferredRating}★)
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>🚗 Transport:</strong>{" "}
                  {item.transportation.flights.required ? "Flight" : "No Flight"} (
                  {item.transportation.flights.preferredClass}) &{" "}
                  {item.transportation.localTransport}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>🍽️ Meals:</strong>{" "}
                  {item.meals.included ? "Included" : "Not Included"} -{" "}
                  {item.meals.preferences.join(", ")}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>🎯 Activities:</strong> {item.activities.join(", ")}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>👨‍👩‍👧 Travelers:</strong> {item.travelers.adults} Adults,{" "}
                  {item.travelers.children} Children, {item.travelers.infants} Infants
                </p>
                <p className="text-sm text-gray-600">
                  <strong>📌 Requests:</strong> {item.specialRequests}
                </p>
              </div>

              {/* Buttons */}
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

export default UserCustomPackage;
