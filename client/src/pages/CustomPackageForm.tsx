import { useState } from 'react';
import axios from 'axios';
import BASE_URL from '@/utils/baseUrl';
import { useNavigate } from 'react-router-dom';

const mealOptions = ['Vegetarian', 'Non-Vegetarian', 'others'];
const activityOptions = ['Sightseeing', 'Adventure Sports', 'Cultural Tours'];

const CustomPackageForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    destination: '',
    startDate: '',
    endDate: '',
    accommodationType: '',
    accommodationRating: '',
    transportationFlights: false,
    transportationClass: '',
    transportationLocal: '',
    mealsIncluded: false,
    mealPreferences: [] as string[],
    activities: [] as string[],
    budget: 1000,
    adults: '',
    children: '',
    infants: '',
    specialRequests: ''
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('')
  const nevigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox' && (name === 'mealsIncluded' || name === 'transportationFlights')) {
      setFormData({ ...formData, [name]: checked });
    } else if (type === 'number' || type === 'range') {
      setFormData({ ...formData, [name]: Number(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    if (checked) {
      setFormData(prev => ({
        ...prev,
        [name]: [...prev[name], value]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: prev[name].filter((item: string) => item !== value)
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      destination: formData.destination,
      startDate: formData.startDate,
      endDate: formData.endDate,
      accommodation: {
        type: formData.accommodationType,
        preferredRating: Number(formData.accommodationRating),
        requirements: []
      },
      transportation: {
        flights: {
          required: formData.transportationFlights,
          preferredClass: formData.transportationClass
        },
        localTransport: formData.transportationLocal
      },
      meals: {
        included: formData.mealsIncluded,
        preferences: formData.mealPreferences
      },
      activities: formData.activities,
      budget: Number(formData.budget),
      travelers: {
        adults: Number(formData.adults),
        children: Number(formData.children),
        infants: Number(formData.infants)
      },
      specialRequests: formData.specialRequests
    };

    try {
      const response = await axios.post(`${BASE_URL}/custom-packages`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setMessage('Package submitted successfully!');
      nevigate('/custom-packages');
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error submitting package');
      setMessage('');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Create Custom Package</h2>

      {message && <p className="text-green-600 mb-4">{message}</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Basic Info */}
        <label>
          Name
          <input
            className="border p-2 rounded w-full"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Destination
          <select
            name="destination"
            className="border p-2 rounded w-full"
            value={formData.destination}
            onChange={handleChange}
            required
          >
            <option value="">Select Destination</option>
            <option value="domestic">Domestic</option>
            <option value="international">International</option>
          </select>
        </label>

        <label>
          Start Date
          <input
            className="border p-2 rounded w-full"
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          End Date
          <input
            className="border p-2 rounded w-full"
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
          />
        </label>

        {/* Accommodation */}
        <label>
          Accommodation Type
          <select
            name="accommodationType"
            className="border p-2 rounded w-full"
            value={formData.accommodationType}
            onChange={handleChange}
            required
          >
            <option value="">Select Type</option>
            <option value="hotel">Hotel</option>
            <option value="resort">Resort</option>
            <option value="hostel">Hostel</option>
            <option value="guesthouse">Guesthouse</option>
            <option value="apartment">Apartment</option>
          </select>
        </label>

        <label>
          Accommodation Rating
          <select
            name="accommodationRating"
            className="border p-2 rounded w-full"
            value={formData.accommodationRating}
            onChange={handleChange}
            required
          >
            <option value="">Rating</option>
            {[1, 2, 3, 4, 5].map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </label>

        {/* Transportation */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="transportationFlights"
            checked={formData.transportationFlights}
            onChange={handleChange}
          />
          Need Flights?
        </label>

        <label>
          Flight Class
          <select
            name="transportationClass"
            className="border p-2 rounded w-full"
            value={formData.transportationClass}
            onChange={handleChange}
          >
            <option value="">Flight Class</option>
            <option value="economy">Economy</option>
            <option value="premium_economy">Premium Economy</option>
            <option value="business">Business</option>
            <option value="first">First</option>
          </select>
        </label>

        <label>
          Local Transport
          <select
            name="transportationLocal"
            className="border p-2 rounded w-full"
            value={formData.transportationLocal}
            onChange={handleChange}
          >
            <option value="">Local Transport</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="rental">Rental</option>
          </select>
        </label>

        {/* Meals */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="mealsIncluded"
            checked={formData.mealsIncluded}
            onChange={handleChange}
          />
          Meals Included?
        </label>

        {formData.mealsIncluded && (
          <fieldset className="mb-4 col-span-1 md:col-span-2">
            <legend className="font-semibold mb-2">Select Meal Preferences</legend>
            {mealOptions.map(option => (
              <label key={option} className="inline-flex items-center mr-4">
                <input
                  type="checkbox"
                  name="mealPreferences"
                  value={option}
                  checked={formData.mealPreferences.includes(option)}
                  onChange={handleCheckboxChange}
                />
                <span className="ml-1">{option}</span>
              </label>
            ))}
          </fieldset>
        )}

        {/* Activities */}
        <fieldset className="mb-4 col-span-1 md:col-span-2">
          <legend className="font-semibold mb-2">Preferred Activities</legend>
          {activityOptions.map(option => (
            <label key={option} className="inline-flex items-center mr-4">
              <input
                type="checkbox"
                name="activities"
                value={option}
                checked={formData.activities.includes(option)}
                onChange={handleCheckboxChange}
              />
              <span className="ml-1">{option}</span>
            </label>
          ))}
        </fieldset>

        {/* Budget */}
        <label className="col-span-1 md:col-span-2">
          Budget (₹)
          <input
            type="range"
            name="budget"
            min="1000"
            max="20000"
            step="500"
            value={formData.budget}
            onChange={handleChange}
            className="w-full"
          />
          <div className="text-sm text-gray-700 mt-1">Selected: ₹{formData.budget}</div>
        </label>

        {/* Travelers */}
        <label>
          Adults
          <input
            className="border p-2 rounded w-full"
            type="number"
            name="adults"
            min="0"
            value={formData.adults}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Children
          <input
            className="border p-2 rounded w-full"
            type="number"
            name="children"
            min="0"
            value={formData.children}
            onChange={handleChange}
          />
        </label>

        <label>
          Infants
          <input
            className="border p-2 rounded w-full"
            type="number"
            name="infants"
            min="0"
            value={formData.infants}
            onChange={handleChange}
          />
        </label>

        {/* Special Requests */}
        <label className="col-span-1 md:col-span-2">
          Special Requests
          <textarea
            className="border p-2 rounded w-full"
            name="specialRequests"
            rows={4}
            value={formData.specialRequests}
            onChange={handleChange}
          />
        </label>

        <button
          type="submit"
          className="col-span-1 md:col-span-2 bg-orange-600 text-white py-3 rounded hover:bg-orange-700 transition"
        >
          Submit Package
        </button>
      </form>
    </div>
  );
};

export default CustomPackageForm;
