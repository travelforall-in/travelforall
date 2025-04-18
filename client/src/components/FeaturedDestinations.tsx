import React from 'react';
import { ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import AllDestinations from './AllDestinations';

const destinations = [
  {
    id: 1,
    name: 'Delhi',
    image: 'https://images.unsplash.com/photo-1594455615933-c19828af39b8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGRlbGhpfGVufDB8fDB8fHww',
    rating: 4.8,
    reviews: 356,
    price: 1299,
  },
  {
    id: 2,
    name: 'Mumbai, Maharashtra',
    image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bXVtYmFpfGVufDB8fDB8fHww',
    rating: 4.9,
    reviews: 423,
    price: 1599,
  },
  {
    id: 3,
    name: 'Indore, Madhya Pradesh',
    image: 'https://plus.unsplash.com/premium_photo-1697730395452-e90ac9269968?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW5kb3JlfGVufDB8fDB8fHww',
    rating: 4.7,
    reviews: 289,
    price: 1499,
  },
  {
    id: 4,
    name: 'Lonavala, Maharashtra',
    image: 'https://images.unsplash.com/photo-1689172324767-f180880ccdec?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    rating: 4.9,
    reviews: 512,
    price: 1799,
  },
];

const FeaturedDestinations = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Featured Destinations</h2>
            <p className="text-gray-600 max-w-2xl">
              Explore our handpicked selection of the most breathtaking destinations around the world.
            </p>
          </div>
          <Link to="/destinations" className="mt-4 md:mt-0 inline-flex items-center text-primary hover:text-primary/80 font-medium">
            View all destinations
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((destination) => (
            <Link 
              to={`/destination/${destination.id}`} 
              key={destination.id}
              className="group block rounded-xl overflow-hidden shadow-md card-hover bg-white"
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={destination.image} 
                  alt={destination.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-xl font-semibold text-white">{destination.name}</h3>
                  <div className="flex items-center mt-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="ml-1 text-white text-sm">{destination.rating}</span>
                    <span className="ml-1 text-white/80 text-sm">({destination.reviews} reviews)</span>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">7 days tour</span>
                  <div className="text-lg font-bold text-primary">${destination.price}</div>
                </div>
                <button className="mt-3 w-full py-2 bg-secondary text-white rounded-md hover:bg-secondary/90 transition">
                  View Details
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedDestinations;
