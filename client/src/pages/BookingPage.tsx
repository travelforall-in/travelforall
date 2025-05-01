import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Package, BookingDetails, TravelerInfo } from '../types/travel';

const BookingPage = () => {
  const { packageId } = useParams<{ packageId: string }>();
  const navigate = useNavigate();

  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({
    name: '',
    email: '',
    travelDate: '',
    travelers: 1,
    packageId: packageId || '',
    travelerInfo: [{ name: '', age: '', gender: '', type: 'Adult' }],
  });

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const res = await axios.get(`/api/packages/${packageId}`);
        setSelectedPackage(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching package:', err);
        setError('Package not found or an error occurred');
        setLoading(false);
      }
    };

    if (packageId) fetchPackage();
  }, [packageId]);

  const handleTravelerCountChange = (count: number) => {
    setBookingDetails((prev) => ({
      ...prev,
      travelers: count,
      travelerInfo: Array.from({ length: count }, (_, i) => prev.travelerInfo[i] || {
        name: '',
        age: '',
        gender: '',
        type: 'Adult',
      }),
    }));
  };

  const handleTravelerChange = (index: number, field: keyof TravelerInfo, value: string) => {
    const updated = [...bookingDetails.travelerInfo];
    updated[index] = { ...updated[index], [field]: value };
    setBookingDetails({ ...bookingDetails, travelerInfo: updated });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingDetails.name || !bookingDetails.email || !bookingDetails.travelDate) {
      alert('Please fill in all required fields');
      return;
    }

    navigate('/payment', { state: { bookingDetails, packageDetails: selectedPackage } });
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error || !selectedPackage) return <div className="text-center py-10 text-red-600">{error}</div>;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-14 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Booking for: {selectedPackage.name}</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Your Name*</label>
                <input
                  type="text"
                  required
                  value={bookingDetails.name}
                  onChange={(e) => setBookingDetails({ ...bookingDetails, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email Address*</label>
                <input
                  type="email"
                  required
                  value={bookingDetails.email}
                  onChange={(e) => setBookingDetails({ ...bookingDetails, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            {/* Travel Date */}
            <div>
              <label className="block text-sm font-medium mb-2">Travel Date*</label>
              <input
                type="date"
                required
                value={bookingDetails.travelDate}
                onChange={(e) => setBookingDetails({ ...bookingDetails, travelDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            {/* Number of Travelers */}
            <div>
              <label className="block text-sm font-medium mb-2">Number of Travelers*</label>
              <input
                type="number"
                min={1}
                value={bookingDetails.travelers}
                onChange={(e) => handleTravelerCountChange(Number(e.target.value))}
                className="w-28 px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            {/* Traveler Info */}
            {bookingDetails.travelerInfo.map((traveler, index) => (
              <div key={index} className="border rounded-lg p-4 bg-gray-50">
                <h3 className="text-md font-semibold mb-4">Traveler {index + 1}</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={traveler.name}
                    onChange={(e) => handleTravelerChange(index, 'name', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Age"
                    value={traveler.age}
                    onChange={(e) => handleTravelerChange(index, 'age', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                  <select
                    value={traveler.gender}
                    onChange={(e) => handleTravelerChange(index, 'gender', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  <select
                    value={traveler.type}
                    onChange={(e) => handleTravelerChange(index, 'type', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="Adult">Adult</option>
                    <option value="Child">Child</option>
                    <option value="Infant">Infant</option>
                  </select>
                </div>
              </div>
            ))}

            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition"
            >
              Proceed to Payment
            </button>
          </form>

          <button
            onClick={() => navigate(-1)}
            className="mt-6 px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
          >
            ← Back
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BookingPage;

