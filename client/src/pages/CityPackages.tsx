import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

interface Package {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: { days: number; nights: number };
}

const CityPackages = () => {
  const { id } = useParams();
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/cities/${id}/packages`
        );
        console.log("API Response", res);
        setPackages(res.data.data);
      } catch (err) {
        setError("Failed to fetch packages.");
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [id]);

  return (
    <div className="p-6 relative">
      <h2 className="text-2xl font-bold mb-4">Packages in Selected City</h2>
      <Link to="/admin/create-package">
        <button className="bg-[#F97015] text-white p-2 rounded hover:bg-[#ea6207] absolute top-7 right-10">
          + Create New Package
        </button>
      </Link>
      {loading ? (
        <p>Loading packages...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : packages.length === 0 ? (
        <p>No packages found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {packages.map((pkg) => (
            <div
              key={pkg._id}
              className="p-4 border rounded bg-white shadow hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold mb-2">{pkg.name}</h3>
              <p className="text-sm text-gray-700 mb-2">{pkg.description}</p>
              <p className="text-sm font-medium text-green-700">
                Duration: {pkg.duration.days} Days / {pkg.duration.nights}{" "}
                Nights
              </p>
              <p className="text-sm font-semibold text-[#F97015]">
                Price: ₹ {pkg.price}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CityPackages;
