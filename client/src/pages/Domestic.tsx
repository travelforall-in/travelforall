// import { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { Destination, CategoryFilter } from '../types/travel';
// import { destinations } from '../data/mockData';
// import Navbar from '@/components/Navbar';
// import Footer  from '@/components/Footer';

// const Domestic = () => {
//   const { type } = useParams<{ type: string }>();
//   const navigate = useNavigate();
//   const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All');
//   const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
//   const [filteredDestinations, setFilteredDestinations] = useState<Destination[]>([]);

//   const categories: CategoryFilter[] = ['All', 'Student','Adventure', 'Honeymoon', 'Family', 'Solo', 'Group', 'Corporate'];

//   useEffect(() => {
//     const filtered = destinations.filter((dest) => {
//       const matchesType = dest.type?.toLowerCase() === type?.toLowerCase();
//       const matchesCategory = selectedCategory === 'All' || dest.category?.toLowerCase() === selectedCategory.toLowerCase();
//       const matchesPrice = dest.price >= priceRange[0] && dest.price <= priceRange[1];
//       return matchesType && matchesCategory && matchesPrice;
//     });

//     setFilteredDestinations(filtered);
//   }, [selectedCategory, priceRange, type]);

//   return (
//    <>
//          <Navbar />
         

//     <div className="min-h-screen bg-gray-50 py-16 px-4">
//       <div className="max-w-7xl mx-auto">
//         <h1 className="text-3xl font-bold text-gray-900 mb-8">
//           {type ? `${type.charAt(0).toUpperCase() + type.slice(1)} Destinations` : 'Destinations'}
//         </h1>
        

//         {/* Filters */}
//         <div className="bg-white p-6 rounded-lg shadow-md mb-8">
//           <div className="flex flex-wrap gap-4 mb-6">
            
//             {categories.map((category) => (
//               <button
//                 key={category}
//                 onClick={() => setSelectedCategory(category)}
//                 className={`px-4 py-2 rounded-full ${
//                   selectedCategory === category
//                     ? 'bg-purple-600 text-white'
//                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                 }`}
//               >
//                 {category}
//               </button>
//             ))}
//           </div>

//           <div className="w-full max-w-md">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Price Range (${priceRange[0]} - ${priceRange[1]})
//             </label>
//             <input
//               type="range"
//               min="0"
//               max="5000"
//               step="100"
//               value={priceRange[1]}
//               onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
//               className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
//             />
//           </div>
//         </div>

//         {/* Destinations Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredDestinations.length > 0 ? (
//             filteredDestinations.map((destination) => (
//               <div
//                 key={destination.id}
//                 className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
//               >
//                 <img
//                   src={destination.image}
//                   alt={destination.name}
//                   className="h-48 w-full object-cover"
//                 />
//                 <div className="p-6">
//                   <h3 className="text-xl font-semibold text-gray-900 mb-2">
//                     {destination.name}
//                   </h3>
//                   <p className="text-gray-600 mb-4">{destination.description}</p>
//                   <div className="flex items-center justify-between">
//                     <span className="text-purple-600 font-semibold">
//                       ${destination.price}
//                     </span>
//                     <button
//                       onClick={() => navigate(`/packages/${destination.id}`)}
//                       className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
//                     >
//                       View Packages
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="col-span-full text-center py-12">
//               <p className="text-gray-600 text-lg">No destinations found matching your criteria.</p>
//               <button 
//                 onClick={() => {
//                   setSelectedCategory('All');
//                   setPriceRange([0, 5000]);
//                 }}
//                 className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
//               >
//                 Reset Filters
//               </button>
//             </div>
//           )}
//         </div>
        
//         <button
//             onClick={() => navigate(-1)}
//             className="mt-10 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
//           >
//             ← Back
//           </button>


//       </div>
      
//     </div>
//     <Footer />
//     </>
//   );
// };

// export default Domestic;


import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import axios from 'axios';
import BASE_URL from '@/utils/baseUrl';

interface Package {
  _id: string;
  packageName: string;
  packageType: string;
  destinations: { city: string; region: string; country: string }[];
  duration: { days: number; nights: number };
  price: { amount: number };
  images?: { thumbnail?: string };
  shortDescription: string;
}

const Domestic = () => {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [packages, setPackages] = useState<Package[]>([]);

  const categories = ['All', 'Student', 'Adventure', 'Honeymoon', 'Family', 'Solo', 'Group', 'Corporate'];

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const selectedType = type === 'international' ? 'international' : 'domestic';

        console.log('Fetching:', {
          type: selectedType,  // Should log 'domestic' or 'international'
          priceRange: `${priceRange[0]}:${priceRange[1]}`
        });

        const response = await axios.get(`${BASE_URL}/api/packages`, {
      params: {
        packageType: selectedType,  // Explicit value
        price: `${priceRange[0]}:${priceRange[1]}`
      }
    });

    console.log('Received:', {
      response
    });

    setPackages(response.data.data);

  } catch (error) {
    console.error('Request failed:', {
      url: error.config?.url,
      params: error.config?.params,
      error: error.response?.data || error.message
    });
  }
};
fetchPackages(); 
}, [type, priceRange]);

  return (  
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            {type ? `${type.charAt(0).toUpperCase() + type.slice(1)} Packages` : 'Packages'}
          </h1>

          {/* Filters */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <div className="flex flex-wrap gap-4 mb-6">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full ${
                    selectedCategory === category
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="w-full max-w-md">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range (${priceRange[0]} - ${priceRange[1]})
              </label>
              <input
                type="range"
                min="0"
                max="5000"
                step="100"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Packages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.length > 0 ? (
              packages.map((pkg) => (
                <div
                  key={pkg._id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <img
                    src={pkg.images?.thumbnail || 'https://via.placeholder.com/400x250'}
                    alt={pkg.packageName}
                    className="h-48 w-full object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{pkg.packageName}</h3>
                    <p className="text-gray-600 mb-4">{pkg.shortDescription}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-purple-600 font-semibold">${pkg.price.amount}</span>
                      <button
                        onClick={() => navigate(`/packages/${pkg._id}`)}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600 text-lg">No packages found matching your criteria.</p>
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setPriceRange([0, 5000]);
                  }}
                  className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  Reset Filters
                </button>
              </div>
            )}
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
export default Domestic;
