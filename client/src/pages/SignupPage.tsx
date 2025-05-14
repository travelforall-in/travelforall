import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { UserPlus, User, Mail, Lock, Phone } from "lucide-react";
import axios from "axios";
import BASE_URL from "../utils/baseUrl";
import { toast } from "sonner";
import { authService } from "@/service/authService";

const SignupPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("user"); // 'user' or 'admin'

  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
    phone: "",
  });

  const [adminForm, setAdminForm] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
  });

  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const handleUserChange = (e) => {
    setUserForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAdminChange = (e) => {
    setAdminForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (activeTab === "user") {
      if (userForm.password !== userForm.passwordConfirm) {
        setConfirmPasswordError("Passwords do not match");
        return;
      } else {
        setConfirmPasswordError("");
      }

      if (!validatePassword(userForm.password)) {
        setPasswordError(
          "Password must be at least 6 characters, contain one uppercase letter, one number, and one special character."
        );
        return;
      } else {
        setPasswordError("");
      }

      try {
        const { passwordConfirm, ...userData } = userForm;
        // await axios.post(`${BASE_URL}/auth/register`, userData);
        await authService.create('register',userData)
        toast.success("User registered successfully!");
        navigate("/login");
      } catch (err) {
        toast.error(err.response?.data?.message || "User registration failed.");
      }
    } else {
      try {
        await axios.post(`${BASE_URL}/auth/admin/register`, {
          name: adminForm.username,
          email: adminForm.email,
          password: adminForm.password,
          phone: adminForm.phone,
        });
        toast.success("Admin registered successfully!");
        navigate("/login");
      } catch (err) {
        toast.error(
          err.response?.data?.message || "Admin registration failed."
        );
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center px-4 py-12 bg-gray-50">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              {activeTab === "user"
                ? "Create a User Account"
                : "Create an Admin Account"}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {activeTab === "user"
                ? "Join us and start exploring amazing destinations"
                : "Admin access to manage and monitor the platform"}
            </p>
          </div>

          {/* Tab buttons */}
          <div className="flex justify-center space-x-4 mb-6">
            <Button
              variant={activeTab === "user" ? "default" : "outline"}
              onClick={() => setActiveTab("user")}
            >
              User
            </Button>
            <Button
              variant={activeTab === "admin" ? "default" : "outline"}
              onClick={() => setActiveTab("admin")}
            >
              Admin
            </Button>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {activeTab === "user" ? (
              <div className="space-y-4">
                {/* Full Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={userForm.name}
                      onChange={handleUserChange}
                      className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={userForm.email}
                      onChange={handleUserChange}
                      className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]{10}"
                      maxLength={10}
                      minLength={10}
                      required
                      value={userForm.phone}
                      onChange={handleUserChange}
                      onKeyDown={(e) => {
                        // Allow only digits and control keys
                        const allowedKeys = [
                          "Backspace",
                          "ArrowLeft",
                          "ArrowRight",
                          "Tab",
                          "Delete",
                        ];
                        if (
                          !/[0-9]/.test(e.key) &&
                          !allowedKeys.includes(e.key)
                        ) {
                          e.preventDefault();
                        }
                      }}
                      className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3"
                      placeholder="Enter 10-digit number"
                      title="Please enter a valid 10-digit phone number"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      minLength={6}
                      value={userForm.password}
                      onChange={handleUserChange}
                      className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3"
                      placeholder="••••••••"
                    />
                  </div>
                  {passwordError && (
                    <p className="text-xs text-red-500 mt-1">{passwordError}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="passwordConfirm"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      id="passwordConfirm"
                      name="passwordConfirm"
                      type="password"
                      required
                      minLength={6}
                      value={userForm.passwordConfirm}
                      onChange={handleUserChange}
                      className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3"
                      placeholder="••••••••"
                    />
                  </div>
                  {confirmPasswordError && (
                    <p className="text-xs text-red-500 mt-1">
                      {confirmPasswordError}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Username */}
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      value={adminForm.username}
                      onChange={handleAdminChange}
                      className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3"
                      placeholder="Admin123"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={adminForm.email}
                      onChange={handleAdminChange}
                      className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3"
                      placeholder="admin@example.com"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Mobile Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]{10}"
                      maxLength={10}
                      minLength={10}
                      required
                      value={adminForm.phone}
                      onChange={handleAdminChange}
                      onKeyDown={(e) => {
                        const allowedKeys = [
                          "Backspace",
                          "ArrowLeft",
                          "ArrowRight",
                          "Tab",
                          "Delete",
                        ];
                        if (
                          !/[0-9]/.test(e.key) &&
                          !allowedKeys.includes(e.key)
                        ) {
                          e.preventDefault();
                        }
                      }}
                      className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3"
                      placeholder="Enter 10-digit number"
                      title="Please enter a valid 10-digit phone number"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      minLength={6}
                      value={adminForm.password}
                      onChange={handleAdminChange}
                      className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Terms */}
            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label
                htmlFor="terms"
                className="ml-2 block text-sm text-gray-700"
              >
                I agree to the{" "}
                <a
                  href="#"
                  className="text-primary hover:text-primary/80 font-medium"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="text-primary hover:text-primary/80 font-medium"
                >
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Submit */}
            <Button type="submit" className="w-full flex justify-center py-6">
              <UserPlus className="mr-2 h-5 w-5" />
              {activeTab === "user"
                ? "Create User Account"
                : "Create Admin Account"}
            </Button>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-primary hover:text-primary/80 font-medium"
                >
                  Sign in
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

export default SignupPage;
