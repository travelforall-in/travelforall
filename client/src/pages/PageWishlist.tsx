


// wishlist page - no need of wishlistPackageCard.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaHeart, FaRupeeSign, FaStar } from "react-icons/fa";
import { BiTimeFive } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

const PageWishlist: React.FC = () => {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [userId, setUserId] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserId(parsedUser?._id || parsedUser?.id);
      } catch (err) {
        console.error("Error parsing user", err);
      }
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchWishlist = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5000/api/wishlist?userId=${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const packageRefs = res.data.packages || [];
        const detailedPackages = await Promise.all(
          packageRefs.map(async (pkg: any) => {
            const id = pkg.packageId || pkg._id || pkg;
            const resp = await axios.get(`http://localhost:5000/api/packages/${id}`);
            return resp.data.data;
          })
        );

        setWishlist(detailedPackages);
      } catch (err) {
        console.error("Error fetching wishlist", err);
      }
    };

    fetchWishlist();
  }, [userId]);

  const handleRemove = async (packageId: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/wishlist/${packageId}`, {
        data: { userId },
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlist((prev) => prev.filter((pkg) => pkg._id !== packageId));
    } catch (err) {
      console.error("Failed to remove package", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-green-800">My Wishlist</h1>
         <button
  className="inline-flex items-center gap-2 px-4 py-2 mb-4 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150 ease-in-out"
  onClick={() => navigate(-2)}
>
  {/* Left Arrow SVG */}
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M15 18l-6-6 6-6" />
  </svg>
  Back to Packages
</button>
      {wishlist.length === 0 ? (
        <p className="text-gray-500">No packages in your wishlist.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((pkg) => {
            const {
              _id,
              name,
              destination,
              price,
              duration = { days: 0, nights: 0 },
              highlights = [],
              inclusions = [],
              exclusions = [],
              transportation,
              accommodation,
              fullImageUrls = [],
              reviews = [],
            } = pkg;

            const avgRating = Array.isArray(reviews) && reviews.length
              ? (
                  reviews.reduce((sum: number, r: any) => sum + r.rating, 0) /
                  reviews.length
                ).toFixed(1)
              : "0.0";

            return (
              <div key={_id} className="bg-white shadow rounded overflow-hidden flex flex-col">
  <img
    src={fullImageUrls[0] || "/fallback.jpg"}
    alt={name}
    className="w-full h-48 object-cover"
  />

  <div className="p-4 flex-1 flex flex-col justify-between">
    <div>
      <h2 className="text-xl font-bold text-green-800">{name}</h2>
      <p className="text-pink-600 font-semibold flex items-center gap-1">
        <FaHeart className="text-pink-600" /> Wishlisted
      </p>
      <p className="text-gray-600">{destination}</p>
      <p className="text-orange-600 font-semibold flex items-center gap-1 mt-1">
        <FaRupeeSign /> {price}
        <span className="ml-4 flex items-center gap-1">
          <BiTimeFive /> {duration.days}D / {duration.nights}N
        </span>
      </p>
      {highlights.length > 0 && (
        <p className="mt-1 text-sm">
          <strong>Highlight:</strong> {highlights[0]}
        </p>
      )}
      {inclusions.length > 0 && (
        <p className="text-sm">
          <strong>Includes:</strong> {inclusions[0]}
        </p>
      )}
    </div>

    <div className="flex justify-between mt-4 gap-2">
      <button
        onClick={() => handleRemove(_id)}
        className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 flex items-center"
      >
        <FaHeart className="inline mr-1" /> Remove
      </button>
      <button
         className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700"
          onClick={() => navigate(`/packages/${_id}/details`)}
        >
          View Details
      </button>
    </div>
  </div>
</div>

            );
          })}
        </div>
      )}
    </div>
  );
};

export default PageWishlist;
