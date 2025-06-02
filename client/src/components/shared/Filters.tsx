import React from "react";

type Props = {
  destination: string;
  sort: string;
  availableDestinations: string[];
  setDestination: (val: string) => void;
  setSort: (val: string) => void;
  resetFilters: () => void;
};

const Filters: React.FC<Props> = ({
  destination,
  sort,
  availableDestinations,
  setDestination,
  setSort,
  resetFilters,
}) => {
  return (
    <aside className="pt-20 w-full md:w-64 p-4 bg-white border-r border-gray-200 sticky top-20 h-screen overflow-y-auto">
      <h2 className="text-xl font-bold text-green-700 mb-4">Filters</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Destination
        </label>
        <select
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
        >
          <option value="">All Destinations</option>
          {availableDestinations.map((dest) => (
            <option key={dest} value={dest}>
              {dest}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Sort By
        </label>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
        >
          <option value="">Default</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="duration-asc">Duration: Short to Long</option>
          <option value="duration-desc">Duration: Long to Short</option>
        </select>
      </div>

      <button
        onClick={resetFilters}
        className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
      >
        Reset Filters
      </button>
    </aside>
  );
};

export default Filters;