import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import Sidebar from "../components/Sidebar";
import { Menu } from "lucide-react";

const EditPackagePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const [formData, setFormData] = useState({
    name: "",
    destination: "",
    price: 0,
    type: "domestic", // or "international"
    duration: {
      days: 0,
      nights: 0,
    },
  });

  useEffect(() => {
    const fetchPackage = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Admin token not found. Please login again.");
        navigate("/login");
        return;
      }

      try {
        const res = await axios.get(
          `http://localhost:5000/api/packages/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFormData(res.data.data);
      } catch (err) {
        toast.error("Failed to fetch package data.");
        console.error(err);
      }
    };

    fetchPackage();
  }, [id, navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "days" || name === "nights") {
      setFormData((prev) => ({
        ...prev,
        duration: {
          ...prev.duration,
          [name]: Number(value),
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Admin token not found. Please login again.");
      navigate("/login");
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/packages/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Package updated successfully!");
      navigate("/admin/package-list");
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to update package.");
    }
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
        className={`flex-1 py-10 bg-gray-50 min-h-screen transition-all duration-300 ${
          isCollapsed ? "ml-20" : "ml-64"
        }`}
      >
        <header className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold -ml-2.5">Edit Travel Package</h1>
        </header>
        <div className="max-w-2xl mx-auto bg-white p-6 shadow-2xl rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Package Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Destination
              </label>
              <input
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (₹)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Package Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="domestic">Domestic</option>
                <option value="international">International</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (Days)
                </label>
                <input
                  type="number"
                  name="days"
                  value={formData.duration.days}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (Nights)
                </label>
                <input
                  type="number"
                  name="nights"
                  value={formData.duration.nights}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-[#F97015] text-white px-4 py-2 rounded hover:bg-[#ea6207] w-full"
            >
              Update Package
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPackagePage;
