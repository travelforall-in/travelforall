import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Menu } from "lucide-react";

const Destination = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
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
        <header className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold">Choose Destination Type</h1>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Domestic Button */}
          <div
            onClick={() => navigate("/admin/destination/domestic")}
            className="cursor-pointer border rounded-2xl p-6 hover:shadow-lg transition-all bg-blue-50"
          >
            <h2 className="text-xl font-semibold text-blue-600">Domestic</h2>
            <p className="text-sm text-gray-600 mt-2">
              Manage cities and packages within your country.
            </p>
          </div>

          {/* International Button */}
          <div
            onClick={() => navigate("/admin/destination/international")}
            className="cursor-pointer border rounded-2xl p-6 hover:shadow-lg transition-all bg-yellow-50"
          >
            <h2 className="text-xl font-semibold text-yellow-600">
              International
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Manage cities and packages across the globe.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Destination;
