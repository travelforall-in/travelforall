import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import Card from '@/components/shared/Card';

const Account = () => {
  const navigate = useNavigate();
  const [currency, setCurrency] = useState('USD');

  const handleCurrencyChange = (value: string) => {
    setCurrency(value);
    localStorage.setItem('preferredCurrency', value);
  };
  const items = [
    {
      label: "Profile Settings",
      desc: "Update your personal information and password.",
      route: "/account-settings",
      btnName: "Manage"
    },
    {
      label: "My Bookings",
      desc: "View all your current and past travel plans.",
      route: "/my-packages",
      btnName: "View"
    },
    {
      label: "Wishlist",
      desc: "Access your favorite destinations anytime.",
      route: "/wishlist",
      btnName: "Open"
    },
    {
      label: "Payment History",
      desc: "Review transactions and billing records.",
      route: "/payment-history",
      btnName: "Check"
    },
    {
      label: "Support",
      desc: "Need help? Reach out to our support team.",
      route: "/support",
      btnName: "Contact"
    }
  ];
  

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

     <Card items={items}/>
    </div>
    
    </>
  );
};

export default Account;