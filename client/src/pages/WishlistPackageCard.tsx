// src/pages/WishlistPackageCard.tsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaHeart, FaRupeeSign, FaStar } from "react-icons/fa";
import { BiTimeFive } from "react-icons/bi";
import axios from "axios";

const WishlistPackageCard: React.FC = () => {
  const { packageId } = useParams();
  const [packageData, setPackageData] = useState<any>(null);
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("user");
const userId = storedUser ? JSON.parse(storedUser)?._id || JSON.parse(storedUser)?.id : null;

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/packages/${packageId}`
        );
       console.log("Fetched response:", res);
console.log("res.data:", res.data);
        console.log("Package ID:", packageId);
       
       setPackageData(res.data.data);
      } catch (err) {
        console.error("Failed to fetch package data", err);
      }
    };
    

    fetchPackage();
  }, [packageId]);

  const handleRemove = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/wishlist/${packageId}`, {
        data: { userId },
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Removed from wishlist");
      navigate("/wishlist");
    } catch (err) {
      console.error("Failed to remove from wishlist", err);
    }
  };

  if (!packageData) return <div className="p-4">Loading...</div>;

const {
  name = "",
  destination = "",
  price = 0,
  duration = { days: 0, nights: 0 },
  highlights = [],
  inclusions = [],
  exclusions = [],
  transportation = "",
  accommodation = "",
  fullImageUrls = [],
  reviews = [],
} = packageData;

console.log("Name",name);

const avgRating = Array.isArray(reviews) && reviews.length
  ? (
      reviews.reduce((sum: number, r: any) => sum + r.rating, 0) /
      reviews.length
    ).toFixed(1)
  : "0.0";

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded">
      <img
        src={fullImageUrls?.[0] || "/fallback.jpg"}
        alt={name}
        className="w-full h-64 object-cover rounded"
      />

      <div className="mt-4 space-y-2">
        <h2 className="text-2xl font-bold text-green-800">{name}</h2>
        <p><strong>Destination:</strong> {destination}</p>
        <p><FaRupeeSign className="inline text-orange-600" /> {price}</p>
        <p><BiTimeFive className="inline text-orange-600" /> {duration.days}D / {duration.nights}N</p>

        <p><strong>Highlights:</strong> {highlights?.join(", ")}</p>
        <p><strong>Inclusions:</strong> {inclusions?.join(", ")}</p>
        <p><strong>Exclusions:</strong> {exclusions?.join(", ")}</p>
        <p><strong>Transportation:</strong> {transportation}</p>
        <p><strong>Accommodation:</strong> {accommodation}</p>

        <p className="text-yellow-600 mt-1 flex items-center gap-1">
          <FaStar className="text-yellow-500" /> {avgRating} ({reviews.length} reviews)
        </p>

        <button
          onClick={handleRemove}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          <FaHeart className="inline mr-2" /> Remove from Wishlist
        </button>
      
      </div>
    </div>
  );
};

export default WishlistPackageCard;
