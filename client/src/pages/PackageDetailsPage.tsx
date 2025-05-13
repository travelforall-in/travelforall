// import { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import Navbar from '@/components/Navbar';
// import Footer from '@/components/Footer';
// import BASE_URL from '@/utils/baseUrl';

// interface Package {
//   _id: string;
//   packageName: string;
//   packageType: string;
//   destinations: { city?: string; region?: string; country?: string; name?: string }[];
//   duration: { days: number; nights: number };
//   price: { amount: number; currency: string };
//   images: { image: string };
//   shortDescription: string;
// }

// const PackageDetailsPage = () => {
//   const { packageId } = useParams<{ packageId: string }>();
//   const [pkg, setPkg] = useState<Package | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (packageId) {
//       axios
//         .get(`${BASE_URL}/api/packages/${packageId}`)
//         .then((res) => {
//           setPkg(res.data);
//           setError(null);
//         })
//         .catch((err) => {
//           console.error('Error fetching package:', err);
//           setError('Failed to load package details.');
//         });
//     }
//   }, [packageId]);

//   if (error) {
//     return <div className="text-center py-20 text-red-600">{error}</div>;
//   }

//   if (!pkg) {
//     return <div className="text-center py-20">Loading package details...</div>;
//   }

//   return (
//     <>
//       <Navbar />
//       <div className="max-w-4xl mx-auto px-4 py-10">
//         <img
//           src={pkg.images.image}
//           alt={pkg.packageName}
//           className="w-full h-64 object-cover rounded-xl mb-6"
//         />
//         <h1 className="text-3xl font-bold mb-2">{pkg.packageName}</h1>
//         <p className="text-gray-600 mb-4">{pkg.shortDescription}</p>

//         <div className="mb-4">
//           <h3 className="font-semibold">Duration:</h3>
//           <p>
//             {pkg.duration.days} Days / {pkg.duration.nights} Nights
//           </p>
//         </div>

//         <div className="mb-4">
//           <h3 className="font-semibold">Price:</h3>
//           <p>
//             {pkg.price.amount} {pkg.price.currency}
//           </p>
//         </div>

//         <div className="mb-4">
//           <h3 className="font-semibold">Destinations:</h3>
//           <ul className="list-disc list-inside">
//             {pkg.destinations.map((dest, idx) => (
//               <li key={idx}>
//                 {dest.name || `${dest.city}, ${dest.region}, ${dest.country}`}
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default PackageDetailsPage;


import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Star, 
  MapPin, 
  Clock, 
  User, 
  Calendar, 
  CheckCircle, 
  Info, 
  Heart 
} from 'lucide-react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BASE_URL from '@/utils/baseUrl';

interface Package {
  _id: string;
  packageName: string;
  packageType: string;
  destinations: { city?: string; region?: string; country?: string; name?: string }[];
  duration: { days: number; nights: number };
  price: { amount: number; currency: string };
  images: { image: string };
  shortDescription: string;
  rating?: number;
  reviews?: number;
  groupSize?: number;
}

