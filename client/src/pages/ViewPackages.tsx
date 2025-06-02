import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import PackageCard from "./PackageCard";
import axios from "axios";

interface PackageType {
  _id: string;
  name: string;
  type: string;
  destination: string;
  duration: { days: number; nights: number };
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
  itinerary: any[];
  reviews: any[];
  createdAt: string;
  id: string;
}

const ViewPackages = () => {
  const { id } = useParams<{ id: string }>();
  const [packages, setPackages] = useState<PackageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(
          `http://localhost:5000/api/states/${id}/packages`
        );
        setPackages(res.data.data);
      } catch (err: any) {
        setError("Failed to fetch packages.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchPackages();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-24 max-w-7xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-green-800 mb-6 text-center">
          Packages in this State
        </h1>
        {loading ? (
          <p className="text-center text-gray-600">Loading packages...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : packages.length === 0 ? (
          <p className="text-center text-gray-500">
            No packages found for this state.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <PackageCard key={pkg._id} packageData={pkg} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ViewPackages;
