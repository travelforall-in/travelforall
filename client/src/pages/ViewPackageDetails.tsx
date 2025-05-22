import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  MapPin,
  Clock,
  IndianRupee,
  Hotel,
  CalendarDays,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ViewPackageDetails = () => {
  const { id } = useParams();
  const [packageDetails, setPackageDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/packages/${id}`
        );
        setPackageDetails(response.data.data);
      } catch (error) {
        console.error("Failed to fetch package details:", error);
      }
    };

    fetchPackageDetails();
  }, [id]);

  if (!packageDetails) return <div>Loading...</div>;

  return (
    <div className="p-6 bg-[#FCF7EF]">
      <div className="mb-6">
        <button
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150 ease-in-out"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Packages
        </button>
      </div>

      <div className="grid gap-6">
        {/* Section 1: Image Carousel */}
        <div className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
          <div className="relative h-64 w-full">
            {packageDetails.fullImageUrls?.length > 0 && (
              <img
                src={packageDetails.fullImageUrls[0]}
                alt={packageDetails.name || "Package Image"}
                className="object-cover w-full h-full"
              />
            )}
            <div className="absolute bottom-0 left-0 bg-gradient-to-t from-black/80 to-transparent text-white p-4">
              <h2 className="text-2xl font-semibold">
                {packageDetails.name || "Unnamed Package"}
              </h2>
              <p className="text-sm">
                {packageDetails.state?.name || "Unknown State"}
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Spotlight Section */}
        <div className="bg-white shadow-md rounded-2xl p-4 hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-bold mb-4">Package Highlights</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-blue-100 to-orange-100 hover:shadow-md transition-shadow">
              <MapPin className="text-blue-500" />
              <span>
                {packageDetails.destination || "Amazing Destinations"}
              </span>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-blue-100 to-orange-100 hover:shadow-md transition-shadow">
              <Clock className="text-blue-500" />
              <span>
                {packageDetails.duration?.days || 0} Days /{" "}
                {packageDetails.duration?.nights || 0} Nights
              </span>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-blue-100 to-orange-100 hover:shadow-md transition-shadow">
              <IndianRupee className="text-blue-500" />
              <span>
                {packageDetails.price?.toLocaleString() ||
                  "Price not available"}
              </span>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-blue-100 to-orange-100 hover:shadow-md transition-shadow">
              <Hotel className="text-blue-500" />
              <span>
                {packageDetails.accommodation || "Accommodation not specified"}
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: About Package */}
        <div className="bg-white shadow-md rounded-2xl p-4 hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-bold mb-4">About the Package</h3>
          <div>
            <h4 className="font-semibold">Highlights:</h4>
            <ul className="list-disc list-inside">
              {packageDetails.highlights?.length > 0 ? (
                packageDetails.highlights.map((item, index) => (
                  <li key={index}>{item}</li>
                ))
              ) : (
                <li>No highlights available.</li>
              )}
            </ul>
          </div>
          <div className="mt-4">
            <h4 className="font-semibold">Inclusions:</h4>
            <ul className="list-disc list-inside">
              {packageDetails.inclusions?.length > 0 ? (
                packageDetails.inclusions.map((item, index) => (
                  <li key={index}>{item}</li>
                ))
              ) : (
                <li>No inclusions listed.</li>
              )}
            </ul>
          </div>
          <div className="mt-4">
            <h4 className="font-semibold">Exclusions:</h4>
            <ul className="list-disc list-inside">
              {packageDetails.exclusions?.length > 0 ? (
                packageDetails.exclusions.map((item, index) => (
                  <li key={index}>{item}</li>
                ))
              ) : (
                <li>No exclusions listed.</li>
              )}
            </ul>
          </div>
          <div className="mt-4">
            <h4 className="font-semibold">Transportation:</h4>
            <p>{packageDetails.transportation || "Not specified"}</p>
          </div>
        </div>

        {/* Section 4: Itinerary - MODIFIED SECTION */}
        <div className="bg-white shadow-md rounded-2xl p-4 hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-bold mb-4">Daily Itinerary</h3>
          {packageDetails.itinerary?.length > 0 ? (
            <ul className="list-none space-y-3">
              {packageDetails.itinerary.map((item) => {
                const descriptionPrefixRegex = new RegExp(
                  `^Day\\s*${item.day}:\\s*`,
                  "i"
                );
                const cleanedDescription = item.description
                  .replace(descriptionPrefixRegex, "")
                  .trim();

                return (
                  <li
                    key={item._id || item.day}
                    className="flex items-start py-1"
                  >
                    <CalendarDays className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0 mt-1" />
                    <div>
                      <strong className="font-semibold">Day {item.day}:</strong>{" "}
                      {cleanedDescription}
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p>No itinerary available.</p>
          )}
        </div>

        {/* Section 5: Reviews */}
        <div className="bg-white shadow-md rounded-2xl p-4 hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-bold mb-4">Reviews</h3>
          <p className="mb-4">
            Average Rating: {packageDetails.averageRating || 0} / 5
          </p>
          {packageDetails.reviews?.length > 0 ? (
            packageDetails.reviews.map((review, index) => (
              <div key={index} className="border-b py-2">
                <p className="font-semibold">{review.name || "Anonymous"}</p>
                <p className="text-sm text-yellow-500">
                  Rating: {review.rating || 0} / 5
                </p>
                <p>{review.comment || "No comment provided."}</p>
              </div>
            ))
          ) : (
            <p>No reviews available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewPackageDetails;
