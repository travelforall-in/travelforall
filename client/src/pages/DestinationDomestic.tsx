import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "@/components/Sidebar";
import { Menu } from "lucide-react";

interface State {
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
  const [states, setStates] = useState<State[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/states/type/domestic"
        );
        setStates(response.data.data);
      } catch (err) {
        setError("Failed to fetch states.");
      } finally {
        setLoading(false);
      }
    };

    fetchStates();
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
          <h2 className="text-2xl font-bold flex-1">Domestic Destinations</h2>
          <button
            className="bg-[#F97015] text-white px-4 py-2 rounded hover:bg-[#ea6207] transition"
            onClick={() => navigate("/admin/create-state")}
          >
            + Add New State
          </button>
        </header>

        <p className="mb-4 text-gray-600">
          Manage states and their cities. Click on any state to manage its
          cities.
        </p>

        {loading ? (
          <p>Loading states...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {states.map((state) => (
              <div
                key={state._id}
                className="p-4 border rounded-lg shadow bg-white hover:shadow-md transition flex flex-col"
              >
                {state.fullImageUrls && state.fullImageUrls.length > 0 ? (
                  <img
                    src={state.fullImageUrls[0]}
                    alt={state.name}
                    className="w-full h-40 object-cover rounded mb-3"
                  />
                ) : (
                  <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded mb-3 text-gray-400">
                    No Image
                  </div>
                )}
                <h3 className="text-xl font-bold mb-1">
                  {state.name.charAt(0).toUpperCase() + state.name.slice(1)}
                </h3>
                <p className="text-lg font-[nunito] text-[#097C70] mb-1 font-bold">
                  Country: {state.country}
                </p>
                <p className="text-sm text-gray-700 mb-2 leading-relaxed font-medium line-clamp-2">
                  {state.description}
                </p>
                <p className="text-sm text-blue-800 font-semibold mb-3">
                  Weather: {state.weather}
                </p>

                {/* Updated Button */}
                <button
                  onClick={() => navigate(`/admin/state/${state._id}/packages`)}
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
