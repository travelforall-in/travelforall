import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import Sidebar from "@/components/Sidebar";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";

interface User {
  _id: string;
  name: string;
  phone: string;
}

const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Stored Token:", token);

      const response = await axios.get(
        "http://localhost:5000/api/admin/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers(response.data.data || []);
    } catch (error) {
      toast.error("Failed to fetch users.");
    }
  };

  const handleDelete = async (_id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        const token = localStorage.getItem("adminToken");
        await axios.delete(`http://localhost:5000/api/admin/users/${_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("User deleted successfully!");
        fetchUsers();
      } catch (error) {
        toast.error("Failed to delete user.");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully.");
    navigate("/login");
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm)
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <div className="flex">
      <Sidebar
        isCollapsed={isCollapsed}
        onLogout={handleLogout}
        onPackageClick={() => navigate("/admin/package-list")}
        onManageUsersClick={() => navigate("/admin/manage-users")}
        onDashboardClick={() => navigate("/admin/dashboard")}
      />
      <div className="flex-1 p-6 bg-gray-50 min-h-screen">
        <header className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Menu
              className="text-2xl cursor-pointer"
              onClick={() => setIsCollapsed(!isCollapsed)}
            />
            <h2 className="text-2xl font-bold">Manage Users</h2>
          </div>
          <div className="flex items-center gap-4"></div>
        </header>
        <input
          type="text"
          placeholder="Search by name or phone"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-full md:w-1/3 mb-4"
        />
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Phone</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <tr key={user._id} className="text-center">
                <td className="p-2 border">{user.name}</td>
                <td className="p-2 border">{user.phone}</td>
                <td className="p-2 border">
                  <button
                    className="text-blue-500 mr-4"
                    onClick={() => alert("Edit logic here")}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-500"
                    onClick={() => handleDelete(user._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {totalPages > 1 && (
          <div className="flex justify-center mt-4">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-3 py-1 border rounded mx-1 ${
                  currentPage === index + 1 ? "bg-blue-500 text-white" : ""
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
