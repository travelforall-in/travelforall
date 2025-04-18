// import React from 'react';
// import { Search, MapPin, Calendar, Users } from 'lucide-react';
// import { Button } from "@/components/ui/button";
// import { Link } from "react-router-dom";

// const HeroSection = () => {
//   const heroImageUrl = "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80";

//   return (
//     <div className="relative h-[90vh] flex items-center">
//       {/* Background Image */}
//       <div
//         className="absolute inset-0 bg-cover bg-center"
//         style={{ backgroundImage: `url(${heroImageUrl})` }}
//       >
//         <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70"></div>
//       </div>

//       <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
//         <div className="mb-16">
//           {/* Hero Content */}
//           <div className="max-w-3xl animate-fadeIn">
//             <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
//               Discover Your Perfect <span className="text-coral-500">Destination</span>
//             </h1>
//             <p className="text-xl text-white/90 mb-8">
//               Explore the world with exclusive deals on hotels, flights, and curated travel experiences.
//             </p>
//             <Link to="/explore-packages">
//   <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white font-semibold">
//     Explore Packages
//   </Button>
// </Link>
//           </div>

//           {/* Search Box */}
//           <div className="mt-12 bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg max-w-5xl mx-auto animate-slideUp">
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//               <div className="relative">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
//                 <div className="relative">
//                   <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//                   <input
//                     type="text"
//                     placeholder="Where to?"
//                     className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary py-2 border px-3"
//                   />
//                 </div>
//               </div>

//               <div className="relative">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
//                 <div className="relative">
//                   <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//                   <input
//                     type="date"
//                     className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary py-2 border px-3"
//                   />
//                 </div>
//               </div>

//               <div className="relative">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
//                 <div className="relative">
//                   <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//                   <input
//                     type="date"
//                     className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary py-2 border px-3"
//                   />
//                 </div>
//               </div>

//               {/* <div className="relative">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Travelers</label>
//                 <div className="relative">
//                   <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//                   <select
//                     className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary py-2 border px-3 appearance-none"
//                   >
//                     <option>1 Adult</option>
//                     <option>2 Adults</option>
//                     <option>2 Adults, 1 Child</option>
//                     <option>2 Adults, 2 Children</option>
//                     <option>Group (5+)</option>
//                   </select>
//                 </div>
//               </div> */}

//             </div>

//             <div className="mt-4 flex justify-center">
//               <Button className="px-8 bg-primary hover:bg-primary/90">
//                 <Search className="h-4 w-4 mr-2" />
//                 Search
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HeroSection;




// import { useNavigate } from "react-router-dom"; // Add this at the top
// import React, { useEffect, useState } from "react";
// import { Search, MapPin, Calendar } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import BASE_URL from "@/utils/baseUrl";

// const HeroSection = () => {
//   const navigate = useNavigate();

//   const [from, setFrom] = useState("");
//   const [places, setPlaces] = useState([]);
//   const [to, setTo] = useState("");
//   const [checkIn, setCheckIn] = useState("");
//   const [checkOut, setCheckOut] = useState("");
//   const [districts, setDistricts] = useState([]);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [select, setSelect] = useState("");
//   const [query, setQuery] = useState("");

//   useEffect(() => {
//     const fetchDistricts = async () => {
//       try {
//         const res = await axios.get(`${BASE_URL}/districts`);
//         setDistricts(res.data);
//       } catch (err) {
//         console.error("Error fetching districts:", err);
//       }
//     };

//     fetchDistricts();
//   }, []);

//   const handleInputChange = async (e: any) => {
//     const value = e.target.value;
//     setQuery(value); // updates input box display
  
//     try {
//       const response = await axios.get(`${BASE_URL}/search-places`, {
//         params: { search_data: value }, // use the immediate value
//       });
  
//       setPlaces(response.data.data);
//       setShowDropdown(true);
//     } catch (error) {
//       console.error("Error fetching suggestions:", error);
//       setShowDropdown(false);
//     }
//   };
  

//   const handleSearch = async () => {
//     if (!from || !to) {
//       alert("Please enter both source and destination.");
//       return;
//     }

//     try {
//       const res = await axios.get(`${BASE_URL}/search`, {
//         params: { from, to }, // ✅ Correct way to pass query params
//       });

//       console.log(`Searching from ${from} to ${to}`);
//       console.log(`Check-in: ${checkIn}, Check-out: ${checkOut}`);

//       navigate("/search-results", {
//         state: { data: res.data, from, to, checkIn, checkOut },
//       });
//     } catch (err) {
//       console.error("Error fetching packages:", err);
//     }
//   };

//   const handleSelect = (value) => {
//     setSelect(value);
//     setShowDropdown(false);
//   };
//   const heroImageUrl =
//     "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=2070&q=80";

//   return (
//     <div className="relative h-[90vh] flex items-center">
//       {/* Background Image */}
//       <div
//         className="absolute inset-0 bg-cover bg-center"
//         style={{ backgroundImage: `url(${heroImageUrl})` }}
//       >
//         <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70" />
//       </div>

//       <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
//         <div className="mb-16">
//           {/* Hero Text */}
//           <div className="max-w-3xl animate-fadeIn">
//             <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
//               Discover Your Perfect{" "}
//               <span className="text-coral-500">Destination</span>
//             </h1>
//             <p className="text-xl text-white/90 mb-8">
//               Explore the world with exclusive deals on hotels, flights, and
//               curated travel experiences.
//             </p>
//             <Link to="/explore-packages">
//               <Button
//                 size="lg"
//                 className="bg-secondary hover:bg-secondary/90 text-white font-semibold"
//               >
//                 Explore Packages
//               </Button>
//             </Link>
//           </div>

//           {/* Search Form */}
//           <div className="mt-12 bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg max-w-5xl mx-auto animate-slideUp">
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//               {/* From */}
//               <div className="relative">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   From
//                 </label>
//                 <div className="relative">
//                   <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
//                   <input
//                     value={query}
//                     onChange={handleInputChange}
//                     placeholder="Search City..."
//                     className="w-full border px-3 py-2 rounded"
//                   />

//                   {showDropdown && places.length > 0 && (
//                     <ul className="absolute z-10 w-full bg-white border rounded shadow-lg mt-1 max-h-60 overflow-y-auto">
//                       {places.map((item, index) => (
//                         <li
//                           key={index}
//                           className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                           onClick={() => handleSelect(item.name)}
//                         >
//                           {item.name}
//                         </li>
//                       ))}
//                     </ul>
//                   )}
//                 </div>
//               </div>

//               {/* To */}
//               <div className="relative">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   To
//                 </label>
//                 <div className="relative">
//                   <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
//                   <input
//                     type="text"
//                     placeholder="Destination"
//                     value={places}
//                     onChange={handleInputChange}
//                     className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary py-2 border px-3"
//                   />
//                   {to && (
//                     <ul className="absolute left-0 right-0 mt-1 bg-white border rounded shadow z-50 max-h-40 overflow-y-auto">
//                       {districts
//                         .filter((d) =>
//                           d.name.toLowerCase().includes(to.toLowerCase())
//                         )
//                         .map((d, idx) => (
//                           <li
//                             key={idx}
//                             className="px-4 py-2 cursor-pointer hover:bg-gray-100"
//                             onClick={() => setTo(d.name)}
//                           >
//                             {d.name}
//                           </li>
//                         ))}
//                     </ul>
//                   )}
//                 </div>
//               </div>

//               {/* Check-in */}
//               <div className="relative">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Check-in
//                 </label>
//                 <div className="relative">
//                   <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
//                   <input
//                     type="date"
//                     value={checkIn}
//                     onChange={(e) => setCheckIn(e.target.value)}
//                     className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary py-2 border px-3"
//                   />
//                 </div>
//               </div>

