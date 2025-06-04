import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "@/components/Sidebar";
import { toast } from "sonner";
import { Menu, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Booking {
  _id: string;
  user: { name: string; email: string };
  package: { name: string; type: string; destination: string };
  travelers: { adults: number; children: number; infants: number };
  travelerDetails: { name: string; _id: string }[];
  contactDetails: { email: string; phone: string };
  travelDate: string;
  totalPrice: number;
  paymentStatus: string;
  bookingStatus: string;
  specialRequests: string;
  createdAt: string;
}

const ITEMS_PER_PAGE = 4;

const BookingList: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const adminToken = localStorage.getItem("token");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/admin/bookings",
          {
            headers: {
              Authorization: `Bearer ${adminToken}`,
            },
          }
        );
        setBookings(res.data.data);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Something went wrong!");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully.");
    navigate("/login");
  };

  const totalPages = Math.ceil(bookings.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedBookings = bookings.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin w-6 h-6 text-blue-500" />
        <span className="ml-2 text-gray-500">Loading bookings...</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600 text-center mt-4">{error}</div>;
  }

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
            <h1 className="text-2xl font-bold">All Bookings</h1>
          </div>
          <button
            onClick={() => navigate("/admin/manage-bookings")}
            className="bg-[#F97015] px-3 py-2 rounded-md text-white hover:bg-[#ea6207]"
          >
            Manage Bookings
          </button>
        </header>

        <div className="grid gap-4 md:grid-cols-2">
          {paginatedBookings.map((booking) => (
            <Card key={booking._id} className="shadow-lg">
              <CardContent className="p-4">
                <h3 className="text-xl font-semibold mb-2">
                  {booking.package?.name}
                </h3>
                <div className="text-sm text-gray-600 mb-2">
                  <span>Type: {booking.package?.type}</span> |{" "}
                  <span>Destination: {booking.package?.destination}</span>
                </div>
                <div className="mb-2">
                  <strong>User:</strong> {booking.user?.name} (
                  {booking.user?.email})
                </div>
                <div className="mb-2">
                  <strong>Travelers:</strong> {booking.travelers.adults} Adults,{" "}
                  {booking.travelers.children} Children,{" "}
                  {booking.travelers.infants} Infants
                </div>
                <div className="mb-2">
                  <strong>Traveler Names:</strong>{" "}
                  {booking.travelerDetails.map((t) => t.name).join(", ")}
                </div>
                <div className="mb-2">
                  <strong>Travel Date:</strong>{" "}
                  {new Date(booking.travelDate).toLocaleDateString()}
                </div>
                <div className="mb-2">
                  <strong>Contact:</strong> {booking.contactDetails.phone} |{" "}
                  {booking.contactDetails.email}
                </div>
                <div className="mb-2">
                  <strong>Special Requests:</strong>{" "}
                  {booking.specialRequests || "None"}
                </div>
                <div className="flex gap-2 my-2 flex-wrap">
                  <Badge variant="secondary">
                    ₹ {booking.totalPrice.toFixed(2)}
                  </Badge>
                  <Badge
                    className={
                      booking.paymentStatus === "pending"
                        ? "bg-yellow-400"
                        : "bg-green-500"
                    }
                  >
                    Payment: {booking.paymentStatus}
                  </Badge>
                  <Badge
                    className={
                      booking.bookingStatus === "pending"
                        ? "bg-yellow-400"
                        : "bg-green-500"
                    }
                  >
                    Status: {booking.bookingStatus}
                  </Badge>
                </div>
                <div className="text-xs text-gray-400">
                  Booked on: {new Date(booking.createdAt).toLocaleString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center items-center mt-6 gap-4">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={handleNext}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingList;
