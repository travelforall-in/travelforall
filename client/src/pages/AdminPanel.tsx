import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import {
  Package,
  Users,
  ChartBar,
  User,
  FileSignatureIcon,
  Menu,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import axios from "axios";

const DashboardCard = ({
  icon,
  title,
  value,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  color: string;
}) => (
  <Card className="flex-1">
    <CardContent className="p-4 flex items-center gap-4">
      <div className={`p-2 rounded-full ${color}`}>{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-lg font-bold">{value}</p>
      </div>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [user, setUser] = useState<{ name?: string; role?: string }>({});
  const [dashboardData, setDashboardData] = useState<{
    totalUsers?: number;
    totalPackages?: number;
    totalBookings?: number;
    recentUsers?: { name: string; email: string; _id: string }[];
    packageStats?: {
      domestic?: { count?: number };
      international?: { count?: number };
    };
  }>({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (!storedUser || storedUser.role !== "admin") {
      toast.error("Unauthorized access. Please log in as admin.");
      navigate("/login");
    } else {
      setUser(storedUser);
    }
  }, [navigate]);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:5000/api/admin/dashboard",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        // console.log("Dashboard API response:", res.data);
        const {
          overview = {},
          recentUsers = [],
          packageStats = {},
        } = res.data.data || {};
        setDashboardData({ ...overview, recentUsers, packageStats });
      } catch (err) {
        toast.error("Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully.");
    navigate("/login");
  };

  return (
    <div className="flex">
      <Sidebar
        isCollapsed={isCollapsed}
        onLogout={handleLogout}
        onPackageClick={() => navigate("/admin/package-list")}
        onManageUsersClick={() => navigate("/admin/manage-users")}
        onDashboardClick={() => navigate("/admin/dashboard")}
        onDestinationClick={() => navigate("/admin/destination")}
      />
      <div className="flex-1 p-6 bg-gray-50 min-h-screen">
        <header className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold">Dashboard</h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-600 hidden md:block">
              {user?.name || "Admin"}
            </span>
            <User className="w-6 h-6" />
          </div>
        </header>

        {loading ? (
          <div className="text-center py-10">Loading dashboard...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <DashboardCard
                icon={<Users size={20} />}
                title="Total Users"
                value={dashboardData.totalUsers ?? 0}
                color="bg-blue-100 text-blue-600"
              />
              <DashboardCard
                icon={<Package size={20} />}
                title="Total Packages"
                value={dashboardData.totalPackages ?? 0}
                color="bg-green-100 text-green-600"
              />
              <DashboardCard
                icon={<ChartBar size={20} />}
                title="Total Bookings"
                value={dashboardData.totalBookings ?? 0}
                color="bg-purple-100 text-purple-600"
              />
              <DashboardCard
                icon={<FileSignatureIcon size={20} />}
                title="Recent Users"
                value={dashboardData.recentUsers?.length ?? 0}
                color="bg-yellow-100 text-yellow-600"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-4">Recent Users</h3>
                  <ul className="divide-y divide-gray-200">
                    {dashboardData.recentUsers &&
                    dashboardData.recentUsers.length > 0 ? (
                      dashboardData.recentUsers.map((u) => (
                        <li key={u._id} className="py-2 flex flex-col">
                          <span className="font-medium">{u.name}</span>
                          <span className="text-xs text-gray-500">
                            {u.email}
                          </span>
                        </li>
                      ))
                    ) : (
                      <li className="py-2 text-gray-500">
                        No recent users found.
                      </li>
                    )}
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-4">Package Stats</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        Domestic Packages:
                      </span>
                      <span>
                        {dashboardData.packageStats?.domestic?.count ?? 0}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        International Packages:
                      </span>
                      <span>
                        {dashboardData.packageStats?.international?.count ?? 0}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