//               {/* Check-out */}
//               <div className="relative">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Check-out
//                 </label>
//                 <div className="relative">
//                   <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
//                   <input
//                     type="date"
//                     value={checkOut}
//                     onChange={(e) => setCheckOut(e.target.value)}
//                     className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary py-2 border px-3"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Search Button */}
//             <div className="mt-4 flex justify-center">
//               <Button
//                 className="px-8 bg-primary hover:bg-primary/90"
//                 onClick={handleSearch}
//               >
//                 <Search className="h-4 w-4 mr-2" />
//                 Search
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default HeroSection;


// import { useNavigate } from "react-router-dom";
// import React, { useEffect, useState } from "react";
// import { Search, MapPin, Calendar } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import BASE_URL from "@/utils/baseUrl";

// const HeroSection = () => {
//   const navigate = useNavigate();

//   const [from, setFrom] = useState("");
//   const [to, setTo] = useState("");
//   const [checkIn, setCheckIn] = useState("");
//   const [checkOut, setCheckOut] = useState("");
//   const [districts, setDistricts] = useState([]);
//   const [places, setPlaces] = useState([]);
//   const [showFromDropdown, setShowFromDropdown] = useState(false);
//   const [showToDropdown, setShowToDropdown] = useState(false);

//   useEffect(() => {
//     const fetchDistricts = async () => {
//       try {
//         const res = await axios.get(`${BASE_URL}/districts`);
//         setDistricts(res.data);
//       } catch (err) {
//         console.error("Error fetching districts:", err);
//       }
//     };

//     fetchDistricts();
//   }, []);

//   const handleFromChange = async (e) => {
//     const value = e.target.value;
//     setFrom(value);

//     try {
//       const response = await axios.get(`${BASE_URL}/search-places`, {
//         params: { search_data: value },
//       });
//               console.log("Places (From):", response.data); // ✅ ADD THIS

//       setPlaces(response.data.data);
//       setShowFromDropdown(true);
//     } catch (error) {
//       console.error("Error fetching suggestions:", error);
//       setShowFromDropdown(false);
//     }
//   };

//   const handleToChange = (e) => {
//     const value = e.target.value;
//     setTo(value);
//     setShowToDropdown(true);
//   };

//   const handleSearch = async () => {
//     if (!from || !to) {
//       alert("Please enter both source and destination.");
//       return;
//     }

//     try {
//       const res = await axios.get(`${BASE_URL}/search`, {
//         params: { from, to },
//       });

//       navigate("/search-results", {
//         state: { data: res.data, from, to, checkIn, checkOut },
//       });
//     } catch (err) {
//       console.error("Error fetching packages:", err);
//     }
//   };

//   const heroImageUrl =
//     "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=2070&q=80";

//   return (
//     <div className="relative h-[90vh] flex items-center">
//       {/* Background */}
//       <div
//         className="absolute inset-0 bg-cover bg-center"
//         style={{ backgroundImage: `url(${heroImageUrl})` }}
//       >
//         <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70" />
//       </div>

//       {/* Content */}
//       <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
//         <div className="mb-16">
//           {/* Hero Text */}
//           <div className="max-w-3xl animate-fadeIn">
//             <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
//               Discover Your Perfect{" "}
//               <span className="text-coral-500">Destination</span>
//             </h1>
//             <p className="text-xl text-white/90 mb-8">
//               Explore the world with exclusive deals on hotels, flights, and curated travel experiences.
//             </p>
//             <Link to="/explore-packages">
//               <Button className="bg-secondary hover:bg-secondary/90 text-white font-semibold" size="lg">
//                 Explore Packages
//               </Button>
//             </Link>
//           </div>

//           {/* Search Form */}
//           <div className="mt-12 bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg max-w-5xl mx-auto animate-slideUp">
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

