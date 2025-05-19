"use client";

import { useEffect, useState } from "react";
import { FaRupeeSign, FaSortAmountDownAlt } from "react-icons/fa";
import { TbBeach, TbFilter } from "react-icons/tb";
import { BiTimeFive } from "react-icons/bi";
import Navbar from "@/components/Navbar";
import PackageCard from "@/pages/PackageCard"; // adjust path as needed
import { commonService } from "@/service/commonService";

export default function PackagesPage() {
  const [packages, setPackages] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(200000);
  const [destination, setDestination] = useState("");
  const [duration, setDuration] = useState("");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPackages = async () => {
    try {
      const filters: any = {
        page,
        limit,
        ...(minPrice && { minPrice }),
        ...(maxPrice && { maxPrice }),
        ...(destination && { destination }),
        ...(duration && { duration }),
        ...(sort && { sort }),
      };

      const response = await commonService.getAll("packages", filters);
      setPackages(response.data.data);
      console.log(response.data);
      
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching packages:", error);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, [minPrice, maxPrice, destination, duration, sort, page]);

  const resetFilters = () => {
    setMinPrice(0);
    setMaxPrice(200000);
    setDestination("");
    setDuration("");
    setSort("");
    setPage(1);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <Navbar />

      {/* Sidebar Filters */}
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
            <option value="Manali">Manali</option>
            <option value="Goa">Goa</option>
            <option value="Shimla">Shimla</option>
            <option value="Jaisalmer">Jaisalmer</option>
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
            onChange={(e) => setDuration(parseInt(e.target.value))}
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

      {/* Main Content */}
      <main className="pt-20 flex-1 p-6 bg-gray-50">
        <h1 className="text-2xl font-bold text-green-800 mb-6">
          All Travel Packages
        </h1>   

        {packages && packages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <PackageCard key={pkg._id} packageData={pkg} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No packages found matching your filters.</p>
        )}

{/* Pagination */}
<div className="mt-8 flex justify-center items-center gap-4">
  <button
    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
    disabled={page === 1}
    className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
  >
    Previous
  </button>

  <span className="text-green-800 font-semibold">
    Page {page} of {totalPages}
  </span>

  <button
    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
    disabled={page === totalPages}
    className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
  >
    Next
  </button>
</div>


      </main>
    </div>
  );
}
