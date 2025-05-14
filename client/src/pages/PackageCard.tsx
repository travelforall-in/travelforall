import React from "react";
import { FaRupeeSign, FaStar } from "react-icons/fa";
import { BiTimeFive } from "react-icons/bi";

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
};

const getAverageRating = (reviews: ReviewType[] = []) => {
  if (reviews.length === 0) return "0.0";
  const total = reviews.reduce((acc, cur) => acc + cur.rating, 0);
  return (total / reviews.length).toFixed(1);
};

const PackageCard: React.FC<Props> = ({ packageData }) => {
  const {
    fullImageUrls,
    name,
    destination,
    price,
    duration,
    highlights,
    inclusions,
    reviews,
  } = packageData;

  const averageRating = getAverageRating(reviews);

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition duration-300 overflow-hidden">
      <img
        src={fullImageUrls?.[0] || "/fallback.jpg"}
        alt={name}
        className="w-full h-48 object-cover"
      />

      <div className="p-4">
        <h2 className="text-lg font-bold text-green-700 mb-1">{name}</h2>
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
            <span className="font-semibold text-gray-800">Highlight:</span> {highlights[0]}
          </p>
        )}

        {inclusions?.length > 0 && (
          <p className="text-xs text-gray-700 mb-1">
            <span className="font-semibold text-gray-800">Includes:</span> {inclusions[0]}
          </p>
        )}

        {reviews && reviews.length > 0 && (
          <p className="text-xs text-yellow-600 flex items-center gap-1">
            <FaStar className="text-yellow-500" /> {averageRating} ({reviews.length} reviews)
          </p>
        )}

        <button className="mt-3 w-full bg-green-600 text-white py-1.5 rounded hover:bg-green-700 transition">
          View Details
        </button>
      </div>
    </div>
  );
};

export default PackageCard;
