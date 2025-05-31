// import React, { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Link } from "react-router-dom";
// import { Card } from "@/components/ui/card"; // Use Card component for displaying trip information
// import { Avatar } from "@/components/ui/avatar";
// import { Separator } from "@/components/ui/separator";
// import { ToastContainer, toast } from "react-toastify"; // Toast for success notifications
// import "react-toastify/dist/ReactToastify.css";

// const MyPackages = () => {
//   // Sample trips data. You can replace this with API data.
//   const [packages, setPackages] = useState([
//     {
//       id: 1,
//       destination: "Paris",
//       startDate: "2025-06-10",
//       endDate: "2025-06-17",
//       status: "Upcoming",
//       imageUrl: "https://example.com/paris.jpg", // Replace with real images
//     },
//     {
//       id: 2,
//       destination: "New York",
//       startDate: "2025-05-20",
//       endDate: "2025-05-27",
//       status: "Completed",
//       imageUrl: "https://example.com/newyork.jpg", // Replace with real images
//     },
//     {
//       id: 3,
//       destination: "Tokyo",
//       startDate: "2025-07-01",
//       endDate: "2025-07-10",
//       status: "Upcoming",
//       imageUrl: "https://example.com/tokyo.jpg", // Replace with real images
//     },
//   ]);

//   const handleCancelPackage = (id: number) => {
//     // You can implement an API call to cancel the trip here
//     setPackages(packages.filter((pkg) => pkg.id !== id)); // Remove the canceled trip from the state
//     toast.success("Package canceled successfully!");
//   };

//   return (
//     <div className="max-w-6xl mx-auto px-4 py-10">
//       <h2 className="text-3xl font-bold mb-6">My Packages</h2>
      
//       <Link to="/" className="text-primary text-sm mb-4 inline-block">
//   <Button
//     className="w-full md:w-auto mt-4 py-3 bg-primary text-white font-semibold hover:bg-primary-dark transition duration-300"
//   >
//     Back to Home
//   </Button>
// </Link>

      
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {packages.map((pkg) => (
//           <Card key={pkg.id} className="p-6 bg-white shadow-md rounded-md">
//             <div className="flex justify-between">
//               <Avatar
//                 src={pkg.imageUrl}
//                 alt={pkg.destination}
//                 className="w-16 h-16 rounded-md object-cover"
//               />
//               <div className="text-right">
//                 <span
//                   className={`px-3 py-1 rounded-full text-sm ${
//                     pkg.status === "Upcoming"
//                       ? "bg-green-200 text-green-800"
//                       : "bg-gray-200 text-gray-800"
//                   }`}
//                 >
//                   {pkg.status}
//                 </span>
//               </div>
//             </div>

//             <div className="mt-4">
//               <h3 className="text-xl font-semibold">{pkg.destination}</h3>
//               <p className="text-sm text-gray-600">
//                 {pkg.startDate} - {pkg.endDate}
//               </p>
//             </div>

//             <Separator className="my-4" />

//             <div className="flex justify-between items-center">
//             <Button
//   className="w-full md:w-auto mt-4 py-3 bg-primary text-white font-semibold hover:bg-primary-light transition-all duration-300 ease-in-out"
//   onClick={() => handleCancelPackage(pkg.id)}
// >
//   Cancel Package
// </Button>

//               <Link
//                 to={`/package-details/${pkg.id}`}
//                 className="text-primary font-semibold"
//               >
//                 View Details
//               </Link>
//             </div>
//           </Card>
//         ))}
//       </div>

//       <ToastContainer />
//     </div>
//   );
// };

// export default MyPackages;


import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Package {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  // add other fields as needed
}

interface Booking {
  _id: string;
  bookingDate: string;
  status: string;
  package: Package;
}

interface MyPackagesProps {
  userId: string;
}

const MyPackages: React.FC<MyPackagesProps> = ({ userId }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/my-packages/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch bookings");
        const data: Booking[] = await response.json();
        setBookings(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchBookings();
    }
  }, [userId]);

  const handleCancelBooking = (bookingId: string) => {
    // Call backend API to cancel booking (optional)
    setBookings((prev) => prev.filter((b) => b._id !== bookingId));
    toast.success("Booking canceled successfully!");
  };

  if (loading) return <p>Loading your packages...</p>;
  if (error) return <p>Error: {error}</p>;

  if (bookings.length === 0) return <p>You have no booked packages.</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-6">My Packages</h2>

      <Link to="/" className="text-primary text-sm mb-4 inline-block">
        <Button className="w-full md:w-auto mt-4 py-3 bg-primary text-white font-semibold hover:bg-primary-dark transition duration-300">
          Back to Home
        </Button>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookings.map(({ _id, status, package: pkg }) => (
          <Card key={_id} className="p-6 bg-white shadow-md rounded-md">
            <div className="flex justify-between">
              <Avatar
                src={pkg.imageUrl}
                alt={pkg.title}
                className="w-16 h-16 rounded-md object-cover"
              />
              <div className="text-right">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    status === "confirmed"
                      ? "bg-green-200 text-green-800"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {status}
                </span>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-xl font-semibold">{pkg.title}</h3>
              <p className="text-sm text-gray-600">{pkg.description}</p>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between items-center">
              <Button
                className="w-full md:w-auto mt-4 py-3 bg-primary text-white font-semibold hover:bg-primary-light transition-all duration-300 ease-in-out"
                onClick={() => handleCancelBooking(_id)}
              >
                Cancel Booking
              </Button>

              <Link
                to={`/package-details/${pkg._id}`}
                className="text-primary font-semibold"
              >
                View Details
              </Link>
            </div>
          </Card>
        ))}
      </div>

      <ToastContainer />
    </div>
  );
};

export default MyPackages;
