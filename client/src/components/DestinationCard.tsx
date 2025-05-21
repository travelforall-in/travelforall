import React from "react";
import { BiTimeFive } from "react-icons/bi";
import { FaMapMarkerAlt } from "react-icons/fa";

type CityType = {
  _id: string;
  name: string;
  country: string;
  type: string;
  image?: string[];
  description?: string;
  createdAt?: string;
  fullImageUrls?:string[]
};

type Props = {
  cityData: CityType;
};

const DestinationCard: React.FC<Props> = ({ cityData }) => {
  const { name, country, type, fullImageUrls, description } = cityData;
  console.log('image',fullImageUrls)

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition duration-300 overflow-hidden">
      <img
        src={fullImageUrls[0] || "/fallback.jpg"}
        alt={name}
        className="w-full h-48 object-cover"
      />

      <div className="p-4">
        <h2 className="text-lg font-bold text-green-700 mb-1">{name}</h2>
        <p className="text-sm text-gray-600 mb-2 flex items-center gap-1">
          <FaMapMarkerAlt className="text-red-500" /> {country}
        </p>

        <p className="text-xs text-gray-700 mb-2 capitalize">
          <span className="font-semibold text-gray-800">Type:</span> {type}
        </p>

        {description && (
          <p className="text-xs text-gray-500 line-clamp-3">{description}</p>
        )}

        <button className="mt-3 w-full bg-green-600 text-white py-1.5 rounded hover:bg-green-700 transition">
          View Packages
        </button>
      </div>
    </div>
  );
};

export default DestinationCard;
