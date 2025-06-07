import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/Sidebar";
import { Menu } from "lucide-react";

const CreateLocationPage = () => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [locationData, setLocationData] = useState({
    name: "",
    country: "",
    region: "",
    description: "",
    bestTimeToVisit: "",
    travelTips: [""],
    weather: {
      summer: "",
      winter: "",
      rainy: "",
    },
    popularityIndex: "",
    featured: false,
  });

  const [attractions, setAttractions] = useState<
    { name: string; description: string }[]
  >([{ name: "", description: "" }]);

  const [image, setImage] = useState<File | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setLocationData({ ...locationData, [name]: value });
  };

  const handleWeatherChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocationData({
      ...locationData,
      weather: { ...locationData.weather, [e.target.name]: e.target.value },
    });
  };

  const handleAttractionChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updated = [...attractions];
    updated[index][field as "name" | "description"] = value;
    setAttractions(updated);
  };

  const addAttraction = () =>
    setAttractions([...attractions, { name: "", description: "" }]);

  const handleTipChange = (index: number, value: string) => {
    const tips = [...locationData.travelTips];
    tips[index] = value;
    setLocationData({ ...locationData, travelTips: tips });
  };

  const addTip = () =>
    setLocationData({
      ...locationData,
      travelTips: [...locationData.travelTips, ""],
    });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) return toast.error("Admin token missing");

    try {
      const formData = new FormData();
      formData.append("name", locationData.name);
      formData.append("country", locationData.country);
      formData.append("region", locationData.region);
      formData.append("description", locationData.description);
      formData.append("bestTimeToVisit", locationData.bestTimeToVisit);
      formData.append("popularityIndex", locationData.popularityIndex);
      formData.append("featured", locationData.featured.toString());
      formData.append("weather[summer]", locationData.weather.summer);
      formData.append("weather[winter]", locationData.weather.winter);
      formData.append("weather[rainy]", locationData.weather.rainy);

      locationData.travelTips.forEach((tip, i) =>
        formData.append(`travelTips[${i}]`, tip)
      );
      attractions.forEach((att, i) => {
        formData.append(`attractions[${i}][name]`, att.name);
        formData.append(`attractions[${i}][description]`, att.description);
      });

      if (image) formData.append("images", image);

      await axios.post("http://localhost:5000/api/locations", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Location added successfully");
      navigate("/admin/locations");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add location");
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
      <div className="flex-1 p-4 md:p-8">
        <header className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold">Add New Location</h2>
          </div>
        </header>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow p-6 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Name</Label>
              <Input
                name="name"
                value={locationData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label>Country</Label>
              <Input
                name="country"
                value={locationData.country}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label>Region</Label>
              <Input
                name="region"
                value={locationData.region}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="md:col-span-2">
              <Label>Description</Label>
              <Textarea
                name="description"
                value={locationData.description}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label>Best Time to Visit</Label>
              <Input
                name="bestTimeToVisit"
                value={locationData.bestTimeToVisit}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label>Popularity Index</Label>
              <Input
                name="popularityIndex"
                value={locationData.popularityIndex}
                onChange={handleInputChange}
                type="number"
              />
            </div>
            <div className="flex items-center gap-2 mt-4">
              <input
                type="checkbox"
                id="featured"
                checked={locationData.featured}
                onChange={(e) =>
                  setLocationData({
                    ...locationData,
                    featured: e.target.checked,
                  })
                }
              />
              <Label htmlFor="featured">Featured</Label>
            </div>

            <div className="md:col-span-2">
              <Label>Image</Label>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <label className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 cursor-pointer transition-colors">
                    Choose File
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  {image && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>{image.name}</span>
                      <button
                        type="button"
                        onClick={() => setImage(null)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Weather */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label>Summer Weather</Label>
              <Input
                name="summer"
                value={locationData.weather.summer}
                onChange={handleWeatherChange}
              />
            </div>
            <div>
              <Label>Winter Weather</Label>
              <Input
                name="winter"
                value={locationData.weather.winter}
                onChange={handleWeatherChange}
              />
            </div>
            <div>
              <Label>Rainy Season</Label>
              <Input
                name="rainy"
                value={locationData.weather.rainy}
                onChange={handleWeatherChange}
              />
            </div>
          </div>

          {/* Travel Tips */}
          <div>
            <Label>Travel Tips</Label>
            {locationData.travelTips.map((tip, index) => (
              <Input
                key={index}
                value={tip}
                onChange={(e) => handleTipChange(index, e.target.value)}
                className="mb-2"
              />
            ))}
            <Button type="button" variant="outline" onClick={addTip}>
              + Add Tip
            </Button>
          </div>

          {/* Attractions */}
          <div>
            <Label>Attractions</Label>
            {attractions.map((att, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-2 items-center"
              >
                <Input
                  className="md:col-span-2"
                  placeholder="Attraction Name"
                  value={att.name}
                  onChange={(e) =>
                    handleAttractionChange(index, "name", e.target.value)
                  }
                />
                <Input
                  className="md:col-span-2"
                  placeholder="Description"
                  value={att.description}
                  onChange={(e) =>
                    handleAttractionChange(index, "description", e.target.value)
                  }
                />
                {index > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-zinc-700"
                    onClick={() => {
                      const updated = [...attractions];
                      updated.splice(index, 1);
                      setAttractions(updated);
                    }}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addAttraction}>
              + Add Attraction
            </Button>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
            >
              Add Location
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateLocationPage;
