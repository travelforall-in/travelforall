
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Star, MapPin, Clock, User, Calendar, CheckCircle, Info, Heart } from 'lucide-react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

// Import packages data
import { packages } from '@/data/packages';

const PackageDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [packageData, setPackageData] = useState(packages.find(pkg => pkg.id === Number(id)));
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState('');
  const [travelers, setTravelers] = useState(2);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Set package data based on ID from URL
    const pkg = packages.find(p => p.id === Number(id));
    setPackageData(pkg);
    
  }, [id]);

  if (!packageData) {
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

  const handleBookNow = () => {
    if (!selectedDate) {
      toast({
        title: "Please select a date",
        description: "You need to select a travel date to proceed with booking.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Booking successful!",
      description: `Your trip to ${packageData.name} has been booked for ${selectedDate}.`,
    });
  };

  const handleAddToWishlist = () => {
    toast({
      title: "Added to wishlist",
      description: `${packageData.name} has been added to your wishlist.`,
    });
  };

  // Available dates for this package
  const availableDates = [
    "June 15, 2023",
    "July 10, 2023",
    "August 5, 2023",
    "September 20, 2023",
    "October 12, 2023"
  ];

  // Included amenities
  const included = [
    "Accommodation in 4-star hotels",
    "Daily breakfast and selected meals",
    "Airport transfers",
    "English-speaking local guides",
    "All entrance fees to attractions",
    "Transportation between destinations"
  ];
  
  // Not included items
  const notIncluded = [
    "International flights",
    "Travel insurance",
    "Optional activities",
    "Personal expenses",
    "Tips for guides and drivers"
  ];

  // Itinerary data
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16">
        {/* Hero section with package image */}
        <div className="relative h-[50vh] md:h-[60vh]">
          <img 
            src={packageData.image} 
            alt={packageData.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 flex items-end">
            <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-12">
              <div className="inline-block bg-secondary/90 text-white text-sm font-semibold px-4 py-1 rounded-full mb-4">
                Featured Package
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{packageData.name}</h1>
              <div className="flex items-center space-x-6 text-white">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  {packageData.location}
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  {packageData.duration}
                </div>
                <div className="flex items-center">
                  <Star className="h-5 w-5 mr-2 text-yellow-400 fill-yellow-400" />
                  <span className="font-semibold">{packageData.rating}</span>
                  <span className="ml-1">({packageData.reviews} reviews)</span>
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
                      {packageData.description}
                      {/* Extended description for detail page */}
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
                        <span>Small group experience (max {packageData.groupSize})</span>
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
                        <span className="ml-1 font-semibold">{packageData.rating}</span>
                        <span className="ml-1 text-gray-600">({packageData.reviews} reviews)</span>
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
                      
                      <div>
                        <div className="flex justify-between mb-2">
                          <div className="flex items-center">
                            <img 
                              src="https://randomuser.me/api/portraits/women/45.jpg" 
                              alt="Reviewer" 
                              className="w-10 h-10 rounded-full mr-3"
                            />
                            <div>
                              <h4 className="font-semibold">Emma Davis</h4>
                              <p className="text-xs text-gray-500">Traveled February 2023</p>
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
                        <h5 className="font-medium mb-1">Perfect in every way!</h5>
                        <p className="text-gray-600 text-sm">
                          I cannot say enough good things about this tour. From start to finish, everything was perfectly organized. The guides were exceptional, the accommodations were lovely, and the experiences were unforgettable. I'm already planning my next trip!
                        </p>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full mt-6">
                      View All {packageData.reviews} Reviews
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Booking sidebar - 1/3 width */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                <div className="text-3xl font-bold text-primary mb-2">${packageData.price}</div>
                <p className="text-gray-500 text-sm mb-6">per person</p>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                      Select Travel Date
                    </label>
                    <select
                      id="date"
                      className="w-full rounded-md border border-gray-300 shadow-sm focus:border-primary focus:ring-primary py-2 px-3"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    >
                      <option value="">Select a date</option>
                      {availableDates.map((date, index) => (
                        <option key={index} value={date}>{date}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="travelers" className="block text-sm font-medium text-gray-700 mb-1">
                      Number of Travelers
                    </label>
                    <select
                      id="travelers"
                      className="w-full rounded-md border border-gray-300 shadow-sm focus:border-primary focus:ring-primary py-2 px-3"
                      value={travelers}
                      onChange={(e) => setTravelers(Number(e.target.value))}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                        <option key={num} value={num}>{num} {num === 1 ? 'Traveler' : 'Travelers'}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="border-t border-b border-gray-200 py-4 mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Base price:</span>
                    <span>${packageData.price}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Travelers:</span>
                    <span>x {travelers}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span>${packageData.price * travelers}</span>
                  </div>
                </div>
                
                <Button className="w-full mb-3 py-6" onClick={handleBookNow}>
                  Book Now
                </Button>
                
                <Button variant="outline" className="w-full flex items-center justify-center" onClick={handleAddToWishlist}>
                  <Heart className="mr-2 h-5 w-5" />
                  Add to Wishlist
                </Button>
                
                <div className="mt-6">
                  <div className="flex items-start space-x-2 text-sm text-gray-600">
                    <Calendar className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    <p>Free cancellation up to 30 days before departure</p>
                  </div>
                  <div className="flex items-start space-x-2 text-sm text-gray-600 mt-2">
                    <User className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    <p>Small group experience with maximum {packageData.groupSize}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Similar packages section */}
        <div className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">You May Also Like</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {packages.filter(pkg => pkg.id !== packageData.id).slice(0, 3).map((pkg) => (
                <div key={pkg.id} className="bg-white rounded-xl shadow-md overflow-hidden card-hover">
                  <div className="relative">
                    <img 
                      src={pkg.image} 
                      alt={pkg.name} 
                      className="h-48 w-full object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{pkg.name}</h3>
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <MapPin className="h-4 w-4 mr-1 text-primary" />
                      {pkg.location}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-primary">${pkg.price}</div>
                      <Link 
                        to={`/package/${pkg.id}`}
                        className="text-secondary hover:text-secondary/80 font-medium text-sm"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PackageDetailsPage;
