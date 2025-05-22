import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "@/components/Sidebar";
import { Menu } from "lucide-react";

interface City {
  _id: string;
  name: string;
  country: string;
  description: string;
  weather: string;
  images?: string[];
  fullImageUrls?: string[];
}

const DomesticDestination = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/states/type/international"
        );
        setCities(response.data.data);
      } catch (err) {
        setError("Failed to fetch cities.");
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar
        isCollapsed={isCollapsed}
        onLogout={handleLogout}
        onPackageClick={() => navigate("/admin/package-list")}
        onManageUsersClick={() => navigate("/admin/manage-users")}
        onDashboardClick={() => navigate("/admin/dashboard")}
        onDestinationClick={() => navigate("/admin/destination")}
      />
      <div className="flex-1 p-6 bg-gray-50 min-h-screen">
        <header className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold flex-1">
            International Destinations
          </h2>
          <button
            className="bg-[#F97015] text-white px-4 py-2 rounded hover:bg-[#ea6207] transition"
            onClick={() => navigate("/admin/create-city")}
          >
            + Add New City
          </button>
        </header>
        <p className="mb-4 text-gray-600">
          Manage cities and packages across the globe. Below is a list of
          international cities you can manage.
        </p>

        {loading ? (
          <p>Loading cities...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {cities.map((city) => (
              <div
                key={city._id}
                className="p-4 border rounded-lg shadow bg-white hover:shadow-md transition flex flex-col"
              >
                {city.fullImageUrls && city.fullImageUrls.length > 0 ? (
                  <img
                    src={city.fullImageUrls[0]}
                    alt={city.name}
                    className="w-full h-40 object-cover rounded mb-3"
                  />
                ) : (
                  <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded mb-3 text-gray-400">
                    No Image
                  </div>
                )}
                <h3 className="text-xl font-bold mb-1">
                  {city.name.charAt(0).toUpperCase() + city.name.slice(1)}
                </h3>
                <p className="text-lg font-[nunito] text-[#097C70] mb-1 font-bold">
                  Country: {city.country}
                </p>
                <p className="text-sm text-gray-700 mb-2 leading-relaxed font-medium line-clamp-2">
                  {city.description}
                </p>
                <p className="text-sm text-blue-800 font-semibold mb-3">
                  Weather: {city.weather}
                </p>

                {/* View Packages Button */}
                <button
                  onClick={() => navigate(`/admin/city/${city._id}/packages`)}
                  className="mt-auto bg-[#097C70] text-white px-3 py-2 rounded hover:bg-[#06655a] transition text-sm"
                >
                  View Packages
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DomesticDestination;
