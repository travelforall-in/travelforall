import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const AccountSettings = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [initialName, setInitialName] = useState('');
  const [initialEmail, setInitialEmail] = useState('');
  const [initialPhone, setInitialPhone] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const user = response.data.data;
        const fullName = user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim();

        setName(fullName);
        setEmail(user.email || '');
        setPhone(user.phone || '');

        setInitialName(fullName);
        setInitialEmail(user.email || '');
        setInitialPhone(user.phone || '');
      } catch (error: any) {
        console.error('Failed to fetch user data:', error);
        toast.error(error?.response?.data?.message || 'Failed to load user data.');
      }
    };

    fetchUser();
  }, []);

  const handleSave = async () => {
    if (name === initialName && email === initialEmail && phone === initialPhone) {
      toast('No changes to save.');
      return;
    }

    try {
      const token = localStorage.getItem('token');

      const response = await axios.put(
        'http://localhost:5000/api/users/profile',
        {
          name,
          email,
          phone,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success('Account settings updated successfully!');
      setInitialName(name);
      setInitialEmail(email);
      setInitialPhone(phone);
    } catch (error: any) {
      console.error('Update failed:', error);
      toast.error(error?.response?.data?.message || 'Failed to update user');
    }
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Navbar />
      <div className="max-w-3xl mx-auto py-16 px-4">
        <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
        <div className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Full Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="block font-medium mb-1">Email</label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block font-medium mb-1">Phone</label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <Button onClick={handleSave} className="mr-4">Save Changes</Button>
          <Button variant="outline" onClick={() => window.history.back()}>Back</Button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AccountSettings;
