import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BookingForm = ({ packageId, price }) => {
  const [travelDate, setTravelDate] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  const totalTravellers = adults + children + infants;
  const totalPrice = (price || 0) * totalTravellers;

  const handleBooking = async () => {
    if (!travelDate || adults < 1 || !phone) {
      alert("Please fill in all required fields. At least one adult is required.");
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
      contactDetails: { phone },
    };

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/bookings", bookingData, {
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
          <label className="block font-medium mb-1">Travel Date <span className="text-red-500">*</span></label>
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
            <label className="block font-medium mb-1">Adults <span className="text-red-500">*</span></label>
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

        {/* Phone */}
        <div>
          <label className="block font-medium mb-1">Phone Number <span className="text-red-500">*</span></label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
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
