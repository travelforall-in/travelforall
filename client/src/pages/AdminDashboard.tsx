import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Users, BarChart2, Settings } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (!user || user.role !== "admin") {
      toast.error("Unauthorized access. Please log in as admin.");
      navigate("/login");
    }
  }, [navigate, user]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully.");
    navigate("/login");
  };

  return (
    <>
      <Navbar />
      <div className="pt-16 flex flex-grow">
        {/* Sidebar */}
        <aside className="w-64 bg-white p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-6 text-primary">
            Admin Panel
          </h2>
          <nav className="space-y-4">
            <button className="flex items-center gap-2 text-gray-700 hover:text-primary">
              <Users className="w-5 h-5" />
              Manage Users
            </button>
            <button className="flex items-center gap-2 text-gray-700 hover:text-primary">
              <BarChart2 className="w-5 h-5" />
              Reports
            </button>
            <button className="flex items-center gap-2 text-gray-700 hover:text-primary">
              <Settings className="w-5 h-5" />
              Settings
            </button>

            <button
              className="flex items-center gap-2 text-gray-700 hover:text-primary"
              onClick={() => navigate("/admin/create-package")}
            >
              <Settings className="w-5 h-5" />
              Create Package
            </button>
          </nav>

          <div className="mt-10">
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="w-full"
            >
              <LogOut className="mr-2 h-5 w-5" />
              Logout
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-grow p-10">
          <h1 className="text-3xl font-semibold text-gray-800 mb-4">
            Welcome, {user.name || "Admin"}
          </h1>
          <p className="text-gray-600 mb-8">Here is your dashboard overview.</p>

          {/* Example Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow text-center">
              <p className="text-sm text-gray-500">Total Users</p>
              <p className="text-2xl font-bold text-blue-600">1287</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow text-center">
              <p className="text-sm text-gray-500">Pending Reports</p>
              <p className="text-2xl font-bold text-red-500">42</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow text-center">
              <p className="text-sm text-gray-500">New Signups</p>
              <p className="text-2xl font-bold text-green-600">67</p>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default AdminDashboard;