const PackageDetailsPage = () => {
    const navigate = useNavigate();
    const { packageId } = useParams<{ packageId: string }>();
  const [pkg, setPkg] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [travelers, setTravelers] = useState(2);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/api/packages/${packageId}`);
        setPkg(response.data);
      } catch (err) {
        setError('Failed to load package details.');
        console.error('Error fetching package:', err);
      } finally {
        setLoading(false);
      }
    };

    if (packageId) {
      fetchPackage();
      window.scrollTo(0, 0);
    }
  }, [packageId]);
    
//   console.log('packageId:', packageId);
// console.log('packages:', packages);

  const handleBookNow = () => {
    navigate(`/booking/${pkg._id}`);
  };

  const handleAddToWishlist = () => {
    if (!pkg) return;
    
    const storedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const isAlreadyInWishlist = storedWishlist.some((item: Package) => item._id === pkg._id);
  
    if (!isAlreadyInWishlist) {
      const updatedWishlist = [...storedWishlist, pkg];
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      toast({
        title: "Added to wishlist",
        description: `${pkg.packageName} has been added to your wishlist.`,
      });
    } else {
      toast({
        title: "Already in wishlist",
        description: `${pkg.packageName} is already in your wishlist.`,
      });
    }
  };

  // Sample data for UI elements
  const availableDates = [
    "June 15, 2023",
    "July 10, 2023",
    "August 5, 2023",
    "September 20, 2023",
    "October 12, 2023"
  ];

  const included = [
    "Accommodation in 4-star hotels",
    "Daily breakfast and selected meals",
    "Airport transfers",
    "English-speaking local guides",
    "All entrance fees to attractions",
    "Transportation between destinations"
  ];
  
  const notIncluded = [
    "International flights",
    "Travel insurance",
    "Optional activities",
    "Personal expenses",
    "Tips for guides and drivers"
  ];

  const itinerary = [
    {
      day: 1,
      title: "Arrival & Welcome Dinner",
      description: "Arrive at your destination and be greeted by our local representative. Transfer to your hotel and check-in. In the evening, join the group for a welcome dinner featuring local cuisine."
    },
    {
      day: 2,
      title: "City Tour & Cultural Experience",
      description: "After breakfast, embark on a comprehensive city tour visiting key landmarks and historical sites. Enjoy lunch at a local restaurant followed by an immersive cultural experience in the afternoon."
    },
    {
      day: 3,
      title: "Nature Excursion",
      description: "Today is dedicated to exploring the natural beauty surrounding the area. Visit scenic viewpoints, take nature walks, and enjoy a picnic lunch amid stunning landscapes."
    },
    {
      day: 4,
      title: "Free Day for Optional Activities",
      description: "Enjoy a free day to explore on your own or choose from our selection of optional activities (at additional cost), including adventure sports, cooking classes, or spa treatments."
    },
    {
      day: 5,
      title: "Departure",
      description: "After breakfast, check out from your hotel. Depending on your flight schedule, enjoy some free time for last-minute shopping before your transfer to the airport."
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Loading Package Details...</h2>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !pkg) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Package Not Found</h2>
            <p className="text-gray-600 mb-6">The package you're looking for doesn't exist or has been removed.</p>
            <Link 
              to="/packages"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition"
            >
              Browse All Packages
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
}

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16">
        {/* Hero section with package image */}
        <div className="relative h-[50vh] md:h-[60vh]">
          <img 
            src={pkg.images.image} 
            alt={pkg.packageName} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 flex items-end">
            <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-12">
              <div className="inline-block bg-secondary/90 text-white text-sm font-semibold px-4 py-1 rounded-full mb-4">
                {pkg.packageType} Package
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{pkg.packageName}</h1>
              <div className="flex items-center space-x-6 text-white">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  {pkg.destinations[0]?.city || pkg.destinations[0]?.name}
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  {pkg.duration.days} Days / {pkg.duration.nights} Nights
                </div>
                <div className="flex items-center">
                  <Star className="h-5 w-5 mr-2 text-yellow-400 fill-yellow-400" />
                  <span className="font-semibold">{pkg.rating || 4.8}</span>
                  <span className="ml-1">({pkg.reviews || 24} reviews)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Package details content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content - 2/3 width */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="overview">
                <TabsList className="mb-8">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                  <TabsTrigger value="inclusions">Inclusions</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>
                
                {/* Overview Tab */}
                <TabsContent value="overview">
                  <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Tour Overview</h2>
                    <p className="text-gray-600 mb-6">
                      {pkg.shortDescription}
                      {" "}This carefully curated tour offers the perfect blend of cultural immersion, 
                      natural beauty, and leisure time. Whether you're seeking adventure, relaxation, 
                      or a deeper understanding of local cultures, this package provides an unforgettable 
                      experience tailored to diverse interests and preferences.
                    </p>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Tour Highlights</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 mb-6">
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>Expertly guided cultural tours</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>Authentic local cuisine experiences</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>Comfortable accommodation throughout</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>Scenic natural landscapes</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>Small group experience (max {pkg.groupSize || 12})</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>Free time for personal exploration</span>
                      </li>
                    </ul>
                    
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="flex items-start">
                        <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-blue-800">Important Information</h4>
                          <p className="text-sm text-blue-700">
                            This tour requires a moderate level of fitness as it includes walking tours and 
                            some outdoor activities. Please notify us of any specific dietary requirements 
                            or medical conditions when booking.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                {/* Itinerary Tab */}
                <TabsContent value="itinerary">
                  <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Tour Itinerary</h2>
                    
                    <div className="space-y-6">
                      {itinerary.map((day) => (
                        <div key={day.day} className="relative pl-8 pb-6 border-l-2 border-primary/30 last:border-0 last:pb-0">
                          <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-primary"></div>
                          <h3 className="text-lg font-semibold mb-1">Day {day.day}: {day.title}</h3>
                          <p className="text-gray-600">{day.description}</p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                      <div className="flex items-start">
                        <Info className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-yellow-800">Itinerary Note</h4>
                          <p className="text-sm text-yellow-700">
                            The itinerary may be subject to change due to weather conditions or unforeseen circumstances.
                            Our guides will always work to provide the best possible experience.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                {/* Inclusions Tab */}
                <TabsContent value="inclusions">
                  <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">What's Included</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-lg font-semibold text-green-600 mb-3 flex items-center">
                          <CheckCircle className="h-5 w-5 mr-2" />
                          Included in This Package
                        </h3>
                        <ul className="space-y-2">
                          {included.map((item, index) => (
                            <li key={index} className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold text-red-600 mb-3 flex items-center">
                          <Info className="h-5 w-5 mr-2" />
                          Not Included
                        </h3>
                        <ul className="space-y-2">
                          {notIncluded.map((item, index) => (
                            <li key={index} className="flex items-start">
                              <div className="h-5 w-5 relative mr-2 mt-0.5 flex-shrink-0">
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="w-4 h-0.5 bg-red-500 rotate-45"></div>
                                  <div className="w-4 h-0.5 bg-red-500 -rotate-45"></div>
                                </div>
                              </div>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                {/* Reviews Tab */}
                <TabsContent value="reviews">
                  <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
                      <div className="flex items-center">
                        <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                        <span className="ml-1 font-semibold">{pkg.rating || 4.8}</span>
                        <span className="ml-1 text-gray-600">({pkg.reviews || 24} reviews)</span>
                      </div>
                    </div>
                    
                    {/* Sample review items */}
                    <div className="space-y-6">
                      <div className="border-b border-gray-100 pb-6">
                        <div className="flex justify-between mb-2">
                          <div className="flex items-center">
                            <img 
                              src="https://randomuser.me/api/portraits/women/2.jpg" 
                              alt="Reviewer" 
                              className="w-10 h-10 rounded-full mr-3"
                            />
                            <div>
                              <h4 className="font-semibold">Jessica Williams</h4>
                              <p className="text-xs text-gray-500">Traveled April 2023</p>
                            </div>
                          </div>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className="w-4 h-4 text-yellow-400 fill-yellow-400" 
                              />
                            ))}
                          </div>
                        </div>
                        <h5 className="font-medium mb-1">Amazing experience, highly recommended!</h5>
                        <p className="text-gray-600 text-sm">
                          This tour exceeded all my expectations. The accommodations were excellent, and our guide was knowledgeable and friendly. Every day brought new and exciting experiences that I'll cherish forever.
                        </p>
                      </div>
                      
                      <div className="border-b border-gray-100 pb-6">
                        <div className="flex justify-between mb-2">
                          <div className="flex items-center">
                            <img 
                              src="https://randomuser.me/api/portraits/men/32.jpg" 
                              alt="Reviewer" 
                              className="w-10 h-10 rounded-full mr-3"
                            />
                            <div>
                              <h4 className="font-semibold">Robert Johnson</h4>
                              <p className="text-xs text-gray-500">Traveled March 2023</p>
                            </div>
                          </div>
                          <div className="flex">
                            {[...Array(4)].map((_, i) => (
                              <Star 
                                key={i} 
                                className="w-4 h-4 text-yellow-400 fill-yellow-400" 
                              />
                            ))}
                            {[...Array(1)].map((_, i) => (
                              <Star 
                                key={i} 
                                className="w-4 h-4 text-gray-300" 
                              />
                            ))}
                          </div>
                        </div>
                        <h5 className="font-medium mb-1">Great tour but some room for improvement</h5>
                        <p className="text-gray-600 text-sm">
                          The destinations were fantastic and most of the arrangements were smooth. I would have appreciated more free time at certain locations and the hotel on the third night was not as good as the others. Overall, still a great experience.
                        </p>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full mt-6">
                      View All {pkg.reviews || 24} Reviews
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
 {/* Right Column - Package Overview */}
<div className="lg:col-span-1">
  <div className="bg-white rounded-xl shadow-md p-6 sticky top-24 min-h-[500px] flex flex-col justify-between">
    <div>
      <h2 className="text-xl font-semibold text-emerald-700 mb-2">Package Overview</h2>
      <p className="text-sm text-gray-600 mb-4">
        Discover the beauty of this destination with our expertly curated itinerary, comfortable stays, and immersive local experiences. Perfect for solo travelers, couples, or families.
      </p>

      <hr className="my-4" />

      <div className="text-sm text-gray-700 space-y-2">
        <p><span className="font-semibold">Duration:</span> {pkg.duration.days} Days</p>
        <p><span className="font-semibold">Group Size:</span> Up to {pkg.groupSize || 12} travelers</p>
        <p><span className="font-semibold">Destinations:</span> {pkg.destinations.map(dest => dest.city).join(', ')}</p>
        <p><span className="font-semibold">Price:</span> {pkg.price.currency}{pkg.price.amount} per person</p>
      </div>
    </div>

    <div className="mt-6 space-y-4">
      <button
        onClick={handleAddToWishlist}
        className="w-full bg-white border border-emerald-600 text-emerald-600 font-medium py-3 rounded-md hover:bg-emerald-50 transition"
      >
        ♥ Add to Wishlist
      </button>

      <button
        onClick={handleBookNow}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-md transition"
      >
        Continue to Booking
      </button>
    </div>
  </div>
</div>
            
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PackageDetailsPage;