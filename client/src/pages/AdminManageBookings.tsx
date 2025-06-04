import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Menu } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";

const BOOKINGS_PER_PAGE = 4;

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [editableBookings, setEditableBookings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const adminToken = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const fetchBookings = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/bookings", {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });
      const editable = res.data.data.map((b) => ({
        ...b,
        editableBookingStatus: b.bookingStatus,
        editablePaymentStatus: b.paymentStatus,
      }));
      setBookings(editable);
      setEditableBookings(editable);
    } catch (err) {
      toast.error("Failed to fetch bookings");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const indexOfLast = currentPage * BOOKINGS_PER_PAGE;
  const indexOfFirst = indexOfLast - BOOKINGS_PER_PAGE;
  const currentBookings = editableBookings.slice(indexOfFirst, indexOfLast);

  const handleStatusChange = (index, field, value) => {
    const updated = [...editableBookings];
    const globalIndex = indexOfFirst + index;
    updated[globalIndex][field] = value;
    setEditableBookings(updated);
  };

  const handleUpdate = async (id, bookingStatus, paymentStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/bookings/${id}`,
        {
          bookingStatus,
          paymentStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );
      toast.success("Booking updated successfully");
      navigate("/admin/bookings");
      fetchBookings();
    } catch (err) {
      toast.error("Failed to update booking");
    }
  };

  const handleCancel = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/bookings/${id}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );
      toast.success("Booking cancelled successfully");
      navigate("/admin/bookings");
      fetchBookings();
    } catch (err) {
      toast.error("Failed to cancel booking");
    }
  };

  const totalPages = Math.ceil(bookings.length / BOOKINGS_PER_PAGE);

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
            <h1 className="text-2xl font-bold">Manage Bookings</h1>
          </div>
        </header>

        {currentBookings.map((booking, index) => (
          <Card key={booking._id} className="mb-4">
            <CardContent className="p-4 space-y-2">
              <p>
                <strong>User:</strong> {booking.user?.name}
              </p>
              <p>
                <strong>Package:</strong> {booking.package?.name}
              </p>
              <p>
                <strong>Total Price:</strong> ₹{booking.totalPrice}
              </p>
              <p>
                <strong>Travel Date:</strong>{" "}
                {new Date(booking.travelDate).toLocaleDateString()}
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Booking Status
                  </label>
                  <Select
                    value={booking.editableBookingStatus}
                    onValueChange={(val) =>
                      handleStatusChange(index, "editableBookingStatus", val)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Payment Status
                  </label>
                  <Select
                    value={booking.editablePaymentStatus}
                    onValueChange={(val) =>
                      handleStatusChange(index, "editablePaymentStatus", val)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-4 mt-4">
                <Button
                  className="mt-2"
                  onClick={() =>
                    handleUpdate(
                      booking._id,
                      booking.editableBookingStatus,
                      booking.editablePaymentStatus
                    )
                  }
                >
                  Update Booking
                </Button>
                {(booking.bookingStatus === "pending" ||
                  booking.bookingStatus === "confirmed" ||
                  booking.paymentStatus === "pending" ||
                  booking.paymentStatus === "completed") && (
                  <Button
                    className="mt-2"
                    variant="destructive"
                    onClick={() => handleCancel(booking._id)}
                  >
                    Cancel Booking
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Pagination Controls */}
        <div className="flex justify-center items-center mt-6 gap-4">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ManageBookings;
