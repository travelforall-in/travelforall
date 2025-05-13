import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Destination, CategoryFilter } from '../types/travel';
import { destinations } from '../data/mockData';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';

const Domestic = () => {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [filteredDestinations, setFilteredDestinations] = useState<Destination[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]); // Favorite destination IDs

  const categories: CategoryFilter[] = ['All', 'Adventure', 'Honeymoon', 'Family', 'Solo', 'Group', 'Corporate'];

  useEffect(() => {
    const filtered = destinations.filter((dest) => {
      const matchesType = dest.type?.toLowerCase() === type?.toLowerCase();
      const matchesCategory = selectedCategory === 'All' || dest.category?.toLowerCase() === selectedCategory.toLowerCase();
      const matchesPrice = dest.price >= priceRange[0] && dest.price <= priceRange[1];
      return matchesType && matchesCategory && matchesPrice;
    });

    setFilteredDestinations(filtered);
  }, [selectedCategory, priceRange, type]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            {type ? `${type.charAt(0).toUpperCase() + type.slice(1)} Destinations` : 'Destinations'}
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

          {/* Destinations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDestinations.length > 0 ? (
              filteredDestinations.map((destination) => (
                <div
                  key={destination.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="h-48 w-full object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {destination.name}
                    </h3>
                    <p className="text-gray-600 mb-4">{destination.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-purple-600 font-semibold">
                        ${destination.price}
                      </span>
                      <div className="flex gap-2 items-center">
                        <button onClick={() => toggleFavorite(destination.id)} className="focus:outline-none">
                          {favorites.includes(destination.id) ? (
                            <HeartSolid className="h-6 w-6 text-red-500" />
                          ) : (
                            <HeartOutline className="h-6 w-6 text-gray-400 hover:text-red-400" />
                          )}
                        </button>
                        <button
                          onClick={() => navigate(`/packages/${destination.id}`)}
                          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          View Packages
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600 text-lg">No destinations found matching your criteria.</p>
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
