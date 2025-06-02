import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import DestinationCard from "./DestinationCard";
import { commonService } from "@/service/commonService";

type CityType = {
  _id: string;
  name: string;
  country: string;
  type: string;
  image?: string[];
  description?: string;
  createdAt?: string;
  fullImageUrls?: string[];
};

const FeaturedDestinations: React.FC = () => {
  const [destinations, setDestinations] = useState<CityType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await commonService.getAll("states"); // or use your actual API endpoint
        console.log("destination here:",response.data.data);
        
        setDestinations(response.data.data.slice(0, 4)); // only take 4 for featured
      } catch (err) {
        console.error("Failed to load destinations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Featured Destinations
            </h2>
            <p className="text-gray-600 max-w-2xl">
              Explore our handpicked selection of the most breathtaking destinations.
            </p>
          </div>
          <Link
            to="/destinations/:type"
            className="mt-4 md:mt-0 inline-flex items-center text-primary hover:text-primary/80 font-medium"
          >
            View all destinations
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading destinations...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((city) => (
              <DestinationCard key={city._id} cityData={city} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedDestinations;