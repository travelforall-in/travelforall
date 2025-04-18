import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Package, BookingDetails } from '../types/travel';
import { packages } from '../data/mockData';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const BookingPage = () => {
  const { packageId } = useParams<{ packageId: string }>();
  const navigate = useNavigate();
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({
    name: '',
    email: '',
    travelers: 1,
    travelDate: '',
    packageId: packageId || '',
  });

  const selectedPackage = packages.find(p => p.id === packageId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form validation
    if (!bookingDetails.name || !bookingDetails.email || !bookingDetails.travelDate) {
      alert('Please fill in all required fields');
      return;
    }

    // Proceed to payment
    navigate('/payment', { state: { bookingDetails, packageDetails: selectedPackage } });
  };

  if (!selectedPackage) {
    return <div>Package not found</div>;
  }

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gray-50 py-14 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Booking Details</h1>
          
          <div className="mb-8 p-4 bg-purple-50 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {selectedPackage.name}
            </h2>
            <p className="text-gray-600">{selectedPackage.duration}</p>
            <p className="text-purple-600 font-bold mt-2">
              ${selectedPackage.price}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name*
              </label>
              <input
                type="text"
                required
                value={bookingDetails.name}
                onChange={(e) => setBookingDetails({...bookingDetails, name: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address*
              </label>
              <input
                type="email"
                required
                value={bookingDetails.email}
                onChange={(e) => setBookingDetails({...bookingDetails, email: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Travelers
              </label>
              <input
                type="number"
                min="1"
                value={bookingDetails.travelers}
                onChange={(e) => setBookingDetails({...bookingDetails, travelers: parseInt(e.target.value)})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Travel Date*
              </label>
              <input
                type="date"
                required
                value={bookingDetails.travelDate}
                onChange={(e) => setBookingDetails({...bookingDetails, travelDate: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
            >
              Proceed to Payment
            </button>
          </form>
        </div>
        <button
            onClick={() => navigate(-1)}
            className="mt-10 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            ← Back
          </button>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default BookingPage;