//               {/* From */}
//               <div className="relative">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
//                 <div className="relative">
//                   <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
//                   <input
//                     value={from}
//                     onChange={handleFromChange}
//                     placeholder="Search City..."
//                     className="w-full border px-3 py-2 rounded pl-10"
//                   />
//                   {showFromDropdown && places.length > 0 && (
//                     <ul className="absolute z-10 w-full bg-white border rounded shadow-lg mt-1 max-h-60 overflow-y-auto">
//                       {places.map((item, index) => (
//                         <li
//                           key={index}
//                           className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                           onClick={() => {
//                             setFrom(item.name);
//                             setShowFromDropdown(false);
//                           }}
//                         >
//                           {item.name}
//                         </li>
//                       ))}
//                     </ul>
//                   )}
//                 </div>
//               </div>

//               {/* To */}
//               <div className="relative">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
//                 <div className="relative">
//                   <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
//                   <input
//                     type="text"
//                     placeholder="Destination"
//                     value={to}
//                     onChange={handleToChange}
//                     className="pl-10 w-full rounded-md border-gray-300 shadow-sm py-2 border px-3"
//                   />
//                   {showToDropdown && districts.length > 0 && (
//                     <ul className="absolute z-10 w-full bg-white border rounded shadow-lg mt-1 max-h-60 overflow-y-auto">
//                       {districts
//                         .filter((d) => d.name.toLowerCase().includes(to.toLowerCase()))
//                         .map((d, index) => (
//                           <li
//                             key={index}
//                             className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                             onClick={() => {
//                               setTo(d.name);
//                               setShowToDropdown(false);
//                             }}
//                           >
//                             {d.name}
//                           </li>
//                         ))}
//                     </ul>
//                   )}
//                 </div>
//               </div>

//               {/* Check-in */}
//               <div className="relative">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
//                 <div className="relative">
//                   <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
//                   <input
//                     type="date"
//                     value={checkIn}
//                     onChange={(e) => setCheckIn(e.target.value)}
//                     className="pl-10 w-full rounded-md border-gray-300 shadow-sm py-2 border px-3"
//                   />
//                 </div>
//               </div>

//               {/* Check-out */}
//               <div className="relative">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
//                 <div className="relative">
//                   <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
//                   <input
//                     type="date"
//                     value={checkOut}
//                     onChange={(e) => setCheckOut(e.target.value)}
//                     className="pl-10 w-full rounded-md border-gray-300 shadow-sm py-2 border px-3"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Search Button */}
//             <div className="mt-4 flex justify-center">
//               <Button className="px-8 bg-primary hover:bg-primary/90" onClick={handleSearch}>
//                 <Search className="h-4 w-4 mr-2" />
//                 Search
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HeroSection;

// import { useNavigate } from "react-router-dom";
// import React, { useState } from "react";
// import { Search, MapPin, Calendar } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import BASE_URL from "@/utils/baseUrl";

// const HeroSection = () => {
//   const navigate = useNavigate();
//   const [searchData, setSearchData] = useState({
//     from: "",
//     to: "",
//     checkIn: "",
//     checkOut: ""
//   });
//   const [suggestions, setSuggestions] = useState({
//     from: [],
//     to: []
//   });
//   const [showDropdown, setShowDropdown] = useState({
//     from: false,
//     to: false
//   });
//   const [dateError, setDateError] = useState("");

//   const fetchSuggestions = async (field, value) => {
//     if (value.length < 2) {
//       setSuggestions(prev => ({ ...prev, [field]: [] }));
//       return;
//     }

//     try {
//       const response = await axios.get(`${BASE_URL}/search-places`, {
//         params: { search_data: value }
//       });

//       const suggestionsData = response.data.suggestions?.[field] ||
//         response.data.data ||
//         [];

//       const formattedSuggestions = suggestionsData.map(item => {
//         return typeof item === "string" ? { name: item } : item;
//       });

