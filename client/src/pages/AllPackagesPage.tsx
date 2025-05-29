"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import PackageCard from "@/pages/PackageCard";
import { commonService } from "@/service/commonService";
import { useParams } from "react-router-dom";
import Filter from "@/components/shared/Filter";

export default function PackagesPage() {
  const { destinationId } = useParams();
  const [packages, setPackages] = useState([]);
  const [availableDestinations, setAvailableDestinations] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(200000);
  const [destination, setDestination] = useState("");
  const [duration, setDuration] = useState("");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPackages = async () => {
    try {
      const limit = 6;
      const filters: any = {
        page,
        limit,
        ...(minPrice && { minPrice }),
        ...(maxPrice && { maxPrice }),
        ...(destination && { destination }),
        ...(duration && { duration }),
        ...(sort && { sort }),
      };
      if (destinationId) {
        const response = await commonService.getItemById(
          "packages",
          destinationId
        );
        setPackages(response.data);
      }
      const response = await commonService.getAll("packages", filters);
      setPackages(response.data.data);
      console.log(response.data);
      
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching packages:", error);
    }
  };

  const fetchDestinationsFromPackages = async () => {
    try {
      const response = await commonService.getAll("packages", { limit: 1000 });
      const allPackages = response.data.data;

      const cities = [
        ...new Set(allPackages.map((pkg) => pkg.destination).filter(Boolean)),
      ];
      setAvailableDestinations(cities);
    } catch (error) {
      console.error("Error fetching destinations from packages:", error);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, [minPrice, maxPrice, destination, duration, sort, page]);

  useEffect(() => {
    fetchDestinationsFromPackages();
  }, []);

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
      <Filter
        minPrice={minPrice}
        maxPrice={maxPrice}
        destination={destination}
        duration={duration}
        sort={sort}
        availableDestinations={availableDestinations}
        setMinPrice={setMinPrice}
        setMaxPrice={setMaxPrice}
        setDestination={setDestination}
        setDuration={setDuration}
        setSort={setSort}
        resetFilters={resetFilters}
      />

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
          <p className="text-gray-500">
            No packages found matching your filters.
          </p>
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
