"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import DestinationCard from "@/components/DestinationCard";
import { commonService } from "@/service/commonService";
import Filters from "@/components/shared/Filters";

export default function DomesticPage() {
  const [states, setStates] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(50000);
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
        ...(destination && { name: destination }),  // Destination filter by name
        ...(duration && { duration }),
        ...(sort && { sort }),
        type: "domestic", // Filter by domestic packages only
      };

      // console.log("Filters sent to backend:", filters);

      const response = await commonService.getAll("states", filters);
      setStates(response.data.data);
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
    setMaxPrice(50000);
    setDestination("");
    setDuration("");
    setSort("");
    setPage(1);
  };

  // Extract unique destinations using the 'name' field
  const availableDestinations = [...new Set(states.map((state) => state.name))].sort();

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <Navbar />

      {/* Filters Sidebar */}
      <Filters
        destination={destination}
        sort={sort}
        availableDestinations={availableDestinations}
        setDestination={setDestination}
        setSort={setSort}
        resetFilters={resetFilters}
      />

      {/*  Main Content */}
      <main className="pt-20 flex-1 p-6 bg-gray-50">
        <h1 className="text-2xl font-bold text-green-800 mb-6">
          Domestic Travel Destination
        </h1>

        {states && states.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {states.map((city) => (
              <DestinationCard key={city._id} cityData={city} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No destinations found matching your filters.</p>
        )}

        {/*Pagination */}
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
