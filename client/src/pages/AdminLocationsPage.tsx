import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "@/components/Sidebar";
import { Menu, Plus, Pencil, Trash2, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Attraction {
  name: string;
  description: string;
}

interface Location {
  _id: string;
  name: string;
  country: string;
  region: string;
  description: string;
  bestTimeToVisit: string;
  weather: {
    summer: string;
    winter: string;
    rainy: string;
  };
  travelTips: string[];
  attractions: Attraction[];
  popularityIndex: number;
  fullImageUrls: string[];
}

const AdminLocationsPage = () => {
  const [search, setSearch] = useState("");
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/locations", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLocations(res.data.data);
    } catch (error) {
      console.error("Error fetching locations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this location?"))
      return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/locations/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLocations((prev) => prev.filter((loc) => loc._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleSidebarToggle = () => setIsCollapsed(!isCollapsed);

  const handleSearch = async () => {
    if (search.trim() === "") {
      fetchLocations();
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:5000/api/locations/search?keyword=${search}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setLocations(res.data.data);
    } catch (error) {
      console.error("Error during search:", error);
    }
  };

  useEffect(() => {
    if (search.trim() === "") {
      fetchLocations();
    }
  }, [search]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully.");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        isCollapsed={isCollapsed}
        onLogout={handleLogout}
        onPackageClick={() => navigate("/admin/package-list")}
        onManageUsersClick={() => navigate("/admin/manage-users")}
        onDashboardClick={() => navigate("/admin/dashboard")}
        onDestinationClick={() => navigate("/admin/destination")}
        onBookingsClick={() => navigate("/admin/bookings")}
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
            <h2 className="text-2xl font-bold">Locations</h2>
          </div>

          <div className="flex gap-2 items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
              onClick={() => navigate("/admin/locations/create")}
              className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 text-sm rounded-lg transition"
            >
              <Plus size={18} />
              Add Location
            </button>
          </div>
        </header>

        {loading ? (
          <p>Loading locations...</p>
        ) : locations.length === 0 ? (
          <p>No locations found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {locations.map((loc) => (
              <div
                key={loc._id}
                className="bg-white rounded-lg shadow border p-4 flex flex-col justify-between"
              >
                {loc.fullImageUrls.length > 0 && (
                  <img
                    src={loc.fullImageUrls[0]}
                    alt={loc.name}
                    className="h-40 w-full object-cover rounded-md mb-3"
                  />
                )}

                <div>
                  <h3 className="text-lg font-bold text-zinc-800">
                    📍 {loc.name}
                  </h3>
                  <p className="text-sm text-zinc-500">
                    {loc.region}, {loc.country}
                  </p>
                  <p className="text-sm mt-1 text-zinc-600 line-clamp-2">
                    {loc.description}
                  </p>
                  <p className="text-sm mt-2 text-zinc-700">
                    🌦️ Best Time: {loc.bestTimeToVisit}
                  </p>
                  <p className="text-sm">🔥 Summer: {loc.weather.summer}</p>
                  <p className="text-sm">❄️ Winter: {loc.weather.winter}</p>
                  <p className="text-sm">🌧️ Rainy: {loc.weather.rainy}</p>
                  <p className="text-sm mt-1">
                    🎯 Attractions:{" "}
                    {loc.attractions.map((a) => a.name).join(", ")}
                  </p>
                  <p className="text-sm text-zinc-500">
                    💡 Tips: {loc.travelTips.slice(0, 2).join(", ")}...
                  </p>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => navigate(`/admin/locations/edit/${loc._id}`)}
                    className="flex items-center gap-1 px-3 py-1 text-sm text-indigo-600 bg-indigo-100 hover:bg-indigo-200 rounded transition"
                  >
                    <Pencil size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(loc._id)}
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

export default AdminLocationsPage;
