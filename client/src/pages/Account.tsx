import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

const Account = () => {
  const navigate = useNavigate();
  const [currency, setCurrency] = useState('USD');

  const handleCurrencyChange = (value: string) => {
    setCurrency(value);
    localStorage.setItem('preferredCurrency', value);
  };

  return (
    <>
    <Navbar />
    <div className="max-w-6xl mx-auto py-16 px-6">
      <h1 className="text-4xl font-bold mb-10 text-gray-900">My Account</h1>

      <div className="mb-10">
        <label className="block text-lg font-medium text-gray-700 mb-2">Preferred Currency</label>
        <Select value={currency} onValueChange={handleCurrencyChange}>
          <SelectTrigger className="w-60">
            <SelectValue placeholder="Select currency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="USD">USD - US Dollar</SelectItem>
            <SelectItem value="EUR">EUR - Euro</SelectItem>
            <SelectItem value="INR">INR - Indian Rupee</SelectItem>
            <SelectItem value="GBP">GBP - British Pound</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="p-6 border border-gray-200 rounded-2xl bg-white shadow-sm hover:shadow transition">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">Profile Settings</h2>
          <p className="text-gray-600 mb-4 text-sm">Update your personal information and password.</p>
          <Button onClick={() => navigate('/account-settings')}>Manage</Button>
        </div>

        <div className="p-6 border border-gray-200 rounded-2xl bg-white shadow-sm hover:shadow transition">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">My Bookings</h2>
          <p className="text-gray-600 mb-4 text-sm">View all your current and past travel plans.</p>
          <Button onClick={() => navigate('/my-packages')}>View</Button>
        </div>

        <div className="p-6 border border-gray-200 rounded-2xl bg-white shadow-sm hover:shadow transition">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">Wishlist</h2>
          <p className="text-gray-600 mb-4 text-sm">Access your favorite destinations anytime.</p>
          <Button onClick={() => navigate('/wishlist')}>Open</Button>
        </div>

        <div className="p-6 border border-gray-200 rounded-2xl bg-white shadow-sm hover:shadow transition">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">Payment History</h2>
          <p className="text-gray-600 mb-4 text-sm">Review transactions and billing records.</p>
          <Button onClick={() => navigate('/payment-history')}>Check</Button>
        </div>

        <div className="p-6 border border-gray-200 rounded-2xl bg-white shadow-sm hover:shadow transition">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">Support</h2>
          <p className="text-gray-600 mb-4 text-sm">Need help? Reach out to our support team.</p>
          <Button onClick={() => navigate('/support')}>Contact</Button>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default Account;