//       setSuggestions(prev => ({
//         ...prev,
//         [field]: formattedSuggestions
//       }));
//     } catch (error) {
//       console.error(`Error fetching ${field} suggestions:`, error);
//       setSuggestions(prev => ({ ...prev, [field]: [] }));
//     }
//   };

//   const handleChange = (field) => async (e) => {
//     const value = e.target.value;
//     const today = new Date().toISOString().split('T')[0];
    
//     setSearchData(prev => {
//       const newData = { ...prev, [field]: value };
      
//       // Reset date error when changing fields
//       if (field !== "checkIn" && field !== "checkOut") {
//         setDateError("");
//         return newData;
//       }

//       // Date validation
//       if (field === "checkIn") {
//         if (value < today) {
//           setDateError("Check-in date cannot be in the past.");
//           newData.checkIn = today;
//         } else if (newData.checkOut && newData.checkOut < value) {
//           setDateError("Check-out date cannot be before check-in date.");
//           newData.checkOut = "";
//         } else {
//           setDateError("");
//         }
//       }

//       if (field === "checkOut") {
//         if (value < today) {
//           setDateError("Check-out date cannot be in the past.");
//           newData.checkOut = today;
//         } else if (newData.checkIn && value < newData.checkIn) {
//           setDateError("Check-out date cannot be before check-in date.");
//         } else {
//           setDateError("");
//         }
//       }

//       return newData;
//     });

//     if (field === "from" || field === "to") {
//       await fetchSuggestions(field, value);
//       setShowDropdown(prev => ({ ...prev, [field]: true }));
//     }
//   };

//   const handleSelect = (field, value) => {
//     setSearchData(prev => ({ ...prev, [field]: value }));
//     setShowDropdown(prev => ({ ...prev, [field]: false }));
//   };

//   const handleSearch = async () => {
//     // Validate required fields
//     if (!searchData.from || !searchData.to) {
//       alert("Please enter both source and destination.");
//       return;
//     }

//     // Validate dates
//     const today = new Date().toISOString().split('T')[0];
//     if (searchData.checkIn < today) {
//       setDateError("Check-in date cannot be in the past.");
//       return;
//     }
//     if (searchData.checkOut < today) {
//       setDateError("Check-out date cannot be in the past.");
//       return;
//     }
//     if (searchData.checkOut && searchData.checkOut < searchData.checkIn) {
//       setDateError("Check-out date cannot be before check-in date.");
//       return;
//     }

//     try {
//       const res = await axios.get(`${BASE_URL}/search`, {
//         params: {
//           from: searchData.from,
//           to: searchData.to,
//           checkIn: searchData.checkIn,
//           checkOut: searchData.checkOut
//         }
//       });

//       navigate("/search-results", {
//         state: {
//           data: res.data,
//           ...searchData
//         }
//       });
//     } catch (err) {
//       console.error("Error fetching packages:", err);
//       alert("An error occurred while searching. Please try again.");
//     }
//   };

//   return (
//     <div className="relative h-[90vh] flex items-center">
//       {/* Background */}
//       <div className="absolute inset-0 bg-cover bg-center" style={{
//         backgroundImage: "url(https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=2070&q=80)"
//       }}>
//         <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70" />
//       </div>
// .
//       {/* Content */}
//       <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
//         <div className="mb-16">
//           {/* Hero Text */}
//           <div className="max-w-3xl animate-fadeIn">
//             <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
//               Discover Your Perfect <span className="text-coral-500">Destination</span>
//             </h1>
//             <p className="text-xl text-white/90 mb-8">
//               Explore the world with exclusive deals on hotels, flights, and curated travel experiences.
//             </p>
//             <Link to="/explore-packages">
//               <Button className="bg-secondary hover:bg-secondary/90 text-white font-semibold" size="lg">
//                 Explore Packages
//               </Button>
//             </Link>
//           </div>

