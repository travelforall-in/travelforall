

// import { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { BookingDetails, Package } from '../types/travel';
// import { packages } from '../data/mockData';
// import { toast } from 'sonner';
// import Navbar from '@/components/Navbar';
// import Footer from '@/components/Footer';

// interface LocationState {
//   bookingDetails: BookingDetails;
//   packageDetails: Package;
// }

// const PaymentPage = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [isProcessing, setIsProcessing] = useState(false);
  
//   // Initialize with default values if no state is passed
//   const [bookingData, setBookingData] = useState<BookingDetails | null>(null);
//   const [packageData, setPackageData] = useState<Package | null>(null);

//   // Update state when location state is available
//   useEffect(() => {
//     if (location.state) {
//       const { bookingDetails, packageDetails } = location.state as LocationState;
//       setBookingData(bookingDetails);
//       setPackageData(packageDetails);
//     } else {
//       // Show message and redirect if accessed directly
//       toast.error("Please complete booking details first");
//       navigate('/destinations');
//     }
//   }, [location.state, navigate]);

//   const [cardDetails, setCardDetails] = useState({
//     cardNumber: '',
//     expiryDate: '',
//     cvv: '',
//     name: ''
//   });

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!bookingData || !packageData) {
//       toast.error("Missing booking information");
//       return;
//     }
    
//     setIsProcessing(true);

//     // Simulate payment processing
//     await new Promise(resolve => setTimeout(resolve, 2000));

//     // Simulate successful payment
//     navigate('/payment-success', {
//       state: {
//         bookingDetails: bookingData,
//         packageDetails: packageData,
//         transactionId: Math.random().toString(36).substring(2, 15),
//       }
//     });
//   };

//   // Show loading or redirect if no data is available
//   if (!bookingData || !packageData) {
//     return <div className="min-h-screen flex items-center justify-center">Redirecting...</div>;
//   }

//   return (
//     <>
//     <Navbar />
//     <div className="min-h-screen bg-gray-50 py-14 px-4">
//       <div className="max-w-3xl mx-auto">
//         <div className="bg-white rounded-xl shadow-lg p-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-8">Payment Details</h1>

//           <div className="mb-8 p-4 bg-gray-50 rounded-lg">
//             <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
//             <div className="space-y-2">
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Package:</span>
//                 <span className="font-semibold">{packageData.name}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Duration:</span>
//                 <span>{packageData.duration}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Travelers:</span>
//                 <span>{bookingData.travelers}</span>
//               </div>
//               <div className="flex justify-between text-lg font-bold mt-4 pt-4 border-t">
//                 <span>Total Amount:</span>
//                 <span className="text-purple-600">
//                   ${packageData.price * bookingData.travelers}
//                 </span>
//               </div>
//             </div>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Card Number
//               </label>
//               <input
//                 type="text"
//                 placeholder="1234 5678 9012 3456"
//                 value={cardDetails.cardNumber}
//                 onChange={(e) => setCardDetails({...cardDetails, cardNumber: e.target.value})}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                 required
//               />
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Expiry Date
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="MM/YY"
//                   value={cardDetails.expiryDate}
//                   onChange={(e) => setCardDetails({...cardDetails, expiryDate: e.target.value})}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   CVV
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="123"
//                   value={cardDetails.cvv}
//                   onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                   required
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Cardholder Name
//               </label>
//               <input
//                 type="text"
//                 value={cardDetails.name}
//                 onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                 required
//               />
//             </div>

//             <button
//               type="submit"
//               disabled={isProcessing}
//               className={`w-full ${
//                 isProcessing ? 'bg-purple-400' : 'bg-purple-600 hover:bg-purple-700'
//               } text-white py-3 rounded-lg transition-colors font-semibold flex items-center justify-center`}
//             >
//               {isProcessing ? (
//                 <>
//                   <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   Processing...
//                 </>
//               ) : (
//                 'Complete Payment'
//               )}
//             </button>
//           </form>
//         </div>
//       </div>
//       <button
//             onClick={() => navigate(-1)}
//             className="mt-10 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
//           >
//             ← Back
//           </button>
//     </div>
//     <Footer />
//     </>
//   );
// };

// export default PaymentPage;


import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { BookingDetails, Package } from '../types/travel';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { bookingDetails, packageDetails } = location.state || {};

  useEffect(() => {
    if (!bookingDetails || !packageDetails) {
      navigate('/');
    }
  }, [bookingDetails, packageDetails, navigate]);

  if (!bookingDetails || !packageDetails) return null;

  const totalPrice = packageDetails.price.amount * bookingDetails.travelers;

  const handlePayment = () => {
    // Payment logic goes here (e.g., redirect to gateway or mock confirm)
    alert('Payment Successful!');
    navigate('/confirmation', { state: { bookingDetails, packageDetails } });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Confirm & Pay</h1>

          {/* Booking Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Traveler Details</h2>
              <p><strong>Name:</strong> {bookingDetails.name}</p>
              <p><strong>Email:</strong> {bookingDetails.email}</p>
              <p><strong>Travel Date:</strong> {bookingDetails.travelDate}</p>
              <p><strong>Travelers:</strong> {bookingDetails.travelers}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Package Summary</h2>
              <div className="mb-4">
                <img src={packageDetails.images.image} alt={packageDetails.packageName} className="w-full h-48 object-cover rounded-lg" />
              </div>
              <p className="font-semibold text-lg">{packageDetails.packageName}</p>
              <p className="text-sm text-gray-600 mb-2">
                {packageDetails.duration.days} Days / {packageDetails.duration.nights} Nights
              </p>
              <p className="text-gray-700">
                Price per person: {packageDetails.price.currency}{packageDetails.price.amount}
              </p>
              <p className="font-semibold mt-2">
                Total: {packageDetails.price.currency}{totalPrice}
              </p>
            </div>
          </div>

          {/* Payment Options */}
          <div className="mt-10 border-t pt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment Method</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <input type="radio" name="payment" defaultChecked className="mr-3" />
                <label>Credit / Debit Card</label>
              </div>
              <div className="flex items-center">
                <input type="radio" name="payment" className="mr-3" />
                <label>UPI / QR Code</label>
              </div>
              <div className="flex items-center">
                <input type="radio" name="payment" className="mr-3" />
                <label>Net Banking</label>
              </div>
            </div>

            <button
              onClick={handlePayment}
              className="mt-8 w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition"
            >
              Pay {packageDetails.price.currency}{totalPrice}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PaymentPage;
