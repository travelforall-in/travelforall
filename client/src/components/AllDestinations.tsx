// import React from 'react';
// import { Star } from 'lucide-react';
// import { Link } from 'react-router-dom';
// import { getHomePath } from '@/utils/getHomePath';

// const destinations = [
//   {
//     id: 1,
//     name: 'Bali, Indonesia',
//     image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=2938&q=80',
//     rating: 4.8,
//     reviews: 356,
//     price: 1299,
//   },
//   {
//     id: 2,
//     name: 'Santorini, Greece',
//     image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=3474&q=80',
//     rating: 4.9,
//     reviews: 423,
//     price: 1599,
//   },
//   {
//     id: 3,
//     name: 'Kyoto, Japan',
//     image: 'https://images.unsplash.com/photo-1624253321171-1be53e12e5fd?auto=format&fit=crop&w=3474&q=80',
//     rating: 4.7,
//     reviews: 289,
//     price: 1499,
//   },
//   {
//     id: 4,
//     name: 'Machu Picchu, Peru',
//     image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=3270&q=80',
//     rating: 4.9,
//     reviews: 512,
//     price: 1799,
//   },
//   {
//     id: 5,
//     name: 'Paris, France',
//     image: 'https://images.unsplash.com/photo-1543342386-1a8f86c0460f?auto=format&fit=crop&w=1950&q=80',
//     rating: 4.8,
//     reviews: 678,
//     price: 1699,
//   },
//   {
//     id: 6,
//     name: 'Rome, Italy',
//     image: 'https://images.unsplash.com/photo-1506617420156-8e4536971650?auto=format&fit=crop&w=1950&q=80',
//     rating: 4.6,
//     reviews: 432,
//     price: 1399,
//   },
//   {
//     id: 7,
//     name: 'Cappadocia, Turkey',
//     image: 'https://images.unsplash.com/photo-1519046904884-53102df1f142?auto=format&fit=crop&w=1950&q=80',
//     rating: 4.9,
//     reviews: 310,
//     price: 1499,
//   },
//   {
//     id: 8,
//     name: 'Queenstown, New Zealand',
//     image: 'https://images.unsplash.com/photo-1502786129293-79981df4e689?auto=format&fit=crop&w=1950&q=80',
//     rating: 4.8,
//     reviews: 275,
//     price: 1799,
//   },
//   {
//     id: 9,
//     name: 'Banff, Canada',
//     image: 'https://images.unsplash.com/photo-1508264165352-258a6ec08f87?auto=format&fit=crop&w=1950&q=80',
//     rating: 4.9,
//     reviews: 320,
//     price: 1550,
//   },
//   {
//     id: 10,
//     name: 'Barcelona, Spain',
//     image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbe9?auto=format&fit=crop&w=1950&q=80',
//     rating: 4.7,
//     reviews: 412,
//     price: 1449,
//   },
//   // {
//   //   id: 11,
//   //   name: 'Dubai, UAE',
//   //   image: 'https://images.unsplash.com/photo-1602929136313-0793f48dbee8?auto=format&fit=crop&w=1950&q=80',
//   //   rating: 4.6,
//   //   reviews: 489,
//   //   price: 1999,
//   // },
//   // {
//   //   id: 12,
//   //   name: 'Reykjavík, Iceland',
//   //   image: 'https://images.unsplash.com/photo-1586796878190-3158dcf8322e?auto=format&fit=crop&w=1950&q=80',
//   //   rating: 4.9,
//   //   reviews: 344,
//   //   price: 1899,
//   // },
//   // {
//   //   id: 13,
//   //   name: 'New York City, USA',
//   //   image: 'https://images.unsplash.com/photo-1533106418989-88406c7cfd1b?auto=format&fit=crop&w=1950&q=80',
//   //   rating: 4.7,
//   //   reviews: 850,
//   //   price: 1599,
//   // },
//   // {
//   //   id: 14,
//   //   name: 'Sydney, Australia',
//   //   image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d7?auto=format&fit=crop&w=1950&q=80',
//   //   rating: 4.8,
//   //   reviews: 478,
//   //   price: 1890,
//   // },
//   // {
//   //   id: 15,
//   //   name: 'Petra, Jordan',
//   //   image: 'https://images.unsplash.com/photo-1581118480243-e2fb01c5d4a0?auto=format&fit=crop&w=1950&q=80',
//   //   rating: 4.9,
//   //   reviews: 256,
//   //   price: 1620,
//   // },
//   // {
//   //   id: 16,
//   //   name: 'Zermatt, Switzerland',
//   //   image: 'https://images.unsplash.com/photo-1583142305729-76c2dbafc97f?auto=format&fit=crop&w=1950&q=80',
//   //   rating: 4.8,
//   //   reviews: 390,
//   //   price: 2100,
//   // },
//   // {
//   //   id: 17,
//   //   name: 'Hanoi, Vietnam',
//   //   image: 'https://images.unsplash.com/photo-1553524789-7241bb691973?auto=format&fit=crop&w=1950&q=80',
//   //   rating: 4.6,
//   //   reviews: 284,
//   //   price: 1320,
//   // },
//   // {
//   //   id: 18,
//   //   name: 'Cape Town, South Africa',
//   //   image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1950&q=80',
//   //   rating: 4.7,
//   //   reviews: 388,
//   //   price: 1495,
//   // },
//   // {
//   //   id: 19,
//   //   name: 'Amsterdam, Netherlands',
//   //   image: 'https://images.unsplash.com/photo-1503152394-98b6f43f08dd?auto=format&fit=crop&w=1950&q=80',
//   //   rating: 4.8,
//   //   reviews: 410,
//   //   price: 1380,
//   // },
//   // {
//   //   id: 20,
//   //   name: 'Prague, Czech Republic',
//   //   image: 'https://images.unsplash.com/photo-1526655009434-6b4e04f9d160?auto=format&fit=crop&w=1950&q=80',
//   //   rating: 4.9,
//   //   reviews: 390,
//   //   price: 1400,
//   // },
// ];
// const AllDestinations = () => {
//   return (
//     <section className="py-16 bg-white">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center mb-10">
//           <h2 className="text-3xl font-bold text-gray-900">All Destinations</h2>
//           <Link
//             to={getHomePath()}
//             className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow"
//           >
//             Back to Home
//           </Link>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           {destinations.map((destination) => (
//             <Link
//               to={`/destination/${destination.id}`}
//               key={destination.id}
//               className="group block rounded-xl overflow-hidden shadow-md bg-white"
//             >
//               <div className="relative h-64 overflow-hidden">
//                 <img
//                   src={destination.image}
//                   alt={destination.name}
//                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
//                 <div className="absolute bottom-0 left-0 right-0 p-4">
//                   <h3 className="text-xl font-semibold text-white">{destination.name}</h3>
//                   <div className="flex items-center mt-2">
//                     <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
//                     <span className="ml-1 text-white text-sm">{destination.rating}</span>
//                     <span className="ml-1 text-white/80 text-sm">({destination.reviews} reviews)</span>
//                   </div>
//                 </div>
//               </div>
//               <div className="p-4">
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-600">7 days tour</span>
//                   <div className="text-lg font-bold text-primary">${destination.price}</div>
//                 </div>
//               </div>
//             </Link>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default AllDestinations;

// AllDestinations.tsx
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const AllDestinations = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-50 to-white px-4 pt-20">
        <div className="max-w-4xl mx-auto text-center flex-grow">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Where would you like to travel?
          </h1>
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <button
              onClick={() => navigate('/destinations/domestic')}
              className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Domestic</h2>
              <p className="text-gray-600 mb-4">Explore the wonders within our borders</p>
              <span className="text-orange-400 group-hover:text-orange-600 transition-colors">
                View Destinations →
              </span>
            </button>

            <button
              onClick={() => navigate('/destinations/international')}
              className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">International</h2>
              <p className="text-gray-600 mb-4">Discover amazing places around the world</p>
              <span className="text-orange-400 group-hover:text-orange-600 transition-colors">
                View Destinations →
              </span>
            </button>
          </div>

          <button
            onClick={() => navigate('/')}
            className="mt-10 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            ← Back to Home
          </button>
        </div>
        <br />
        <Footer />
      </div>
    </>
  );
};

export default AllDestinations;
