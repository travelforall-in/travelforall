// import React, { useState } from 'react';
// import Navbar from '@/components/Navbar';
// import Footer from '@/components/Footer';
// import { Link } from 'react-router-dom';
// import { Star, MapPin, Clock, User, Filter } from 'lucide-react';
// import { Button } from "@/components/ui/button";
// import { 
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue 
// } from "@/components/ui/select";
// import { Slider } from "@/components/ui/slider";

// // Import packages data (we'll use the same from PopularPackages)
// import { packages } from '@/data/packages';

// const PackagesPage = () => {
//   const [filteredPackages, setFilteredPackages] = useState(packages);
//   const [priceRange, setPriceRange] = useState([0, 5000]);
//   const [selectedDestination, setSelectedDestination] = useState('');
//   const [selectedDuration, setSelectedDuration] = useState('');
  
//   // Get unique destinations for filter
//   const destinations = [...new Set(packages.map(pkg => pkg.location.split(',')[0].trim()))];
  
//   // Get unique durations for filter
//   const durations = [...new Set(packages.map(pkg => pkg.duration))];
  
//   const handleFilterChange = () => {
//     let result = [...packages];
    
//     // Filter by price
//     result = result.filter(pkg => 
//       pkg.price >= priceRange[0] && pkg.price <= priceRange[1]
//     );
    
//     // Filter by destination if selected
//     if (selectedDestination) {
//       result = result.filter(pkg => 
//         pkg.location.includes(selectedDestination)
//       );
//     }
    
//     // Filter by duration if selected
//     if (selectedDuration) {
//       result = result.filter(pkg => 
//         pkg.duration === selectedDuration
//       );
//     }
    
//     setFilteredPackages(result);
//   };
  
//   return (
//     <div className="min-h-screen flex flex-col">
//       <Navbar />
//       <main className="flex-grow pt-16">
//         {/* Hero section */}
//         <div className="bg-primary/10 py-12 md:py-20">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//             <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Explore Our Travel Packages</h1>
//             <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//               Discover our carefully curated travel packages designed to provide unforgettable experiences
//             </p>
//           </div>
//         </div>
        
//         {/* Filters and packages grid */}
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//           <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
//             {/* Filters sidebar */}
//             <div className="lg:col-span-1">
//               <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
//                 <div className="flex items-center justify-between mb-6">
//                   <h3 className="text-lg font-semibold">Filters</h3>
//                   <Filter className="h-5 w-5 text-gray-500" />
//                 </div>
                
//                 {/* Price Range Filter */}
//                 <div className="mb-8">
//                   <h4 className="font-medium mb-3">Price Range</h4>
//                   <Slider
//                     defaultValue={[0, 5000]}
//                     max={5000}
//                     step={100}
//                     onValueChange={(value) => {
//                       setPriceRange(value);
//                     }}
//                     className="mb-2"
//                   />
//                   <div className="flex justify-between text-sm text-gray-600">
//                     <span>${priceRange[0]}</span>
//                     <span>${priceRange[1]}</span>
//                   </div>
//                 </div>
                
//                 {/* Destination Filter */}
//                 <div className="mb-8">
//                   <h4 className="font-medium mb-3">Destination</h4>
//                   <Select value={selectedDestination} onValueChange={setSelectedDestination}>
//                     <SelectTrigger className="w-full">
//                       <SelectValue placeholder="Select destination" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="">All Destinations</SelectItem>
//                       {destinations.map((destination, index) => (
//                         <SelectItem key={index} value={destination}>
//                           {destination}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
                
//                 {/* Duration Filter */}
//                 <div className="mb-8">
//                   <h4 className="font-medium mb-3">Duration</h4>
//                   <Select value={selectedDuration} onValueChange={setSelectedDuration}>
//                     <SelectTrigger className="w-full">
//                       <SelectValue placeholder="Select duration" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="">Any Duration</SelectItem>
//                       {durations.map((duration, index) => (
//                         <SelectItem key={index} value={duration}>
//                           {duration}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
                
//                 <Button className="w-full" onClick={handleFilterChange}>
//                   Apply Filters
//                 </Button>
//               </div>
//             </div>
            
//             {/* Packages Grid */}
//             <div className="lg:col-span-3">
//               <div className="mb-6 flex justify-between items-center">
//                 <h2 className="text-2xl font-bold text-gray-900">
//                   {filteredPackages.length} {filteredPackages.length === 1 ? 'Package' : 'Packages'} Available
//                 </h2>
//                 <Select defaultValue="popular">
//                   <SelectTrigger className="w-[180px]">
//                     <SelectValue placeholder="Sort by" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="popular">Most Popular</SelectItem>
//                     <SelectItem value="price-low">Price: Low to High</SelectItem>
//                     <SelectItem value="price-high">Price: High to Low</SelectItem>
//                     <SelectItem value="rating">Highest Rated</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
              
