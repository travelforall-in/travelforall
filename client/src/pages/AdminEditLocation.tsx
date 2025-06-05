import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "@/components/Sidebar";
import { toast } from "sonner";
import { Menu } from "lucide-react";

const EditLocationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [location, setLocation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/locations/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setLocation(res.data.data);
      } catch (error) {
        console.error("Failed to fetch location:", error);
        toast.error("Failed to load location data.");
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, [id, token]);

  const handleSidebarToggle = () => setIsCollapsed(!isCollapsed);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setLocation({ ...location, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/locations/${id}`, location, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Location updated successfully!");
      navigate("/admin/locations");
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update location.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully.");
    navigate("/login");
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

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
            <h2 className="text-2xl font-bold">Edit Location</h2>
          </div>
        </header>
        <div className="flex justify-start pl-20">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow-md space-y-5 w-full max-w-2xl"
          >
            {/* Location Name */}
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="name">
                Location Name
              </label>
              <input
                id="name"
                name="name"
                value={location.name}
                onChange={handleChange}
                className="w-full border rounded p-2"
                placeholder="e.g. Bali"
                required
              />
            </div>

            {/* Country */}
            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="country"
              >
                Country
              </label>
              <input
                id="country"
                name="country"
                value={location.country}
                onChange={handleChange}
                className="w-full border rounded p-2"
                placeholder="e.g. Indonesia"
                required
              />
            </div>

            {/* Region */}
            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="region"
              >
                Region
              </label>
              <input
                id="region"
                name="region"
                value={location.region}
                onChange={handleChange}
                className="w-full border rounded p-2"
                placeholder="e.g. Ubud"
              />
            </div>

            {/* Description */}
            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="description"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={location.description}
                onChange={handleChange}
                className="w-full border rounded p-2"
                placeholder="Short description of the location"
              />
            </div>

            {/* Best Time to Visit */}
            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="bestTimeToVisit"
              >
                Best Time to Visit
              </label>
              <input
                id="bestTimeToVisit"
                name="bestTimeToVisit"
                value={location.bestTimeToVisit}
                onChange={handleChange}
                className="w-full border rounded p-2"
                placeholder="e.g. November to April"
              />
            </div>

            {/* Popularity Index */}
            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="popularityIndex"
              >
                Popularity Index
              </label>
              <input
                id="popularityIndex"
                name="popularityIndex"
                type="number"
                value={location.popularityIndex}
                onChange={handleChange}
                className="w-full border rounded p-2"
                placeholder="e.g. 95"
              />
            </div>

            {/* Featured */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={location.featured}
                onChange={(e) =>
                  setLocation({ ...location, featured: e.target.checked })
                }
                className="w-4 h-4"
              />
              <label htmlFor="featured" className="text-sm font-medium">
                Mark as Featured
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
              >
                Update Location
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditLocationPage;