//           {/* Search Form */}
//           <div className="mt-12 bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg max-w-5xl mx-auto animate-slideUp">
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//               {/* From Field */}
//               <div className="relative">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
//                 <div className="relative">
//                   <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
//                   <input
//                     value={searchData.from}
//                     onChange={handleChange("from")}
//                     onFocus={() => setShowDropdown(prev => ({ ...prev, from: true }))}
//                     onBlur={() => setTimeout(() => setShowDropdown(prev => ({ ...prev, from: false })), 200)}
//                     placeholder="Search City..."
//                     className="w-full border px-3 py-2 rounded pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                   {showDropdown.from && suggestions.from.length > 0 && (
//                     <div className="absolute z-50 w-full mt-1">
//                       <ul className="bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
//                         {suggestions.from.map((item, index) => (
//                           <li
//                             key={index}
//                             className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-800"
//                             onMouseDown={() => handleSelect("from", item.name)}
//                           >
//                             {item.name}
//                           </li>
//                         ))}
//                       </ul>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* To Field */}
//               <div className="relative">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
//                 <div className="relative">
//                   <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
//                   <input
//                     value={searchData.to}
//                     onChange={handleChange("to")}
//                     onFocus={() => setShowDropdown(prev => ({ ...prev, to: true }))}
//                     onBlur={() => setTimeout(() => setShowDropdown(prev => ({ ...prev, to: false })), 200)}
//                     placeholder="Destination"
//                     className="w-full border px-3 py-2 rounded pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                   {showDropdown.to && suggestions.to.length > 0 && (
//                     <div className="absolute z-50 w-full mt-1">
//                       <ul className="bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
//                         {suggestions.to.map((item, index) => (
//                           <li
//                             key={index}
//                             className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-800"
//                             onMouseDown={() => handleSelect("to", item.name)}
//                           >
//                             {item.name}
//                           </li>
//                         ))}
//                       </ul>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Check-in */}
//               <div className="relative">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
//                 <div className="relative">
//                   <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
//                   <input
//                     type="date"
//                     value={searchData.checkIn}
//                     onChange={handleChange("checkIn")}
//                     min={new Date().toISOString().split('T')[0]}
//                     className="pl-10 w-full rounded-md border-gray-300 shadow-sm py-2 border px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//               </div>

//               {/* Check-out */}
//               <div className="relative">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
//                 <div className="relative">
//                   <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
//                   <input
//                     type="date"
//                     value={searchData.checkOut}
//                     onChange={handleChange("checkOut")}
//                     min={searchData.checkIn || new Date().toISOString().split('T')[0]}
//                     className="pl-10 w-full rounded-md border-gray-300 shadow-sm py-2 border px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Error message */}
//             {dateError && (
//               <div className="mt-2 text-center text-red-500 text-sm">
//                 {dateError}
//               </div>
//             )}

//             {/* Search Button */}
//             <div className="mt-4 flex justify-center">
//               <Button
//                 className="px-8 bg-primary hover:bg-primary/90"
//                 onClick={handleSearch}
//               >
//                 <Search className="h-4 w-4 mr-2" />
//                 Search
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HeroSection;

