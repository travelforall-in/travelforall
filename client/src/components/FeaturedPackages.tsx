import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import PackageCard from "@/pages/PackageCard";
import { commonService } from "@/service/commonService";

type PackageType = {
  _id: string;
  title: string;
  destination: string;
  price: number;
  duration: string;
  image?: string[];
  description?: string;
  fullImageUrls?: string[];
};

const FeaturedPackages: React.FC = () => {
  const [packages, setPackages] = useState<PackageType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchFeaturedPackages = async () => {
      try {
        const response = await commonService.getAll("packages", { limit: 4 });
        setPackages(response.data.data.slice(0, 4)); // only take 4
      } catch (error) {
        console.error("Failed to load packages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedPackages();
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Featured Travel Packages
            </h2>
            <p className="text-gray-600 max-w-2xl">
              Discover our most popular travel experiences hand-picked for you.
            </p>
          </div>
          <Link
            to="/all-packages"
            className="mt-4 md:mt-0 inline-flex items-center text-primary hover:text-primary/80 font-medium"
          >
            Explore all packages
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading packages...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {packages.map((pkg) => (
              <PackageCard key={pkg._id} packageData={pkg} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedPackages;
