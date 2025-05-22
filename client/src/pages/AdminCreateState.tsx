import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const CreateState = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    country: "",
    type: "",
    description: "",
    weather: "",
    bestTimeToVisit: "",
    popularAttractions: "",
    localCuisine: "",
    transportation: "",
    culturalNotes: "",
  });

  const [images, setImages] = useState<FileList | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(e.target.files);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const payload = new FormData();
    for (const key in formData) {
      if (key === "popularAttractions" || key === "localCuisine") {
        payload.append(
          key,
          JSON.stringify(
            formData[key as keyof typeof formData]
              .split(",")
              .map((item) => item.trim())
          )
        );
      } else {
        payload.append(key, formData[key as keyof typeof formData]);
      }
    }

    if (images) {
      Array.from(images).forEach((img) => {
        payload.append("images", img);
      });
    }

    try {
      await axios.post("http://localhost:5000/api/states/", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      toast.success("State created successfully!");

      setFormData({
        name: "",
        country: "",
        type: "",
        description: "",
        weather: "",
        bestTimeToVisit: "",
        popularAttractions: "",
        localCuisine: "",
        transportation: "",
        culturalNotes: "",
      });
      setImages(null);

      navigate(-1);
    } catch (err) {
      toast.error("Failed to create state");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-10">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">
          Create New State
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                State Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Country
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-4 py-2"
              >
                <option value="">Select Type</option>
                <option value="domestic">Domestic</option>
                <option value="international">International</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
              rows={3}
            />
          </div>

          {/* Climate, Time, Transport */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Weather
              </label>
              <textarea
                name="weather"
                value={formData.weather}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Best Time to Visit
              </label>
              <input
                type="text"
                name="bestTimeToVisit"
                value={formData.bestTimeToVisit}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Transportation
              </label>
              <input
                type="text"
                name="transportation"
                value={formData.transportation}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>
          </div>

          {/* Attractions & Cuisine */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Popular Attractions (comma separated)
              </label>
              <input
                type="text"
                name="popularAttractions"
                value={formData.popularAttractions}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Local Cuisine (comma separated)
              </label>
              <input
                type="text"
                name="localCuisine"
                value={formData.localCuisine}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>
          </div>

          {/* Cultural Notes */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Cultural Notes
            </label>
            <textarea
              name="culturalNotes"
              value={formData.culturalNotes}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
              rows={2}
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Upload State Images
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="block w-full text-sm border border-gray-300 rounded-lg bg-gray-50 cursor-pointer px-3 py-2"
            />
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              className="min-w-full md:w-auto bg-[#F97015] text-white px-6 py-3 rounded-lg hover:bg-[#ea6207] transition"
            >
              Create State
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateState;
