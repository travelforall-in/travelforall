import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  MapPin,
  Clock,
  IndianRupee,
  Hotel,
  CalendarDays,
  ArrowLeft,
} from "lucide-react";
import BookingForm from "./BookingPage";

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT SIDE: PACKAGE DETAILS */}
        <div className="lg:col-span-2 grid gap-6">
          {/* Image Section */}
          <div className="bg-white shadow-md rounded-2xl overflow-hidden">
            <div className="relative h-64 w-full">
              {packageDetails.fullImageUrls?.[0] && (
                <img
                  src={packageDetails.fullImageUrls[0]}
                  alt={packageDetails.name || "Package Image"}
                  className="object-cover w-full h-full"
                />
              )}
              <div className="absolute bottom-0 left-0 bg-gradient-to-t from-black/80 to-transparent text-white p-4">
                <h2 className="text-2xl font-semibold">{packageDetails.name}</h2>
                <p className="text-sm">
                  {packageDetails.state?.name || "Unknown State"}
                </p>
              </div>
            </div>
          </div>

          {/* Highlights */}
          <div className="bg-white shadow-md rounded-2xl p-4">
            <h3 className="text-xl font-bold mb-4">Package Highlights</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoCard icon={<MapPin />} label={packageDetails.destination} />
              <InfoCard
                icon={<Clock />}
                label={`${packageDetails.duration?.days || 0} Days / ${packageDetails.duration?.nights || 0} Nights`}
              />
              <InfoCard
                icon={<IndianRupee />}
                label={packageDetails.price?.toLocaleString() || "Not available"}
              />
              <InfoCard
                icon={<Hotel />}
                label={packageDetails.accommodation || "N/A"}
              />
            </div>
          </div>

          {/* About Package */}
          <div className="bg-white shadow-md rounded-2xl p-4">
            <h3 className="text-xl font-bold mb-4">About the Package</h3>
            <SectionList title="Highlights" items={packageDetails.highlights} />
            <SectionList title="Inclusions" items={packageDetails.inclusions} />
            <SectionList title="Exclusions" items={packageDetails.exclusions} />
            <div className="mt-4">
              <h4 className="font-semibold">Transportation:</h4>
              <p>{packageDetails.transportation || "Not specified"}</p>
            </div>
          </div>

          {/* Itinerary */}
          <div className="bg-white shadow-md rounded-2xl p-4">
            <h3 className="text-xl font-bold mb-4">Daily Itinerary</h3>
            {packageDetails.itinerary?.length > 0 ? (
              <ul className="space-y-3">
                {packageDetails.itinerary.map((item) => {
                  const cleanedDescription = item.description
                    .replace(new RegExp(`^Day\\s*${item.day}:\\s*`, "i"), "")
                    .trim();

                  return (
                    <li key={item._id || item.day} className="flex items-start py-1">
                      <CalendarDays className="h-5 w-5 text-blue-500 mr-3 mt-1" />
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

          {/* Reviews */}
          <div className="bg-white shadow-md rounded-2xl p-4">
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

        {/* RIGHT SIDE: BOOKING FORM */}
        <BookingForm
          packageId={id}
          price={packageDetails.price || 0}
          navigate={navigate}
        />
      </div>
    </div>
  );
};

const InfoCard = ({ icon, label }) => (
  <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-blue-100 to-orange-100 hover:shadow-md transition-shadow">
    <span className="text-blue-500">{icon}</span>
    <span>{label}</span>
  </div>
);

const SectionList = ({ title, items }) => (
  <div className="mt-4">
    <h4 className="font-semibold">{title}:</h4>
    <ul className="list-disc list-inside">
      {items?.length > 0 ? (
        items.map((item, idx) => <li key={idx}>{item}</li>)
      ) : (
        <li>No {title.toLowerCase()} available.</li>
      )}
    </ul>
  </div>
);

export default ViewPackageDetails;
