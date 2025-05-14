import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const PaymentHistory = () => {
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/users/paymentHistory', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPaymentHistory(response.data.paymentHistory);
      } catch (error: any) {
        console.error('Payment History Error:', error);
        toast.error(error?.response?.data?.message || 'Failed to load payment history');
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentHistory();
  }, []);

  return (
    <>
      <Toaster position="top-right" />
      <Navbar />
      <div className="max-w-2xl mx-auto py-16 px-4 mt-24">
        <h2 className="text-3xl font-bold mb-8">Payment History</h2>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : paymentHistory.length === 0 ? (
          <p className="text-center">You have no payment history.</p>
        ) : (
          <div className="space-y-6">
            {paymentHistory.map((payment, index) => (
              <div key={index} className="p-6 border border-gray-200 rounded-2xl bg-white shadow-sm">
                <h3 className="text-xl font-semibold text-gray-800">Payment #{payment.id}</h3>
                <p className="text-gray-600 mb-2">Amount: ${payment.amount}</p>
                <p className="text-gray-600 mb-2">Date: {new Date(payment.date).toLocaleDateString()}</p>
                <p className="text-gray-600 mb-4">Status: {payment.status}</p>
                <Button onClick={() => { /* You can implement a detail view if needed */ }}>
                  View Details
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default PaymentHistory;
