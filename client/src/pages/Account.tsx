// // import React, { useState } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import { Button } from '@/components/ui/button';
// // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// // import Footer from '@/components/Footer';
// // import Navbar from '@/components/Navbar';
// // import Card from '@/components/shared/Card';

// // const Account = () => {
// //   const navigate = useNavigate();
// //   const [currency, setCurrency] = useState('USD');

// //   const handleCurrencyChange = (value: string) => {
// //     setCurrency(value);
// //     localStorage.setItem('preferredCurrency', value);
// //   };
// //   const items = [
// //     {
// //       label: "Profile Settings",
// //       desc: "Update your personal information and password.",
// //       route: "/account-settings",
// //       btnName: "Manage"
// //     },
// //     {
// //       label: "My Bookings",
// //       desc: "View all your current and past travel plans.",
// //       route: "/my-packages",
// //       btnName: "View"
// //     },
// //     {
// //       label: "Wishlist",
// //       desc: "Access your favorite destinations anytime.",
// //       route: "/wishlist",
// //       btnName: "Open"
// //     },
// //     {
// //       label: "Payment History",
// //       desc: "Review transactions and billing records.",
// //       route: "/payment-history",
// //       btnName: "Check"
// //     },
// //     {
// //       label: "Support",
// //       desc: "Need help? Reach out to our support team.",
// //       route: "/support",
// //       btnName: "Contact"
// //     }
// //   ];
  

// //   return (
// //     <>
// //     <Navbar />
// //     <div className="max-w-6xl mx-auto py-16 px-6">
// //       <h1 className="text-4xl font-bold mb-10 text-gray-900">My Account</h1>

// //       <div className="mb-10">
// //         <label className="block text-lg font-medium text-gray-700 mb-2">Preferred Currency</label>
// //         <Select value={currency} onValueChange={handleCurrencyChange}>
// //           <SelectTrigger className="w-60">
// //             <SelectValue placeholder="Select currency" />
// //           </SelectTrigger>
// //           <SelectContent>
// //             <SelectItem value="USD">USD - US Dollar</SelectItem>
// //             <SelectItem value="EUR">EUR - Euro</SelectItem>
// //             <SelectItem value="INR">INR - Indian Rupee</SelectItem>
// //             <SelectItem value="GBP">GBP - British Pound</SelectItem>
// //           </SelectContent>
// //         </Select>
// //       </div>

// //      <Card items={items}/>
// //     </div>
    
// //     </>
// //   );
// // };

// // export default Account;









// // 📁 src/pages/Account.jsx
// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { Button } from '@/components/ui/button';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import Footer from '@/components/Footer';
// import Navbar from '@/components/Navbar';
// import Card from '@/components/shared/Card';

// const Account = () => {
//   const navigate = useNavigate();
//   const [currency, setCurrency] = useState('USD');
//   const [user, setUser] = useState({ name: '', email: '' });

//   // Replace this with logic to get logged-in user's ID (from token, context, etc)
//   const userId = '661f35fae134a15b21c8318f'; // example MongoDB ObjectId

//   useEffect(() => {
//     axios
//       .get(`http://localhost:5000/api/user/${userId}`)
//       .then((res) => {
//         setUser({ name: res.data.name, email: res.data.email });
//       })
//       .catch((err) => {
//         console.error('Error fetching user data:', err);
//       });
//   }, []);

//   const handleCurrencyChange = (value) => {
//     setCurrency(value);
//     localStorage.setItem('preferredCurrency', value);
//   };

//   const items = [
//     {
//       label: 'Profile Settings',
//       desc: 'Update your personal information and password.',
//       route: '/account-settings',
//       btnName: 'Manage',
//     },
//     {
//       label: 'My Bookings',
//       desc: 'View all your current and past travel plans.',
//       route: '/my-packages',
//       btnName: 'View',
//     },
//     {
//       label: 'Wishlist',
//       desc: 'Access your favorite destinations anytime.',
//       route: '/wishlist',
//       btnName: 'Open',
//     },
//     {
//       label: 'Payment History',
//       desc: 'Review transactions and billing records.',
//       route: '/payment-history',
//       btnName: 'Check',
//     },
//     {
//       label: 'Support',
//       desc: 'Need help? Reach out to our support team.',
//       route: '/support',
//       btnName: 'Contact',
//     },
//   ];

//   return (
//     <>
//       <Navbar />
//       <div className="max-w-6xl mx-auto py-16 px-6">
//         <h1 className="text-4xl font-bold mb-4 text-gray-900">My Account</h1>
//         <p className="text-lg text-gray-700 mb-1">
//           <strong>Name:</strong> {user.name}
//         </p>
//         <p className="text-lg text-gray-700 mb-6">
//           <strong>Email:</strong> {user.email}
//         </p>

//         <div className="mb-10">
//           <label className="block text-lg font-medium text-gray-700 mb-2">
//             Preferred Currency
//           </label>
//           <Select value={currency} onValueChange={handleCurrencyChange}>
//             <SelectTrigger className="w-60">
//               <SelectValue placeholder="Select currency" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="USD">USD - US Dollar</SelectItem>
//               <SelectItem value="EUR">EUR - Euro</SelectItem>
//               <SelectItem value="INR">INR - Indian Rupee</SelectItem>
//               <SelectItem value="GBP">GBP - British Pound</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         <Card items={items} />
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default Account;









// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Button } from '@/components/ui/button';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue
// } from '@/components/ui/select';
// import Footer from '@/components/Footer';
// import Navbar from '@/components/Navbar';

// const Account = () => {
//   const navigate = useNavigate();
//   const [currency, setCurrency] = useState('USD');
//   const [user, setUser] = useState({ name: '', email: '' });

