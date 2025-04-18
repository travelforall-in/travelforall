
// import React from 'react';
// import { Link } from 'react-router-dom';
// import { Clock, MapPin, User, Star, ArrowRight } from 'lucide-react';

// const packages = [
//   {
//     id: 1,
//     name: 'Tropical Paradise: Bali Explorer',
//     location: 'Bali, Indonesia',
//     duration: '8 days',
//     groupSize: '12 people max',
//     image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2938&q=80',
//     rating: 4.8,
//     reviews: 127,
//     price: 1499,
//     description: 'Experience the best of Bali with our all-inclusive package. Explore pristine beaches, ancient temples, and vibrant culture.',
//     featured: true,
//   },
//   {
//     id: 2,
//     name: 'Mediterranean Dream: Greek Island Hopping',
//     location: 'Greek Islands',
//     duration: '10 days',
//     groupSize: '10 people max',
//     image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=3474&q=80',
//     rating: 4.9,
//     reviews: 214,
//     price: 2299,
//     description: 'Hop between the stunning Greek islands and experience breathtaking sunsets, crystal waters, and authentic cuisine.',
//     featured: true,
//   },
//   {
//     id: 3,
//     name: 'Japanese Culture & Heritage Tour',
//     location: 'Tokyo, Kyoto, Osaka',
//     duration: '12 days',
//     groupSize: '15 people max',
//     image: 'https://images.unsplash.com/photo-1624253321171-1be53e12e5fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=3474&q=80',
//     rating: 4.7,
//     reviews: 176,
//     price: 2799,
//     description: "Immerse yourself in Japanese culture, history, and cuisine with this comprehensive tour of Japan's top cities.",
//     featured: true,
//   }
// ];

// const PopularPackages = () => {
//   return (
//     <section className="py-16">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
//           <div>
//             <h2 className="text-3xl font-bold text-gray-900 mb-3">Popular Packages</h2>
//             <p className="text-gray-600 max-w-2xl">
//               Our most loved travel experiences, curated for unforgettable adventures.
//             </p>
//           </div>
//           <Link to="/packages" className="mt-4 md:mt-0 inline-flex items-center text-primary hover:text-primary/80 font-medium">
//             View all packages
//             <ArrowRight className="ml-2 h-4 w-4" />
//           </Link>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {packages.map((pkg) => (
//             <div key={pkg.id} className="bg-white rounded-xl shadow-md overflow-hidden card-hover">
//               <div className="relative">
//                 <img 
//                   src={pkg.image} 
//                   alt={pkg.name} 
//                   className="h-64 w-full object-cover"
//                 />
//                 {pkg.featured && (
//                   <div className="absolute top-4 right-4 bg-secondary/90 text-white text-xs font-bold px-3 py-1 rounded-full">
//                     Featured
//                   </div>
//                 )}
//               </div>

//               <div className="p-6">
//                 <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                
//                 <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
//                   <div className="flex items-center">
//                     <MapPin className="h-4 w-4 mr-1 text-primary" />
//                     {pkg.location}
//                   </div>
//                   <div className="flex items-center">
//                     <Clock className="h-4 w-4 mr-1 text-primary" />
//                     {pkg.duration}
//                   </div>
//                 </div>
                
//                 <p className="text-gray-600 mb-4 line-clamp-2">{pkg.description}</p>
                
//                 <div className="flex items-center justify-between mb-4">
//                   <div className="flex items-center">
//                     <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
//                     <span className="ml-1 text-sm font-semibold">{pkg.rating}</span>
//                     <span className="ml-1 text-sm text-gray-500">({pkg.reviews})</span>
//                   </div>
//                   <div className="flex items-center text-gray-600 text-sm">
//                     <User className="h-4 w-4 mr-1" />
//                     {pkg.groupSize}
//                   </div>
//                 </div>
                
//                 <div className="flex items-center justify-between pt-4 border-t border-gray-200">
//                   <div className="text-2xl font-bold text-primary">${pkg.price}</div>
//                   <Link 
//                     to={`/package/${pkg.id}`}
//                     className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary/90 transition"
//                   >
//                     View Details
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default PopularPackages;/

// src/components/PopularPackages.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, User, Star, ArrowRight } from 'lucide-react';
import { packages } from '../data/packages';

export const PackageCard = ({ pkg }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden card-hover transition-transform duration-300 hover:scale-[1.02]">
      <div className="relative">
        <img 
          src={pkg.image} 
          alt={pkg.name} 
          className="h-64 w-full object-cover"
          loading="lazy"
        />
        {pkg.featured && (
          <div className="absolute top-4 right-4 bg-secondary/90 text-white text-xs font-bold px-3 py-1 rounded-full">
            Featured
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
        
        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1 text-primary" />
            {pkg.location}
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1 text-primary" />
            {pkg.duration}
          </div>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-2">{pkg.description}</p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            <span className="ml-1 text-sm font-semibold">{pkg.rating}</span>
            <span className="ml-1 text-sm text-gray-500">({pkg.reviews})</span>
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <User className="h-4 w-4 mr-1" />
            {pkg.groupSize}
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="text-2xl font-bold text-primary">${pkg.price}</div>
          <Link 
            to={`/package/${pkg.id}`}
            className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary/90 transition"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

const PopularPackages = () => {
  // Get only featured packages for the homepage
  const featuredPackages = packages.filter(pkg => pkg.featured);

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Popular Packages</h2>
            <p className="text-gray-600 max-w-2xl">
              Our most loved travel experiences, curated for unforgettable adventures.
            </p>
          </div>
          <Link 
            to="/packages" 
            className="mt-4 md:mt-0 inline-flex items-center text-primary hover:text-primary/80 font-medium transition"
          >
            View all packages
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredPackages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularPackages;