import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "@/components/Sidebar";
import { Menu, Plus, Pencil, Trash2, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Hotel {
  _id: string;
  name: string;
  address: string;
  rating: number;
  category: string;
  description: string;
  location: {
    name: string;
    country: string;
  };
  priceRange: {
    min: number;
    max: number;
  };
  amenities: string[];
  fullImageUrls: string[];
}

const AdminHotelsPage = () => {
  const [search, setSearch] = useState("");
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully.");
    navigate("/login");
  };

  const fetchHotels = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/hotels/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHotels(res.data.data);
    } catch (error) {
      console.error("Error fetching hotels:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (search.trim() === "") {
      fetchHotels();
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:5000/api/hotels/search?keyword=${search}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setHotels(res.data.data);
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this hotel?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/hotels/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHotels((prev) => prev.filter((hotel) => hotel._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleSidebarToggle = () => setIsCollapsed((prev) => !prev);

  useEffect(() => {
    fetchHotels();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        isCollapsed={isCollapsed}
        onLogout={handleLogout}
        onDashboardClick={() => navigate("/admin/dashboard")}
        onManageUsersClick={() => navigate("/admin/users")}
        onBookingsClick={() => navigate("/admin/bookings")}
        onDestinationClick={() => navigate("/admin/destination")}
        onPackageClick={() => navigate("/admin/package-list")}
        onCustomPackageClick={() => navigate("/admin/custom-packages")}
      />

      <div className="flex-1 p-4 -ml-3 md:p-7 max-w-screen-xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3">
          <div className="flex items-center gap-4">
            <button
              onClick={handleSidebarToggle}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold">Hotels</h2>
          </div>

          <div className="flex gap-2 items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  if (e.target.value === "") fetchHotels();
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="border border-gray-300 rounded-lg px-3 py-1.5 pr-10 text-sm w-60 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <button
                onClick={handleSearch}
                className="absolute right-2 top-1.5 text-gray-500 hover:text-gray-700"
              >
                <Search size={18} />
              </button>
            </div>
            <button
              onClick={() => navigate("/admin/hotels/create")}
              className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 text-sm rounded-lg transition"
            >
              <Plus size={18} />
              Add Hotel
            </button>
          </div>
        </header>

        {loading ? (
          <p>Loading hotels...</p>
        ) : hotels.length === 0 ? (
          <p>No hotels found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels.map((hotel) => (
              <div
                key={hotel._id}
                className="bg-white rounded-lg shadow border p-4 flex flex-col justify-between"
              >
                {hotel.fullImageUrls.length > 0 && (
                  <img
                    src={hotel.fullImageUrls[0]}
                    alt={hotel.name}
                    className="h-40 w-full object-cover rounded-md mb-3"
                  />
                )}

                <div>
                  <h3 className="text-lg font-bold text-zinc-800">
                    🏨 {hotel.name}
                  </h3>
                  <p className="text-sm text-zinc-500">{hotel.address}</p>
                  <p className="text-sm mt-1">
                    🌍 {hotel.location.name}, {hotel.location.country}
                  </p>
                  <p className="text-sm">
                    ⭐ {hotel.rating} | {hotel.category}
                  </p>
                  <p className="text-sm mt-1 text-zinc-600 line-clamp-2">
                    {hotel.description}
                  </p>
                  <p className="text-sm mt-2 text-zinc-700">
                    💰 ₹{hotel.priceRange.min} – ₹{hotel.priceRange.max}
                  </p>
                  <p className="text-sm text-zinc-500 mt-1">
                    🛎️ Amenities: {hotel.amenities.join(", ")}
                  </p>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => navigate(`/admin/hotels/edit/${hotel._id}`)}
                    className="flex items-center gap-1 px-3 py-1 text-sm text-indigo-600 bg-indigo-100 hover:bg-indigo-200 rounded transition"
                  >
                    <Pencil size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(hotel._id)}
                    className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 bg-red-100 hover:bg-red-200 rounded transition"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminHotelsPage;
