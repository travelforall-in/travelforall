import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BASE_URL from "@/utils/baseUrl";

const BookingForm = ({ packageId, price }) => {
  const [travelDate, setTravelDate] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [travelerDetails, setTravelerDetails] = useState([]);

  const navigate = useNavigate();

  const totalTravellers = adults + children + infants;
  const totalPrice = (price || 0) * totalTravellers;

  useEffect(() => {
    const updatedTravelers = [];

    for (let i = 0; i < adults; i++) {
      updatedTravelers.push({ name: "", type: "adult" });
    }
    for (let i = 0; i < children; i++) {
      updatedTravelers.push({ name: "", type: "child" });
    }
    for (let i = 0; i < infants; i++) {
      updatedTravelers.push({ name: "", type: "infant" });
    }

    setTravelerDetails(updatedTravelers);
  }, [adults, children, infants]);

  const handleBooking = async () => {
    if (!travelDate || adults < 1 || !phone || !name || !email) {
      alert("Please fill in all required fields. At least one adult and contact info is required.");
      return;
    }

    if (travelerDetails.some(t => t.name.trim() === "")) {
      alert("Please enter all traveler names.");
      return;
    }

    const bookingData = {
      packageId,
      travelDate,
      travelers: {
        adults,
        children,
        infants,
      },
      travelerDetails,
      contactDetails: {
        name,
        email,
        phone,
      },
      specialRequests,
    };

    try {
      const token = localStorage.getItem("token");
      await axios.post(`${BASE_URL}/bookings`, bookingData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Booking successful!");
      navigate("/my-bookings");
    } catch (error) {
      console.error("Booking error:", error);
      alert("Booking failed: " + (error.response?.data?.message || "Server error"));
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 sticky top-4">
      <h3 className="text-xl font-bold mb-4 text-center">Book This Package</h3>

      <div className="grid gap-4">
        {/* Travel Date */}
        <div>
          <label className="block font-medium mb-1">
            Travel Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={travelDate}
            onChange={(e) => setTravelDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        {/* Traveller Counts */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block font-medium mb-1">
              Adults <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min={1}
              value={adults}
              onChange={(e) => setAdults(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Children</label>
            <input
              type="number"
              min={0}
              value={children}
              onChange={(e) => setChildren(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Infants</label>
            <input
              type="number"
              min={0}
              value={infants}
              onChange={(e) => setInfants(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>

        {/* Traveler Names */}
        <div>
          <label className="block font-medium mb-2">Traveler Names</label>
          {travelerDetails.map((traveler, index) => (
            <div key={index} className="mb-2">
              <label className="block text-sm font-medium mb-1">
                {traveler.type.charAt(0).toUpperCase() + traveler.type.slice(1)} {index + 1} Name:
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                value={traveler.name}
                onChange={(e) => {
                  const updated = [...travelerDetails];
                  updated[index].name = e.target.value;
                  setTravelerDetails(updated);
                }}
              />
            </div>
          ))}
        </div>

        {/* Contact Details */}
        <div>
          <label className="block font-medium mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        {/* Special Requests */}
        <div>
          <label className="block font-medium mb-1">Special Requests</label>
          <textarea
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Any dietary preferences, accessibility needs, etc."
          ></textarea>
        </div>

        {/* Price Summary */}
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <p className="font-semibold">Price per Person: ₹{price?.toLocaleString() || 0}</p>
          <p className="font-semibold">Total Travellers: {totalTravellers}</p>
          <p className="font-bold text-lg text-green-700">
            Total Amount: ₹{totalPrice.toLocaleString()}
          </p>
        </div>

        {/* Confirm Button */}
        <button
          onClick={handleBooking}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-200"
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
};

export default BookingForm;
