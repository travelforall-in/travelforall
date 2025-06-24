import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "@/utils/baseUrl";
import QRCode from "react-qr-code";  // <-- updated import

interface Traveler {
  name: string;
  type: "adult" | "child" | "infant";
}

interface BookingData {
  packageId: string;
  travelDate: string;
  travelers: {
    adults: number;
    children: number;
    infants: number;
  };
  travelerDetails: Traveler[];
  contactDetails: {
    name: string;
    email: string;
    phone: string;
  };
  specialRequests?: string;
  amount: number;
  packageTitle: string;
}

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const bookingData = (state as { bookingData: BookingData })?.bookingData;

  if (!bookingData) return <div>No booking data found.</div>;

  const handleConfirmPayment = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(`${BASE_URL}/bookings`, bookingData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Payment successful and booking confirmed!");
      navigate("/my-bookings");
    } catch (error: any) {
      console.error("Booking error:", error);
      alert("Booking failed: " + (error.response?.data?.message || "Server error"));
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Complete Your Payment</h2>

      <p className="text-lg font-medium">Package: {bookingData.packageTitle}</p>
      <p>
        Total Travelers:{" "}
        {bookingData.travelers.adults +
          bookingData.travelers.children +
          bookingData.travelers.infants}
      </p>
      <p className="text-lg font-bold text-green-700 mt-2">Amount: ₹{bookingData.amount}</p>

      <div className="mt-6 text-center">
        <p className="mb-2">Scan the QR code to pay:</p>

        <QRCode
          value={`upi://pay?pa=schoolforallorg-2@oksbi&pn=SUROJIT AVA SchoolForAll&am=${bookingData.amount}&cu=INR&tn=Booking: ${bookingData.packageTitle}`}
          size={256}
          className="mx-auto"
        />

        <p className="text-center mt-2 text-sm text-gray-500">
          Use any UPI app (PhonePe, Google Pay, Paytm). Amount will be auto-filled.
        </p>
      </div>

      <button
        onClick={handleConfirmPayment}
        className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
      >
        I’ve Completed Payment
      </button>
    </div>
  );
};

export default PaymentPage;
