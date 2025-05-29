import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '@/utils/baseUrl';

const UserCustomPackage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // <-- get the 'id' from URL params
  const [pkg, setPkg] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPackage = async () => {
      if (!id) return;
      try {
        const response = await axios.get(`${BASE_URL}/custom-packages/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setPkg(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load package');
      }
    };
    fetchPackage();
  }, [id]); // depends on `id`

  if (error) return <p className="text-red-600 text-center mt-10">{error}</p>;
  if (!pkg) return <p className="text-center mt-10">Loading package details...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded-lg">
      <h2 className="text-3xl font-bold mb-4 text-center">Custom Package Details</h2>

      <div className="space-y-2">
        <p><strong>Name:</strong> {pkg.name}</p>
        <p><strong>Destination:</strong> {pkg.destination}</p>
        <p><strong>Dates:</strong> {pkg.startDate} to {pkg.endDate}</p>
        <p><strong>Accommodation:</strong> {pkg.accommodation.type}, {pkg.accommodation.preferredRating}★</p>
        <p><strong>Flights:</strong> {pkg.transportation.flights.required ? 'Yes' : 'No'} ({pkg.transportation.flights.preferredClass})</p>
        <p><strong>Local Transport:</strong> {pkg.transportation.localTransport}</p>
        <p><strong>Meals:</strong> {pkg.meals.included ? `Yes (${pkg.meals.preferences.join(', ')})` : 'No'}</p>
        <p><strong>Activities:</strong> {pkg.activities.join(', ')}</p>
        <p><strong>Budget:</strong> ₹{pkg.budget}</p>
        <p><strong>Travelers:</strong> {pkg.travelers.adults} Adults, {pkg.travelers.children} Children, {pkg.travelers.infants} Infants</p>
        <p><strong>Special Requests:</strong> {pkg.specialRequests || 'None'}</p>
      </div>
    </div>
  );
};

export default UserCustomPackage;
