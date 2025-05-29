import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { LogIn, Mail, Lock } from 'lucide-react';
import axios from 'axios';
import BASE_URL from "../utils/baseUrl";
import { toast } from 'sonner';
import { authService } from '@/service/authService';

const LoginPage = () => {

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [role, setRole] = useState<'user' | 'admin'>('user'); // active tab
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const parentKey =
      role === 'admin'
        ?'admin/login'
        : 'login';

    // const res = await axios.post(endpoint, formData);

    const res = await authService.create(parentKey, formData);

    const { token, user } = res.data;
    console.log('Login response:', res);

    if (user && user.id) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      toast.success('Login successful');

      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate(`/user/${user._id}`);
      }
    } else {
      toast.error("User ID not found. Please try logging in again.");
    }
  } catch (error) {
    console.error('Login error:', error);
    toast.error(error.response?.data?.message || 'Login failed. Please try again.');
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center px-4 py-12 bg-gray-50">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
            <p className="mt-2 text-sm text-gray-600">Sign in to access your account</p>
          </div>

          {/* Role Tabs */}
          <div className="flex justify-center gap-4">
            {['user', 'admin'].map(r => (
              <button
                key={r}
                onClick={() => setRole(r as 'user' | 'admin')}
                className={`px-4 py-2 rounded-md font-medium border ${
                  role === r
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-gray-700 border-gray-300'
                }`}
              >
                {r === 'user' ? 'User' : 'Admin'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="pl-10 w-full rounded-md border border-gray-300 shadow-sm focus:border-primary focus:ring-primary py-2 px-3"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className="pl-10 w-full rounded-md border border-gray-300 shadow-sm focus:border-primary focus:ring-primary py-2 px-3"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link to="/forgot-password" className="text-primary hover:text-primary/80 font-medium">
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button type="submit" className="w-full flex justify-center py-6" disabled={isLoading}>
              <LogIn className="mr-2 h-5 w-5" />
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/signup" className="text-primary hover:text-primary/80 font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage;