//               {filteredPackages.length === 0 ? (
//                 <div className="bg-white rounded-xl shadow-md p-8 text-center">
//                   <h3 className="text-xl font-semibold mb-2">No packages found</h3>
//                   <p className="text-gray-600 mb-4">Try adjusting your filters to see more results.</p>
//                   <Button variant="outline" onClick={() => {
//                     setPriceRange([0, 5000]);
//                     setSelectedDestination('');
//                     setSelectedDuration('');
//                     setFilteredPackages(packages);
//                   }}>
//                     Reset Filters
//                   </Button>
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   {filteredPackages.map((pkg) => (
//                     <div key={pkg.id} className="bg-white rounded-xl shadow-md overflow-hidden card-hover">
//                       <div className="relative">
//                         <img 
//                           src={pkg.image} 
//                           alt={pkg.name} 
//                           className="h-64 w-full object-cover"
//                         />
//                         {pkg.featured && (
//                           <div className="absolute top-4 right-4 bg-secondary/90 text-white text-xs font-bold px-3 py-1 rounded-full">
//                             Featured
//                           </div>
//                         )}
//                       </div>

//                       <div className="p-6">
//                         <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                        
//                         <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
//                           <div className="flex items-center">
//                             <MapPin className="h-4 w-4 mr-1 text-primary" />
//                             {pkg.location}
//                           </div>
//                           <div className="flex items-center">
//                             <Clock className="h-4 w-4 mr-1 text-primary" />
//                             {pkg.duration}
//                           </div>
//                         </div>
                        
//                         <p className="text-gray-600 mb-4 line-clamp-2">{pkg.description}</p>
                        
//                         <div className="flex items-center justify-between mb-4">
//                           <div className="flex items-center">
//                             <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
//                             <span className="ml-1 text-sm font-semibold">{pkg.rating}</span>
//                             <span className="ml-1 text-sm text-gray-500">({pkg.reviews})</span>
//                           </div>
//                           <div className="flex items-center text-gray-600 text-sm">
//                             <User className="h-4 w-4 mr-1" />
//                             {pkg.groupSize}
//                           </div>
//                         </div>
                        
//                         <div className="flex items-center justify-between pt-4 border-t border-gray-200">
//                           <div className="text-2xl font-bold text-primary">${pkg.price}</div>
//                           <Link 
//                             to={`/package/${pkg.id}`}
//                             className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary/90 transition"
//                           >
//                             View Details
//                           </Link>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default PackagesPage;



import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Package, Destination } from '../types/travel';
import { packages, destinations } from '../data/mockData';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

const PackagesPage = () => {
  const { destinationId } = useParams<{ destinationId: string }>();
  const navigate = useNavigate();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [availablePackages, setAvailablePackages] = useState<Package[]>([]);

  useEffect(() => {
    if (destinationId) {
      const foundDestination = destinations.find(d => d.id === destinationId);
      setDestination(foundDestination || null);
      const foundPackages = packages.filter(p => p.destinationId === destinationId);
      setAvailablePackages(foundPackages);
    }
  }, [destinationId]);

  if (!destination) {
    return <div>Loading...</div>;
  }

  return (
    <>
    <Navbar />
    
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {destination.name} Packages
          </h1>
          <p className="text-gray-600">{destination.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {availablePackages.map((pkg) => (
            <div key={pkg.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <img
                src={pkg.image}
                alt={pkg.name}
                className="h-48 w-full object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {pkg.name}
                </h3>
                <p className="text-gray-600 mb-4">{pkg.description}</p>
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-700 mb-2">Inclusions:</h4>
                  <ul className="list-disc list-inside text-gray-600">
                    {pkg.inclusions.map((inclusion, index) => (
                      <li key={index}>{inclusion}</li>
                    ))}
                  </ul>
                </div>
                <div className="flex items-center justify-between mt-6">
                  <div>
                    <span className="text-purple-600 font-bold text-xl">
                      ${pkg.price}
                    </span>
                    <span className="text-gray-500 ml-2">{pkg.duration}</span>
                  </div>
                  <button
                    onClick={() => navigate(`/booking/${pkg.id}`)}
                    className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
            onClick={() => navigate(-1)}
            className="mt-10 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            ← Back
          </button>
      </div>
      
      </div>
      
      <Footer />
    
    </>
  );
};

export default PackagesPage;
