import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const AdminCreatePackage = () => {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    destination: "",
    state: "",
    duration: { days: 0, nights: 0 },
    price: 0,
    highlights: "",
    itinerary: "",
    inclusions: "",
    exclusions: "",
    transportation: "",
    accommodation: "",
    images: [],
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [states, setStates] = useState<{ _id: string; name: string }[]>([]);

  const adminToken = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/states");
        setStates(res.data.data);
      } catch (err) {
        console.error("Failed to fetch states", err);
      }
    };
    fetchStates();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "days" || name === "nights") {
      const val = Math.max(0, parseInt(value) || 0);
      setFormData((prev) => ({
        ...prev,
        duration: {
          ...prev.duration,
          [name]: val,
        },
      }));
    } else if (name === "price") {
      const val = Math.max(0, parseFloat(value) || 0);
      setFormData((prev) => ({
        ...prev,
        price: val,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.duration.days <= 0) {
      toast.error("Number of days must be greater than 0");
      return;
    }
    if (formData.duration.nights < 0) {
      toast.error("Number of nights cannot be negative");
      return;
    }
    if (formData.price < 0) {
      toast.error("Price cannot be negative");
      return;
    }

    const formPayload = new FormData();

    imageFiles.forEach((img) => formPayload.append("images", img));
    formPayload.append("name", formData.name);
    formPayload.append("type", formData.type);
    formPayload.append("destination", formData.destination);
    formPayload.append("state", formData.state);

    if (!formData.duration.days || formData.duration.days <= 0) {
      toast.error("Please enter a valid number of days.");
      return;
    }

    formPayload.append("duration.days", String(formData.duration.days));
    formPayload.append("duration.nights", String(formData.duration.nights));

    formPayload.append("price", String(formData.price));

    formPayload.append(
      "highlights",
      JSON.stringify(formData.highlights.split(",").map((item) => item.trim()))
    );

    const itineraryLines = formData.itinerary
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const itineraryObjects = itineraryLines.map((desc, index) => ({
      day: index + 1,
      description: desc,
    }));

    formPayload.append("itinerary", JSON.stringify(itineraryObjects));

    formPayload.append(
      "inclusions",
      JSON.stringify(formData.inclusions.split(",").map((item) => item.trim()))
    );
    formPayload.append(
      "exclusions",
      JSON.stringify(formData.exclusions.split(",").map((item) => item.trim()))
    );
    formPayload.append("transportation", formData.transportation);
    formPayload.append("accommodation", formData.accommodation);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/packages",
        formPayload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );
      toast.success("Package created successfully!");
      setFormData({
        name: "",
        type: "",
        destination: "",
        state: "",
        duration: { days: 0, nights: 0 },
        price: 0,
        highlights: "",
        itinerary: "",
        inclusions: "",
        exclusions: "",
        transportation: "",
        accommodation: "",
        images: [],
      });
      setImageFiles([]);
      navigate(-1);
    } catch (err: any) {
      console.error("Error creating package:", err);
      toast.error(
        err.response?.data?.errors?.[0]?.msg || "Failed to create package"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-md rounded-md p-6 w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Create New Travel Package
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Package Name */}
          <div>
            <label className="block font-medium mb-1">Package Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter package name"
              value={formData.name}
              onChange={handleChange}
              className="border p-2 rounded-md w-full"
              required
            />
          </div>

          {/* Type */}
          <div>
            <label className="block font-medium mb-1">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="border p-2 rounded-md w-full"
              required
            >
              <option value="">Select type</option>
              <option value="domestic">Domestic</option>
              <option value="international">International</option>
            </select>
          </div>

          {/* Destination */}
          <div>
            <label className="block font-medium mb-1">Destination</label>
            <input
              type="text"
              name="destination"
              placeholder="Enter destinations (comma-separated)"
              value={formData.destination}
              onChange={handleChange}
              className="border p-2 rounded-md w-full"
              required
            />
          </div>

          {/* state Dropdown */}
          <div>
            <label className="block font-medium mb-1">Select state</label>
            <select
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="border p-2 rounded-md w-full"
              required
            >
              <option value="">Select state</option>
              {Array.isArray(states) &&
                states.map((state) => (
                  <option key={state._id} value={state._id}>
                    {state.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Duration Days */}
          <div>
            <label className="block font-medium mb-1">Duration (Days)</label>
            <input
              type="number"
              name="days"
              placeholder="Enter number of days"
              value={formData.duration.days}
              onChange={handleChange}
              className="border p-2 rounded-md w-full"
              min={1} // days must be at least 1
              required
            />
          </div>

          {/* Duration Nights */}
          <div>
            <label className="block font-medium mb-1">Duration (Nights)</label>
            <input
              type="number"
              name="nights"
              placeholder="Enter number of nights"
              value={formData.duration.nights}
              onChange={handleChange}
              className="border p-2 rounded-md w-full"
              min={0} // nights can be zero
              required
            />
          </div>

          {/* Price */}
          <div>
            <label className="block font-medium mb-1">Package Price</label>
            <input
              type="number"
              name="price"
              placeholder="Enter price (e.g. 1299)"
              value={formData.price}
              onChange={handleChange}
              className="border p-2 rounded-md w-full"
              min={0}
              required
            />
          </div>

          {/* Transportation */}
          <div>
            <label className="block font-medium mb-1">Transportation</label>
            <input
              type="text"
              name="transportation"
              placeholder="e.g. Flight, Train, Bus"
              value={formData.transportation}
              onChange={handleChange}
              className="border p-2 rounded-md w-full"
              required
            />
          </div>

          {/* Accommodation */}
          <div>
            <label className="block font-medium mb-1">Accommodation</label>
            <input
              type="text"
              name="accommodation"
              placeholder="e.g. Hotel, Resort, Hostel"
              value={formData.accommodation}
              onChange={handleChange}
              className="border p-2 rounded-md w-full"
              required
            />
          </div>

          {/* Highlights */}
          <div className="md:col-span-2">
            <label className="block font-medium mb-1">Highlights</label>
            <textarea
              name="highlights"
              placeholder="Enter highlights, separated by commas"
              value={formData.highlights}
              onChange={handleChange}
              className="border p-2 rounded-md w-full"
              required
            />
          </div>

          {/* Itinerary */}
          <div className="md:col-span-2">
            <label className="block font-medium mb-1">Itinerary</label>
            <textarea
              name="itinerary"
              placeholder="Enter each itinerary item on a new line"
              value={formData.itinerary}
              onChange={handleChange}
              className="border p-2 rounded-md w-full"
              rows={5}
              required
            />
          </div>

          {/* Inclusions */}
          <div className="md:col-span-2">
            <label className="block font-medium mb-1">Inclusions</label>
            <textarea
              name="inclusions"
              placeholder="Enter inclusions, separated by commas"
              value={formData.inclusions}
              onChange={handleChange}
              className="border p-2 rounded-md w-full"
              required
            />
          </div>

          {/* Exclusions */}
          <div className="md:col-span-2">
            <label className="block font-medium mb-1">Exclusions</label>
            <textarea
              name="exclusions"
              placeholder="Enter exclusions, separated by commas"
              value={formData.exclusions}
              onChange={handleChange}
              className="border p-2 rounded-md w-full"
              required
            />
          </div>

          {/* Image Upload */}
          <div className="md:col-span-2">
            <label className="block font-medium mb-1">Upload Images</label>
            <input
              type="file"
              name="images"
              onChange={handleImageChange}
              className="border p-2 rounded-md w-full"
              accept="image/*"
              multiple
              required
            />
          </div>

          <div className="min-w-full md:w-auto md:col-span-2 flex">
            <button
              type="submit"
              className="bg-[#F97015] hover:bg-[#ea6207] text-white font-medium py-2 px-6 rounded-md shadow w-full"
            >
              Create Package
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCreatePackage;
