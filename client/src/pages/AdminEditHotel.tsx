import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import Sidebar from "@/components/Sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Menu } from "lucide-react";

interface RoomType {
  id: string;
  type: string;
  sleeps: number;
  price: number;
  description: string;
}

const EditHotelPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const [hotel, setHotel] = useState<any>({
    name: "",
    address: "",
    description: "",
    rating: "",
    category: "",
    priceRange: { min: "", max: "" },
    contactInfo: { phone: "", email: "", website: "" },
    policies: { checkIn: "", checkOut: "", cancellation: "" },
    amenities: [],
    roomTypes: [],
  });

  const handleSidebarToggle = () => setIsCollapsed(!isCollapsed);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully.");
    navigate("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(`http://localhost:5000/api/hotels/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setHotel(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        toast.error("Failed to fetch hotel data");
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setHotel((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (section: string, field: string, value: any) => {
    setHotel((prev: any) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const handleRoomChange = (index: number, field: string, value: any) => {
    const updatedRooms = [...hotel.roomTypes];
    updatedRooms[index][field] = value;
    setHotel((prev: any) => ({ ...prev, roomTypes: updatedRooms }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.put(`http://localhost:5000/api/hotels/${id}`, hotel, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Hotel updated successfully");
      navigate("/admin/hotels");
    } catch (err) {
      toast.error("Failed to update hotel");
    }
  };

  if (loading) return <div className="p-10">Loading...</div>;

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
            <h2 className="text-2xl font-bold">Edit Hotel: {hotel.name}</h2>
          </div>
        </header>
        <div className="flex justify-start pl-20">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-xl shadow-md space-y-6 w-full max-w-5xl"
          >
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Name</Label>
                <Input name="name" value={hotel.name} onChange={handleChange} />
              </div>
              <div>
                <Label>Category</Label>
                <Input
                  name="category"
                  value={hotel.category}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label>Address</Label>
                <Input
                  name="address"
                  value={hotel.address}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label>Rating</Label>
                <Input
                  type="number"
                  step="0.1"
                  name="rating"
                  value={hotel.rating}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <Label>Description</Label>
              <Textarea
                name="description"
                value={hotel.description}
                onChange={handleChange}
              />
            </div>

            {/* Price Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Min Price</Label>
                <Input
                  type="number"
                  value={hotel.priceRange.min}
                  onChange={(e) =>
                    handleNestedChange("priceRange", "min", e.target.value)
                  }
                />
              </div>
              <div>
                <Label>Max Price</Label>
                <Input
                  type="number"
                  value={hotel.priceRange.max}
                  onChange={(e) =>
                    handleNestedChange("priceRange", "max", e.target.value)
                  }
                />
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Phone</Label>
                <Input
                  value={hotel.contactInfo?.phone}
                  onChange={(e) =>
                    handleNestedChange("contactInfo", "phone", e.target.value)
                  }
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={hotel.contactInfo?.email}
                  onChange={(e) =>
                    handleNestedChange("contactInfo", "email", e.target.value)
                  }
                />
              </div>
              <div>
                <Label>Website</Label>
                <Input
                  value={hotel.contactInfo?.website}
                  onChange={(e) =>
                    handleNestedChange("contactInfo", "website", e.target.value)
                  }
                />
              </div>
            </div>

            {/* Policies */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Check-in</Label>
                <Input
                  type="time"
                  value={hotel.policies?.checkIn}
                  onChange={(e) =>
                    handleNestedChange("policies", "checkIn", e.target.value)
                  }
                />
              </div>
              <div>
                <Label>Check-out</Label>
                <Input
                  type="time"
                  value={hotel.policies?.checkOut}
                  onChange={(e) =>
                    handleNestedChange("policies", "checkOut", e.target.value)
                  }
                />
              </div>
              <div>
                <Label>Cancellation Policy</Label>
                <Input
                  value={hotel.policies?.cancellation}
                  onChange={(e) =>
                    handleNestedChange(
                      "policies",
                      "cancellation",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>

            {/* Amenities */}
            <div>
              <Label>Amenities (comma separated)</Label>
              <Input
                value={hotel.amenities.join(", ")}
                onChange={(e) =>
                  setHotel({
                    ...hotel,
                    amenities: e.target.value.split(",").map((a) => a.trim()),
                  })
                }
              />
            </div>

            {/* Room Types */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Room Types</h2>
              {hotel.roomTypes.map((room: RoomType, index: number) => (
                <div
                  key={room.id}
                  className="border rounded-md p-4 grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div>
                    <Label>Type</Label>
                    <Input
                      value={room.type}
                      onChange={(e) =>
                        handleRoomChange(index, "type", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label>Price</Label>
                    <Input
                      type="number"
                      value={room.price}
                      onChange={(e) =>
                        handleRoomChange(index, "price", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label>Sleeps</Label>
                    <Input
                      type="number"
                      value={room.sleeps}
                      onChange={(e) =>
                        handleRoomChange(index, "sleeps", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={room.description}
                      onChange={(e) =>
                        handleRoomChange(index, "description", e.target.value)
                      }
                    />
                  </div>
                </div>
              ))}
            </div>

            <Button type="submit" className="mt-4">
              Update Hotel
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditHotelPage;
