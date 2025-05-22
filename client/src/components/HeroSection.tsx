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
            <Link to="/all-packages">
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