//   useEffect(() => {
//     // Load preferred currency from localStorage
//     const storedCurrency = localStorage.getItem('preferredCurrency');
//     if (storedCurrency) setCurrency(storedCurrency);
  
//     // Fetch user data from localStorage
//     const fetchUser = () => {
//   try {
//     const storedUser = localStorage.getItem('user');
//     if (storedUser) {
//       const parsedUser = JSON.parse(storedUser);
//       const name = parsedUser.name || '';
//       const email = parsedUser.email || '';
//       setUser({ name, email });
//     }
//   } catch (error) {
//     console.error('Failed to parse user data:', error);
//   }
// };

// fetchUser();
//   }, []);
  

//   const handleCurrencyChange = (value: string) => {
//     setCurrency(value);
//     localStorage.setItem('preferredCurrency', value);
//   };

//   const handleLogout = () => {
//     // Clear user session (token/localStorage/etc.)
//     localStorage.clear();
//     navigate('/login');
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="max-w-6xl mx-auto py-16 px-6">
//         <h1 className="text-4xl font-bold mb-4 text-gray-900">My Account</h1>

//         <div className="flex items-center justify-between bg-gray-50 p-6 rounded-xl shadow-sm mb-10">
//           <div>
//             <h2 className="text-2xl font-semibold text-gray-800">{user.name}</h2>
//             <p className="text-gray-600">{user.email}</p>
//           </div>
//           <Button variant="destructive" onClick={handleLogout}>
//             Logout
//           </Button>
//         </div>

//         <div className="mb-10">
//           <label className="block text-lg font-medium text-gray-700 mb-2">Preferred Currency</label>
//           <Select value={currency} onValueChange={handleCurrencyChange}>
//             <SelectTrigger className="w-60">
//               <SelectValue placeholder="Select currency" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="USD">USD - US Dollar</SelectItem>
//               <SelectItem value="EUR">EUR - Euro</SelectItem>
//               <SelectItem value="INR">INR - Indian Rupee</SelectItem>
//               <SelectItem value="GBP">GBP - British Pound</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//           {/* ACCOUNT SETTINGS */}
//           <AccountCard title="Profile Settings" desc="Update your personal info and password." route="/account-settings" />
//           <AccountCard title="Change Password" desc="Update your password for security." route="/change-password" />

//           {/* BOOKINGS AND LISTS */}
//           <AccountCard title="My Bookings" desc="View your current and past travel plans." route="/my-packages" />
//           <AccountCard title="Wishlist" desc="Access your saved destinations." route="/wishlist" />

//           {/* HISTORY AND SUPPORT */}
//           <AccountCard title="Payment History" desc="Review your transaction history." route="/payment-history" />
//           <AccountCard title="Support" desc="Need help? Contact us." route="/contact" />
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// };

// const AccountCard = ({
//   title,
//   desc,
//   route
// }: {
//   title: string;
//   desc: string;
//   route: string;
// }) => {
//   const navigate = useNavigate();
//   return (
//     <div className="p-6 border border-gray-200 rounded-2xl bg-white shadow-sm hover:shadow transition">
//       <h2 className="text-xl font-semibold mb-2 text-gray-800">{title}</h2>
//       <p className="text-gray-600 mb-4 text-sm">{desc}</p>
//       <Button onClick={() => navigate(route)}>Go</Button>
//     </div>
//   );
// };

// export default Account;





import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import axios from 'axios'; // Make sure you have axios installed

const Account = () => {
  const navigate = useNavigate();
  const [currency, setCurrency] = useState('USD');
  const [user, setUser] = useState({ name: '', email: '' });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token'); // Fetch token from localStorage
        if (token) {
          const response = await axios.get('http://localhost:5000/api/users/profile', {
            headers: {
              Authorization: `Bearer ${token}` // Send token in headers for authentication
            }
          });

          const { name, email } = response.data.data;
          setUser({ name, email });
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        // You can handle the error here by showing a toast message or redirecting
      }
    };

    fetchUser();
  }, []);

  const handleCurrencyChange = (value: string) => {
    setCurrency(value);
    localStorage.setItem('preferredCurrency', value);
  };

  const handleLogout = () => {
    // Clear user session (token/localStorage/etc.)
    localStorage.clear();
    navigate('/login');
  };

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto py-16 px-6">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">My Account</h1>

        <div className="flex items-center justify-between bg-gray-50 p-6 rounded-xl shadow-sm mb-10">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
          </div>
          <Button variant="destructive" onClick={handleLogout}>
            Logout
          </Button>
        </div>

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
          {/* ACCOUNT SETTINGS */}
          <AccountCard title="Profile Settings" desc="Update your personal info and password." route="/account-settings" />
          <AccountCard title="Change Password" desc="Update your password for security." route="/change-password" />

          {/* BOOKINGS AND LISTS */}
          <AccountCard title="My Bookings" desc="View your current and past travel plans." route="/my-packages" />
          <AccountCard title="Wishlist" desc="Access your saved destinations." route="/wishlist" />

          {/* HISTORY AND SUPPORT */}
          <AccountCard title="Payment History" desc="Review your transaction history." route="/payment-history" />
          <AccountCard title="Support" desc="Need help? Contact us." route="/contact" />
        </div>
      </div>
      <Footer />
    </>
  );
};

const AccountCard = ({ title, desc, route }: { title: string; desc: string; route: string }) => {
  const navigate = useNavigate();
  return (
    <div className="p-6 border border-gray-200 rounded-2xl bg-white shadow-sm hover:shadow transition">
      <h2 className="text-xl font-semibold mb-2 text-gray-800">{title}</h2>
      <p className="text-gray-600 mb-4 text-sm">{desc}</p>
      <Button onClick={() => navigate(route)}>Go</Button>
    </div>
  );
};

export default Account;
