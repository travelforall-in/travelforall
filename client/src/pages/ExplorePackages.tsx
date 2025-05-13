// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// // import { packages as allPackages, getAllTags } from "../data/packages";
// import { Map, Calendar, Star, Users, Tag, Filter } from "lucide-react";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";

// const ExplorePackages = () => {
//   const [selectedTags, setSelectedTags] = useState([]);
//   const [filteredPackages, setFilteredPackages] = useState(allPackages || []);
//   const [priceRange, setPriceRange] = useState([0, 5000]);
//   const [isFilterOpen, setIsFilterOpen] = useState(false);
//   const allTags = getAllTags() || [];

//   useEffect(() => {
//     let result = allPackages;

//     // Filter by selected tags
//     if (selectedTags.length > 0) {
//       result = result.filter((pkg) =>
//         selectedTags.some((tag) => pkg.tags.includes(tag))
//       );
//     }

//     // Filter by price range
//     result = result.filter(
//       (pkg) => pkg.price >= priceRange[0] && pkg.price <= priceRange[1]
//     );

//     setFilteredPackages(result);
//   }, [selectedTags, priceRange]);

//   const toggleTag = (tag) => {
//     setSelectedTags((prev) =>
//       prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
//     );
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
//       <Navbar />

//       {/* Hero Section */}
//       <div
//         className="relative h-[40vh] bg-cover bg-center"
//         style={{
//           backgroundImage:
//             "url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=2000')",
//         }}
//       >
//         <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
//           <div className="text-center px-4">
//             <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
//               Explore Travel Packages
//             </h1>
//             <p className="text-xl text-white max-w-2xl mx-auto">
//               Discover handcrafted travel experiences to the world's most breathtaking destinations
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="container mx-auto p-6 flex-grow">
//         {/* Mobile Filter Toggle */}
//         <div className="md:hidden my-4">
//           <button
//             onClick={() => setIsFilterOpen(!isFilterOpen)}
//             className="w-full flex items-center justify-center space-x-2 bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-700"
//           >
//             <Filter className="w-4 h-4" />
//             <span>{isFilterOpen ? "Hide Filters" : "Show Filters"}</span>
//           </button>
//         </div>

//         <div className="flex flex-col md:flex-row gap-6">
//           {/* Filters Sidebar */}
//           <div className={`w-full md:w-1/4 ${isFilterOpen ? 'block' : 'hidden md:block'}`}>
//             <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
//               <h2 className="text-xl font-semibold mb-4">Filters</h2>

//               {/* Price Range Filter */}
//               <div className="mb-6">
//                 <h3 className="font-medium mb-2">Price Range</h3>
//                 <div className="flex items-center justify-between mb-2">
//                   <span>${priceRange[0]}</span>
//                   <span>${priceRange[1]}</span>
//                 </div>
//                 <input
//                   type="range"
//                   min="0"
//                   max="5000"
//                   value={priceRange[1]}
//                   onChange={(e) =>
//                     setPriceRange([priceRange[0], parseInt(e.target.value)])
//                   }
//                   className="w-full h-2 bg-blue-100 rounded-lg accent-blue-600"
//                 />
//               </div>

//               {/* Tags Filter */}
//               <div>
//                 <h3 className="font-medium mb-2">Categories</h3>
//                 <div className="flex flex-wrap gap-2">
//                   {allTags.map((tag) => (
//                     <button
//                       key={tag}
//                       onClick={() => toggleTag(tag)}
//                       className={`px-3 py-1 rounded-full text-sm ${
//                         selectedTags.includes(tag)
//                           ? "bg-blue-600 text-white"
//                           : "bg-gray-100 text-gray-800 hover:bg-gray-200"
//                       }`}
//                     >
//                       {tag}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {selectedTags.length > 0 && (
//                 <button
//                   onClick={() => setSelectedTags([])}
//                   className="mt-4 text-blue-600 text-sm hover:underline"
//                 >
//                   Clear all filters
//                 </button>
//               )}
//             </div>
//           </div>

//           {/* Package Grid */}
//           <div className="w-full md:w-3/4">
//             <div className="mb-6 flex justify-between items-center">
//               <p className="text-gray-600">
//                 Showing <span className="font-medium">{filteredPackages.length}</span> packages
//               </p>
//               <select className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm">
//                 <option>Sort by: Featured</option>
//                 <option>Price: Low to High</option>
//                 <option>Price: High to Low</option>
//                 <option>Rating: High to Low</option>
//               </select>
//             </div>

//             {filteredPackages.length === 0 ? (
//               <div className="bg-white rounded-lg shadow-md p-8 text-center">
//                 <h3 className="text-xl font-medium mb-2">No packages found</h3>
//                 <p className="text-gray-600 mb-4">
//                   Try adjusting your filters to find what you're looking for.
//                 </p>
//                 <button
//                   onClick={() => {
//                     setSelectedTags([]);
//                     setPriceRange([0, 5000]);
//                   }}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//                 >
//                   Reset Filters
//                 </button>
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {filteredPackages.map((pkg) => (
//                   <div
//                     key={pkg.id}
//                     className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300"
//                   >
//                     <div className="relative">
//                       <img
//                         src={pkg.image}
//                         alt={pkg.name}
//                         className="w-full h-48 object-cover"
//                       />
//                       {pkg.featured && (
//                         <span className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
//                           Featured
//                         </span>
//                       )}
//                     </div>
//                     <div className="p-5">
//                       <div className="flex items-center text-yellow-500 mb-1">
//                         {[...Array(5)].map((_, i) => (
//                           <Star
//                             key={i}
//                             className="w-4 h-4"
//                             fill={i < Math.floor(pkg.rating) ? "currentColor" : "none"}
//                           />
//                         ))}
//                         <span className="text-gray-600 text-sm ml-1">
//                           ({pkg.rating})
//                         </span>
//                       </div>
//                       <h2 className="text-xl font-semibold text-gray-800 mb-1">
//                         {pkg.name}
//                       </h2>
//                       <p className="text-gray-500 text-sm mb-2 flex items-center">
//                         <Map className="w-4 h-4 mr-1" />
//                         {pkg.destination}
//                       </p>
//                       <div className="mb-3 flex flex-wrap gap-1">
//                         {pkg.tags.map((tag) => (
//                           <span
//                             key={tag}
//                             className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full"
//                           >
//                             {tag}
//                           </span>
//                         ))}
//                       </div>
//                       <div className="border-t border-gray-100 pt-3 mt-3">
//                         <div className="flex items-center justify-between mb-3">
//                           <div className="flex items-center text-gray-600 text-sm">
//                             <Calendar className="w-4 h-4 mr-1" />
//                             {pkg.duration}
//                           </div>
//                           <div className="text-blue-600 font-bold text-lg">
//                             ${pkg.price}
//                           </div>
//                         </div>
//                         <Link
//                           to={`/package/${pkg.id}`}
//                           className="block text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-md transition-colors"
//                         >
//                           View Details
//                         </Link>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <Footer />
//     </div>
//   );
// };

// export default ExplorePackages;
