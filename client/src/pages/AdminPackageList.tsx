import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "@/components/Sidebar";
import { toast } from "sonner";
import { Menu, Bell, User } from "lucide-react";

interface TravelPackage {
  id: string;
  name: string;
  destination: string;
  price: number;
  duration: string;
  status: "Active" | "Inactive";
}

const PackageListPage: React.FC = () => {
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackages = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("Admin token not found. Please log in.");
        return;
      }

      try {
        const res = await axios.get(
          "http://localhost:5000/api/admin/packages",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("API response:", res.data);
        setPackages(res.data.data);
      } catch (error) {
        console.error("Failed to fetch packages:", error);
      }
    };

    fetchPackages();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredPackages = packages.filter((pkg) =>
    pkg.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully.");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar
        isCollapsed={isCollapsed}
        onLogout={handleLogout}
        onPackageClick={() => navigate("/admin/package-list")}
        onManageUsersClick={() => navigate("/admin/manage-users")}
        onDashboardClick={() => navigate("/admin/dashboard")}
      />
      <div className="flex-1 p-6 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Menu
              className="text-2xl cursor-pointer"
              onClick={() => setIsCollapsed(!isCollapsed)}
            />
            <h1 className="text-2xl font-bold">Travel Packages</h1>
          </div>
          <button
            className="bg-orange-600 text-white px-4 py-2 rounded"
            onClick={() => navigate("/admin/create-package")}
          >
            + Create Package
          </button>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search packages..."
            value={searchTerm}
            onChange={handleSearch}
            className="border border-gray-300 p-2 rounded w-full max-w-md"
          />
        </div>

        <table className="w-full border border-gray-200 shadow-md rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Destination</th>
              <th className="text-left p-3">Duration</th>
              <th className="text-left p-3">Price</th>
              <th className="text-left p-3">Type</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPackages.map((pkg) => (
              <tr key={pkg.id} className="border-t">
                <td className="p-3">{pkg.name}</td>
                <td className="p-3">{pkg.destination}</td>
                <td className="p-3">
                  {pkg.duration?.days || 0} Days, {pkg.duration?.nights || 0}{" "}
                  Nights
                </td>
                <td className="p-3">${pkg.price}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-white text-sm ${
                      pkg.type === "international"
                        ? "bg-green-600"
                        : "bg-amber-500"
                    }`}
                  >
                    {pkg.type}
                  </span>
                </td>
                <td className="p-3 space-x-2">
                  <button className="text-blue-600 hover:underline">
                    Edit
                  </button>
                  <button className="text-red-600 hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredPackages.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center p-4 text-gray-500">
                  No packages found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PackageListPage;