import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { Search, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import axios from "axios";
import BASE_URL from "@/utils/baseUrl";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// ... (imports stay the same)

const HeroSection = () => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    destination: "",
    checkIn: null,
    checkOut: null
  });
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dateError, setDateError] = useState("");

  const fetchSuggestions = async (value) => {
    if (value.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await axios.get(`${BASE_URL}/search-places`, {
        params: { search_data: value }
      });

      const suggestionsData = response.data.suggestions?.destination ||
        response.data.data || [];

      const formattedSuggestions = suggestionsData.map(item =>
        typeof item === "string" ? { name: item } : item
      );

      setSuggestions(formattedSuggestions);
    } catch (error) {
      console.error("Error fetching destination suggestions:", error);
      setSuggestions([]);
    }
  };

  const handleSelect = (value) => {
    setSearchData(prev => ({ ...prev, destination: value }));
    setShowDropdown(false);
  };

  const handleSearch = async () => {
    if (!searchData.destination) {
      alert("Please enter a destination.");
      return;
    }
  
    try {
      // Prepare params object
      const params = {
        destination: searchData.destination
      };
  
      // Only add checkIn if it exists and is valid
      if (searchData.checkIn) {
        params.checkIn = new Date(searchData.checkIn).toISOString().split('T')[0];
      }
  
      // Only add checkOut if it exists and is valid
      if (searchData.checkOut) {
        params.checkOut = new Date(searchData.checkOut).toISOString().split('T')[0];
      }
  
      // Make API call
      const res = await axios.get(`${BASE_URL}/search`, { params });
  
      // Navigate with results
      navigate("/search-results", {
        state: {
          data: res.data,
          destination: searchData.destination,
          ...(searchData.checkIn && { checkIn: params.checkIn }),
          ...(searchData.checkOut && { checkOut: params.checkOut })
        }
      });
  
    } catch (err) {
      console.error("Error fetching packages:", err);
      alert("An error occurred while searching. Please try again.");
    }
  };

  return (
    <div className="relative h-[90vh] flex items-center">
      <div className="absolute inset-0 bg-cover bg-center" style={{
        backgroundImage: "url(https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=2070&q=80)"
      }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="mb-16">
          <div className="max-w-3xl animate-fadeIn">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Discover Your Perfect <span className="text-coral-500">Destination</span>
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Explore the world with exclusive deals on hotels, flights, and curated travel experiences.
            </p>
            <Link to="/explore-packages">
              <Button className="bg-secondary hover:bg-secondary/90 text-white font-semibold" size="lg">
                Explore Packages
              </Button>
            </Link>
          </div>

          <div className="mt-12 bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg max-w-5xl mx-auto animate-slideUp">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Destination Field */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    value={searchData.destination}
                    onChange={(e) => {
                      setSearchData(prev => ({ ...prev, destination: e.target.value }));
                      fetchSuggestions(e.target.value);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                    placeholder="Where do you want to go?"
                    className="w-full border px-3 py-3 rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {showDropdown && suggestions.length > 0 && (
                    <div className="absolute z-50 w-full mt-1">
                      <ul className="bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {suggestions.map((item, index) => (
                          <li
                            key={index}
                            className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-gray-800"
                            onClick={() => handleSelect(item.name)} // ← updated here
                          >
                            {item.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Check-in */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
                  <DatePicker
                    selected={searchData.checkIn}
                    onChange={(date) => {
                      setSearchData(prev => ({
                        ...prev,
                        checkIn: date,
                        checkOut: date && prev.checkOut && date > prev.checkOut ? null : prev.checkOut
                      }));
                    }}
                    minDate={new Date()}
                    placeholderText="Select a date"
                    dateFormat="dd/MM/yyyy" // <-- Here
                    className="w-full border px-3 py-3 rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Check-out */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
                  <DatePicker
                    selected={searchData.checkOut}
                    onChange={(date) => setSearchData(prev => ({ ...prev, checkOut: date }))}
                    minDate={searchData.checkIn || new Date()}
                    disabled={!searchData.checkIn}
                    placeholderText="Select a date"
                    dateFormat="dd/MM/yyyy" // <-- Here
                    className="w-full border px-3 py-3 rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Error Message */}
            {dateError && (
              <div className="mt-2 text-center text-red-500 text-sm">
                {dateError}
              </div>
            )}

            {/* Search Button */}
            <div className="mt-4 flex justify-center">
              <Button
                className="px-8 bg-primary hover:bg-primary/90 py-4 text-lg"
                onClick={handleSearch}
              >
                <Search className="h-5 w-5 mr-2" />
                Search Packages
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
