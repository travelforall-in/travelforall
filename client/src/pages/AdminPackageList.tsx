import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "@/components/Sidebar";
import { toast } from "sonner";
import { Menu, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

interface TravelPackage {
  id: string;
  name: string;
  destination: string;
  price: number;
  type: "domestic" | "international";
  duration: {
    days: number;
    nights: number;
  };
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

  const handleDelete = async (packageId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this package?"
    );
    if (!confirmed) return;

    const token = localStorage.getItem("token");

    try {
      await axios.delete(`http://localhost:5000/api/packages/${packageId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPackages((prev) => prev.filter((pkg) => pkg.id !== packageId));
      toast.success("Package deleted successfully.");
    } catch (error) {
      console.error("Failed to delete package:", error);
      toast.error("Failed to delete package. Please try again.");
    }
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
        onDestinationClick={() => navigate("/admin/destination")}
        onBookingsClick={() => navigate("/admin/bookings")}
      />
      <div
        className={`flex-1 p-6 bg-gray-50 min-h-screen transition-all duration-300 ${
          isCollapsed ? "ml-20" : "ml-64"
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold -ml-2.5">Travel Packages</h1>
          </div>
          <button
            className="bg-[#F97015] text-white px-4 py-2 rounded hover:bg-[#ea6207]"
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
                <td className="p-3">₹ {pkg.price}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-white text-sm ${
                      pkg.type === "international"
                        ? "bg-rose-500"
                        : "bg-gray-500"
                    }`}
                  >
                    {pkg.type}
                  </span>
                </td>
                <td className="p-3 space-x-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Edit Package"
                        onClick={() =>
                          navigate(`/admin/edit-package/${pkg.id}`)
                        }
                        className="transition-transform hover:scale-110 hover:bg-blue-50"
                      >
                        <Pencil className="w-4 h-4 text-blue-600" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Edit</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="destructive"
                        size="icon"
                        aria-label="Delete Package"
                        onClick={() => handleDelete(pkg.id)}
                        className="transition-transform hover:scale-110 hover:bg-red-600"
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Delete</TooltipContent>
                  </Tooltip>
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
