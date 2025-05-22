"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import PackageCard from "@/pages/PackageCard";
import { commonService } from "@/service/commonService";

export default function ExplorePackages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const fetchAllPackages = async () => {
    try {
      const limit = 6;
      const response = await commonService.getAll("packages", { page, limit });

      setPackages(response.data.data);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching packages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllPackages();
  }, [page]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="pt-20 px-6">
        <h1 className="text-3xl font-bold text-green-800 mb-6 text-center">
          Explore All Travel Packages
        </h1>

        {loading ? (
          <p className="text-center text-gray-500">Loading packages...</p>
        ) : packages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <PackageCard key={pkg._id} packageData={pkg} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No packages found.</p>
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
