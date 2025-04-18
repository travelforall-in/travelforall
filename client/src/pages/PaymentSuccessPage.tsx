
import { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { BookingDetails, Package } from '../types/travel';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface LocationState {
  bookingDetails: BookingDetails;
  packageDetails: Package;
  transactionId: string;
}

const PaymentSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Redirect if no state is passed
  useEffect(() => {
    if (!location.state) {
      navigate('/destinations');
    }
  }, [location.state, navigate]);

  if (!location.state) {
    return <div className="min-h-screen flex items-center justify-center">Redirecting...</div>;
  }

  const { bookingDetails, packageDetails, transactionId } = location.state as LocationState;

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gray-50 py-14 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="mb-8">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-12 w-12 text-green-600" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
          <p className="text-gray-600 mb-8">
            Thank you for booking with us. Your travel package has been confirmed.
          </p>
          
          <div className="mb-8 p-4 bg-gray-50 rounded-lg text-left">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Transaction ID:</span>
                <span className="font-mono">{transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Package:</span>
                <span>{packageDetails.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span>{packageDetails.duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Travelers:</span>
                <span>{bookingDetails.travelers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Travel Date:</span>
                <span>{new Date(bookingDetails.travelDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Booked by:</span>
                <span>{bookingDetails.name}</span>
              </div>
              <div className="flex justify-between text-lg font-bold mt-4 pt-4 border-t">
                <span>Total Amount:</span>
                <span className="text-purple-600">
                  ${packageDetails.price * bookingDetails.travelers}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <Link
              to="/"
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
            >
              Return to Home
            </Link>
            <button
              onClick={() => window.print()}
              className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
            >
              Print Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default PaymentSuccessPage;