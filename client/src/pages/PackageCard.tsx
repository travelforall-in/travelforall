import React, { useState, useEffect } from "react";
import { FaRupeeSign, FaStar, FaHeart } from "react-icons/fa";
import { BiTimeFive } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import axios from "axios";

type ReviewType = {
  user: string;
  rating: number;
  comment: string;
};

type ItineraryItem = {
  day: number;
  title: string;
  description: string;
  meals: {
    breakfast: boolean;
    lunch: boolean;
    dinner: boolean;
  };
};

type DurationType = {
  days: number;
  nights: number;
};

type PackageType = {
  _id: string;
  name: string;
  type: string;
  destination: string;
  duration: DurationType;
  price: number;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  transportation: string;
  accommodation: string;
  images: string[];
  fullImageUrls?: string[];
  averageRating: number;
  featured: boolean;
  bookingsCount: number;
  itinerary: ItineraryItem[];
  reviews: ReviewType[];
  createdAt: string;
  id: string;
};

type Props = {
  packageData: PackageType;
  userId?: string;
};

const getAverageRating = (reviews: ReviewType[] = []) => {
  if (reviews.length === 0) return "0.0";
  const total = reviews.reduce((acc, cur) => acc + cur.rating, 0);
  return (total / reviews.length).toFixed(1);
};

const PackageCard: React.FC<Props> = ({ packageData, userId: userIdProp }) => {
  const {
    _id,
    fullImageUrls,
    name,
    destination,
    price,
    duration,
    highlights,
    inclusions,
    reviews,
  } = packageData;

  const [wishlisted, setWishlisted] = useState(false);
  const [userId, setUserId] = useState<string | undefined>(userIdProp);
  const navigate = useNavigate();

  // Load user ID from localStorage if not passed as prop
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        const idFromStorage = parsedUser?._id || parsedUser?.id;
        if (!userIdProp && idFromStorage) {
          setUserId(idFromStorage);
        }
      } catch (e) {
        console.error("Failed to parse user from localStorage");
      }
    }
  }, [userIdProp]);

  // Check wishlist status
  useEffect(() => {
    if (!userId) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const checkWishlistStatus = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/wishlist?userId=${userId}`,
          config
        );
        const packages = response?.data?.packages;
        if (Array.isArray(packages)) {
          const wishlistedPackages: string[] = packages.map(
            (p: any) => p.packageId || p._id
          );
          const isWishlisted = wishlistedPackages.includes(_id);
          setWishlisted(isWishlisted);
        } else {
          console.warn("Expected packages array, got:", packages);
          setWishlisted(false);
        }
      } catch (error) {
        console.error("Failed to fetch wishlist status", error);
        setWishlisted(false);
      }
    };

    checkWishlistStatus();
  }, [userId, _id]);

  // Toggle wishlist
  const toggleWishlist = async () => {
    if (!userId) {
      alert("Please login to add to wishlist.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to add to wishlist.");
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      if (!wishlisted) {
        await axios.post(
          `http://localhost:5000/api/wishlist/${userId}`,
          { packageId: _id },
          config
        );
        setWishlisted(true);
      } else {
        await axios.delete(`http://localhost:5000/api/wishlist/${_id}`, {
          data: { userId },
          headers: { Authorization: `Bearer ${token}` },
        });
        setWishlisted(false);
      }
    } catch (error) {
      console.error("Wishlist action failed:", error);
      alert("Failed to update wishlist. Please try again.");
    }
  };

  const averageRating = getAverageRating(reviews);

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition duration-300 overflow-hidden">
      <img
        src={fullImageUrls?.[0] || "/fallback.jpg"}
        alt={name}
        className="w-full h-48 object-cover"
      />

      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold text-green-700">{name}</h2>
          <button onClick={toggleWishlist} aria-label="Toggle wishlist">
            <FaHeart
              className={`text-xl transition ${
                wishlisted ? "text-pink-500" : "text-gray-300"
              }`}
            />
          </button>
        </div>

        {/* ✅ Wishlisted text indicator */}
        <p className="text-sm mb-2">
          {wishlisted ? (
            <span className="text-red-500">❤️ Wishlisted</span>
          ) : (
            <span className="text-gray-400">🤍 Not Wishlisted</span>
          )}
        </p>

        <p className="text-sm text-gray-600 mb-2">{destination}</p>

        <div className="flex justify-between items-center text-sm text-gray-700 mb-2">
          <span className="flex items-center gap-1 text-orange-600 font-medium">
            <FaRupeeSign /> {price}
          </span>
          <span className="flex items-center gap-1 text-orange-600 font-medium">
            <BiTimeFive /> {duration.days}D / {duration.nights}N
          </span>
        </div>

        {highlights?.length > 0 && (
          <p className="text-xs text-gray-700 mb-1">
            <span className="font-semibold text-gray-800">Highlight:</span>{" "}
            {highlights[0]}
          </p>
        )}

        {inclusions?.length > 0 && (
          <p className="text-xs text-gray-700 mb-1">
            <span className="font-semibold text-gray-800">Includes:</span>{" "}
            {inclusions[0]}
          </p>
        )}

        {reviews && reviews.length > 0 && (
          <p className="text-xs text-yellow-600 flex items-center gap-1">
            <FaStar className="text-yellow-500" /> {averageRating} (
            {reviews.length} reviews)
          </p>
        )}

        <button
          className="mt-3 w-full bg-green-600 text-white py-1.5 rounded hover:bg-green-700 transition"
          onClick={() => navigate(`/packages/${_id}/details`)}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default PackageCard;

