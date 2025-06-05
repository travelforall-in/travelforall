import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Sidebar from "@/components/Sidebar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Menu } from "lucide-react";

const CreateHotelPage = () => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [locations, setLocations] = useState([]);
  const [hotelData, setHotelData] = useState({
    name: "",
    location: "",
    address: "",
    description: "",
    rating: "",
    category: "",
    amenities: "",
    minPrice: "",
    maxPrice: "",
    contactPhone: "",
    contactEmail: "",
    contactWebsite: "",
    checkIn: "",
    checkOut: "",
    cancellation: "",
  });

  useEffect(() => {
    const fetchLocations = async () => {
      const token = localStorage.getItem("token");
      if (!token) return toast.error("Admin token missing");

      try {
        const res = await axios.get("http://localhost:5000/api/locations", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("response", res.data);
        setLocations(res.data.data || []);
      } catch (err) {
        console.error("Location fetch failed:", err);
        toast.error("Failed to fetch locations");
      }
    };

    fetchLocations();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setHotelData({ ...hotelData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return toast.error("Admin token missing");

    try {
      const payload = {
        name: hotelData.name,
        location: hotelData.location,
        address: hotelData.address,
        description: hotelData.description,
        rating: parseFloat(hotelData.rating),
        category: hotelData.category,
        amenities: hotelData.amenities.split(",").map((a) => a.trim()),
        priceRange: {
          min: parseInt(hotelData.minPrice),
          max: parseInt(hotelData.maxPrice),
        },
        roomTypes: [],
        contactInfo: {
          phone: hotelData.contactPhone,
          email: hotelData.contactEmail,
          website: hotelData.contactWebsite,
        },
        policies: {
          checkIn: hotelData.checkIn,
          checkOut: hotelData.checkOut,
          cancellation: hotelData.cancellation,
        },
      };

      await axios.post("http://localhost:5000/api/hotels/", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Hotel added successfully");
      navigate("/admin/hotels");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add hotel");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully.");
    navigate("/login");
  };

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
            <h2 className="text-2xl font-bold">Add New Hotel</h2>
          </div>
        </header>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow p-6 space-y-6"
        >
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Hotel Name</Label>
              <Input
                name="name"
                value={hotelData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label>Location</Label>
              <select
                name="location"
                value={hotelData.location}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md p-2 mt-1 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23666%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px_12px] bg-[right_8px_center] bg-no-repeat pr-8"
              >
                <option value="">Select a Location</option>
                {locations.map((loc) => (
                  <option key={loc._id} value={loc._id}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <Label>Address</Label>
              <Input
                name="address"
                value={hotelData.address}
                onChange={handleChange}
                required
              />
            </div>
            <div className="md:col-span-2">
              <Label>Description</Label>
              <Textarea
                name="description"
                value={hotelData.description}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label>Rating</Label>
              <Input
                name="rating"
                value={hotelData.rating}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label>Category</Label>
              <Input
                name="category"
                value={hotelData.category}
                onChange={handleChange}
                required
              />
            </div>
            <div className="md:col-span-2">
              <Label>Amenities (comma separated)</Label>
              <Input
                name="amenities"
                value={hotelData.amenities}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Min Price</Label>
              <Input
                name="minPrice"
                value={hotelData.minPrice}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label>Max Price</Label>
              <Input
                name="maxPrice"
                value={hotelData.maxPrice}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label>Phone</Label>
              <Input
                name="contactPhone"
                value={hotelData.contactPhone}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                name="contactEmail"
                value={hotelData.contactEmail}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Website</Label>
              <Input
                name="contactWebsite"
                value={hotelData.contactWebsite}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Policies */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label>Check-in Time</Label>
              <Input
                name="checkIn"
                value={hotelData.checkIn}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Check-out Time</Label>
              <Input
                name="checkOut"
                value={hotelData.checkOut}
                onChange={handleChange}
              />
            </div>
            <div className="md:col-span-3">
              <Label>Cancellation Policy</Label>
              <Input
                name="cancellation"
                value={hotelData.cancellation}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
            >
              Add Hotel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateHotelPage;
