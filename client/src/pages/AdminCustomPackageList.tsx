import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import Sidebar from "@/components/Sidebar";
import { Menu, Hotel, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CustomPackage {
  _id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  status: string;
  travelers: {
    adults: number;
    children: number;
    infants: number;
  };
  transportation: {
    flights?: {
      preferredClass?: string;
      required?: boolean;
    };
    localTransport?: string;
  };
  accommodation: {
    type: string;
    preferredRating: number;
    requirements: string[];
  };
  meals: {
    included: boolean;
    preferences: string[];
  };
  activities: string[];
  user: {
    name: string;
    email: string;
    phone: string;
  };
}

const AdminCustomPackagesPage = () => {
  const [packages, setPackages] = useState<CustomPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const packagesPerPage = 6;

  const navigate = useNavigate();

  const handleSidebarToggle = () => setIsCollapsed((prev) => !prev);

  useEffect(() => {
    const fetchCustomPackages = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/api/admin/custom-packages",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPackages(response.data.data);
      } catch (error) {
        console.error("Failed to fetch custom packages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomPackages();
  }, []);

  const totalPages = Math.ceil(packages.length / packagesPerPage);
  const startIndex = (currentPage - 1) * packagesPerPage;
  const currentPackages = packages.slice(
    startIndex,
    startIndex + packagesPerPage
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        isCollapsed={isCollapsed}
        onLogout={() => {
          localStorage.removeItem("adminToken");
          window.location.href = "/admin/login";
        }}
        onDashboardClick={() => navigate("/admin/dashboard")}
        onManageUsersClick={() => navigate("/admin/users")}
        onBookingsClick={() => navigate("/admin/bookings")}
        onDestinationClick={() => navigate("/admin/destination")}
        onPackageClick={() => navigate("/admin/package-list")}
        onCustomPackageClick={() => {}}
      />

      <div className="flex-1 p-4 -ml-3 md:p-7 max-w-screen-xl mx-auto">
        <header className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={handleSidebarToggle}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold">Custom Packages</h2>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/admin/hotels")}
              className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 text-sm rounded-lg transition"
            >
              <Hotel size={18} />
              Hotel
            </button>
            <button
              onClick={() => navigate("/admin/locations")}
              className="flex items-center gap-2 bg-green-100 hover:bg-green-200 text-green-800 px-4 py-2 text-sm rounded-lg transition"
            >
              <MapPin size={18} />
              Location
            </button>
          </div>
        </header>

        {loading ? (
          <p>Loading packages...</p>
        ) : (
          <>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {currentPackages.map((pkg) => (
                <div
                  key={pkg._id}
                  className="bg-white shadow border rounded-lg p-4"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-bold text-zinc-800">
                      📦 {pkg.name} ({pkg.destination})
                    </h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        pkg.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : pkg.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {pkg.status}
                    </span>
                  </div>

                  <p className="text-sm text-zinc-600 mb-2">
                    📅 {format(new Date(pkg.startDate), "MMM dd, yyyy")} –{" "}
                    {format(new Date(pkg.endDate), "MMM dd, yyyy")}
                  </p>

                  <p className="text-sm mb-1">💰 Budget: ₹{pkg.budget}</p>

                  <p className="text-sm">
                    🧍 Adults: {pkg.travelers.adults}, 🧒 Children:{" "}
                    {pkg.travelers.children}, 👶 Infants:{" "}
                    {pkg.travelers.infants}
                  </p>

                  <p className="text-sm mt-2">
                    ✈️ Flight Class:{" "}
                    {pkg.transportation?.flights?.preferredClass || "N/A"}
                  </p>
                  <p className="text-sm">
                    🚗 Local: {pkg.transportation?.localTransport || "N/A"}
                  </p>

                  <p className="text-sm mt-2">
                    🏨 {pkg.accommodation.type} (
                    {pkg.accommodation.preferredRating}★)
                  </p>

                  <p className="text-sm">
                    🍽️ Meals: {pkg.meals.included ? "Included" : "Not Included"}{" "}
                    | {pkg.meals.preferences.join(", ")}
                  </p>

                  <p className="text-sm">
                    🎯 Activities: {pkg.activities.join(", ")}
                  </p>

                  <div className="mt-3 border-t pt-2 text-sm text-zinc-500">
                    👤 {pkg.user?.name} <br />
                    📧 {pkg.user?.email} <br />
                    📞 {pkg.user?.phone}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-center items-center gap-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-1 rounded border text-sm bg-white hover:bg-gray-100 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-1 rounded border text-sm bg-white hover:bg-gray-100 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminCustomPackagesPage;
