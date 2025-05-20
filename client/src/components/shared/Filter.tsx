"use client";

import { FaRupeeSign, FaSortAmountDownAlt } from "react-icons/fa";
import { TbBeach, TbFilter } from "react-icons/tb";
import { BiTimeFive } from "react-icons/bi";

interface FilterProps {
  minPrice: number;
  maxPrice: number;
  destination: string;
  duration: string;
  sort: string;
  availableDestinations: string[];
  setMinPrice: (value: number) => void;
  setMaxPrice: (value: number) => void;
  setDestination: (value: string) => void;
  setDuration: (value: string) => void;
  setSort: (value: string) => void;
  resetFilters: () => void;
}

export default function Filter({
  minPrice,
  maxPrice,
  destination,
  duration,
  sort,
  availableDestinations,
  setMinPrice,
  setMaxPrice,
  setDestination,
  setDuration,
  setSort,
  resetFilters,
}: FilterProps) {
  return (
    <aside className="pt-20 w-72 bg-white shadow-md p-6 space-y-5">
      <h2 className="text-xl font-bold text-green-700 mb-2 flex items-center gap-2">
        <TbFilter /> Filters
      </h2>

      {/* Price Filters */}
      <div>
        <label className="flex items-center gap-2 text-orange-600 text-sm font-medium">
          <FaRupeeSign /> Min Price: ₹{minPrice}
        </label>
        <input
          type="range"
          min="0"
          max="200000"
          value={minPrice}
          onChange={(e) => setMinPrice(Number(e.target.value))}
          className="w-full accent-orange-600 mt-1"
        />
      </div>
      <div>
        <label className="flex items-center gap-2 text-orange-600 text-sm font-medium">
          <FaRupeeSign /> Max Price: ₹{maxPrice}
        </label>
        <input
          type="range"
          min="0"
          max="200000"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-orange-600 mt-1"
        />
      </div>

      {/* Destination Filter */}
      <div>
        <label className="flex items-center gap-2 text-orange-600 text-sm font-medium">
          <TbBeach /> Destination
        </label>
        <select
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="w-full border mt-1 p-2 rounded"
        >
          <option value="">All Destinations</option>
          {availableDestinations.map((city, idx) => (
            <option key={idx} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {/* Duration Filter */}
      <div>
        <label className="flex items-center gap-2 text-orange-600 text-sm font-medium mb-1">
          <BiTimeFive /> Duration (Max Days):
          <span className="ml-2 text-gray-800">{duration || 1} Days</span>
        </label>
        <input
          type="range"
          min={1}
          max={20}
          step={1}
          value={duration || 1}
          onChange={(e) => setDuration(e.target.value)}
          className="w-full accent-orange-600 mt-1"
        />
        <div className="flex justify-between text-xs text-gray-600 mt-1">
          <span>1</span>
          <span>20</span>
        </div>
      </div>

      {/* Sort Filter */}
      <div>
        <label className="flex items-center gap-2 text-orange-600 text-sm font-medium">
          <FaSortAmountDownAlt /> Sort By
        </label>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="w-full border mt-1 p-2 rounded"
        >
          <option value="-createdAt">Newest First</option>
          <option value="price">Price: Low to High</option>
          <option value="-price">Price: High to Low</option>
          <option value="duration.days">Duration: Short to Long</option>
          <option value="-duration.days">Duration: Long to Short</option>
        </select>
      </div>

      <button
        onClick={resetFilters}
        className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 mt-4"
      >
        Reset Filters
      </button>
    </aside>
  );
}
