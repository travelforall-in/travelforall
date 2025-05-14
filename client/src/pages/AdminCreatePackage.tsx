import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";

const CreatePackage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    destination: "",
    durationDays: "",
    durationNights: "",
    price: "",
    highlights: "",
    itineraryDay: "",
    itineraryTitle: "",
    itineraryDesc: "",
    itineraryMeals: "",
    inclusions: "",
    exclusions: "",
    transportation: "",
    accommodation: "",
    featured: false,
    images: null as File | null,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type, checked, files } = e.target as any;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else if (type === "file") {
      setFormData({ ...formData, images: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Admin token not found. Please log in.");
      return;
    }

    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("type", formData.type);
      payload.append("destination", formData.destination);
      payload.append("duration.days", formData.durationDays);
      payload.append("duration.nights", formData.durationNights);
      payload.append("price", formData.price);
      const highlightsArray = formData.highlights
        .split(",")
        .map((item) => item.trim());
      highlightsArray.forEach((highlight) => {
        payload.append("highlights", highlight);
      });
      payload.append("itinerary.day", formData.itineraryDay);
      payload.append("itinerary.title", formData.itineraryTitle);
      payload.append("itinerary.desc", formData.itineraryDesc);
      payload.append("itinerary.meals", formData.itineraryMeals);
      payload.append("inclusions", formData.inclusions);
      payload.append("exclusions", formData.exclusions);
      payload.append("transportation", formData.transportation);
      payload.append("accommodation", formData.accommodation);
      payload.append("featured", String(formData.featured));
      if (formData.images) {
        payload.append("images", formData.images);
      }

      const response = await axios.post(
        "http://localhost:5000/api/packages",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Package created successfully!");
      setFormData({
        name: "",
        type: "",
        destination: "",
        durationDays: "",
        durationNights: "",
        price: "",
        highlights: "",
        itineraryDay: "",
        itineraryTitle: "",
        itineraryDesc: "",
        itineraryMeals: "",
        inclusions: "",
        exclusions: "",
        transportation: "",
        accommodation: "",
        featured: false,
        images: null,
      });
      navigate("/admin/package-list");
    } catch (error: any) {
      toast.error(
        "Failed to create package. " + (error.response?.data?.message || "")
      );
      console.error("Error:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Toaster />
      <h2 className="text-2xl font-semibold mb-6">Create New Travel Package</h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-4"
        encType="multipart/form-data"
      >
        <div>
          <label className="block">Package Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Cultural Europe Tour"
            className="w-full border p-2"
            required
          />
        </div>
        <div>
          <label className="block">Package Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full border p-2"
            required
          >
            <option value="">Select</option>
            <option value="domestic">domestic</option>
            <option value="international">international</option>
          </select>
        </div>

        <div>
          <label className="block">Destinations</label>
          <input
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            placeholder="e.g. Paris · Rome · Barcelona"
            className="w-full border p-2"
            required
          />
        </div>
        <div>
          <label className="block">Duration (Days)</label>
          <input
            type="number"
            name="durationDays"
            value={formData.durationDays}
            onChange={handleChange}
            placeholder="e.g. 10"
            className="w-full border p-2"
            required
          />
        </div>
        <div>
          <label className="block">Duration (Nights)</label>
          <input
            type="number"
            name="durationNights"
            value={formData.durationNights}
            onChange={handleChange}
            placeholder="e.g. 9"
            className="w-full border p-2"
            required
          />
        </div>
        <div>
          <label className="block">Price (INR)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="e.g. 185000"
            className="w-full border p-2"
            required
          />
        </div>

        <div className="col-span-2">
          <label className="block">Highlights</label>
          <input
            name="highlights"
            value={formData.highlights}
            onChange={handleChange}
            placeholder="e.g. Eiffel Tower, Colosseum"
            className="w-full border p-2"
          />
        </div>

        {/* Itinerary Section */}
        <div>
          <label className="block">Itinerary - Day</label>
          <input
            type="number"
            name="itineraryDay"
            value={formData.itineraryDay}
            onChange={handleChange}
            placeholder="e.g. 1"
            className="w-full border p-2"
          />
        </div>
        <div>
          <label className="block">Itinerary - Title</label>
          <input
            name="itineraryTitle"
            value={formData.itineraryTitle}
            onChange={handleChange}
            placeholder="e.g. Paris Arrival & Cruise"
            className="w-full border p-2"
          />
        </div>
        <div className="col-span-2">
          <label className="block">Itinerary - Description</label>
          <textarea
            name="itineraryDesc"
            value={formData.itineraryDesc}
            onChange={handleChange}
            placeholder="e.g. Evening river cruise…"
            className="w-full border p-2"
          />
        </div>
        <div className="col-span-2">
          <label className="block">Meals Provided</label>
          <input
            name="itineraryMeals"
            value={formData.itineraryMeals}
            onChange={handleChange}
            placeholder="e.g. Breakfast, Lunch, Dinner"
            className="w-full border p-2"
          />
        </div>

        <div className="col-span-2">
          <label className="block">Inclusions</label>
          <textarea
            name="inclusions"
            value={formData.inclusions}
            onChange={handleChange}
            placeholder="e.g. 3-star hotel, breakfast"
            className="w-full border p-2"
          />
        </div>
        <div className="col-span-2">
          <label className="block">Exclusions</label>
          <textarea
            name="exclusions"
            value={formData.exclusions}
            onChange={handleChange}
            placeholder="e.g. Visa fees"
            className="w-full border p-2"
          />
        </div>

        <div>
          <label className="block">Transportation Type</label>
          <select
            name="transportation"
            value={formData.transportation}
            onChange={handleChange}
            className="w-full border p-2"
          >
            <option value="">Select</option>
            <option value="flight">flight</option>
            <option value="train">train</option>
            <option value="bus">bus</option>
          </select>
        </div>
        <div>
          <label className="block">Accommodation Info</label>
          <input
            name="accommodation"
            value={formData.accommodation}
            onChange={handleChange}
            placeholder="e.g. 3-Star Hotels"
            className="w-full border p-2"
          />
        </div>

        <div>
          <label className="block">Upload Images</label>
          <input
            type="file"
            name="images"
            accept="image/*"
            onChange={handleChange}
            className="w-full"
          />
        </div>
        <div>
          <label className="block">Mark as Featured</label>
          <input
            type="checkbox"
            name="featured"
            checked={formData.featured}
            onChange={handleChange}
          />
        </div>

        <div className="col-span-2">
          <button
            type="submit"
            className="w-full bg-orange-600 text-white p-2 rounded hover:bg-orange-700"
          >
            Create Package
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePackage;
