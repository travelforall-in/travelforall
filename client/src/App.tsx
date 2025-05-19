// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
// import PackagesPage from "./pages/PackagesPage";
import NotFound from "./pages/NotFound";
import AllDestinations from "./components/AllDestinations";
// import ExplorePackages from "./pages/ExplorePackages";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import SearchResultsPage from "./pages/SearchResultsPage";
// import AllPackages from "./pages/AllPackages";
import MyPackages from "./pages/MyPackages";
import WishlistPage from "./components/WishlistPage";
import Domestic from "./pages/Domestic";
import BookingPage from "./pages/BookingPage";
import PaymentPage from "./pages/PaymentPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import Account from "./pages/Account";
// import PackageDetailsPage from "./pages/PackageDetailsPage";
import AccountSettings from "./pages/AccountSettings";
import ChangePassword from "./pages/ChangePassword";
import PaymentHistory from "./pages/PaymentHistory";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCreatePackage from "./pages/AdminCreatePackage";
import AdminPanel from "./pages/AdminPanel";
import AdminPackageList from "./pages/AdminPackageList";
import ManageUsers from "./pages/ManageUsers";
import AllPackages from "./pages/AllPackages";
import AllPackagesPage from "./pages/AllPackagesPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/destinations" element={<AllDestinations />} />
          <Route path="/all-packages" element={<AllPackagesPage />} />  
          {/* <Route path="/explore-packages" element={<ExplorePackages />} /> */}
          <Route path="/search-results" element={<SearchResultsPage />} />
          {/* <Route path="/packages" element={<AllPackages />} /> */}
          <Route path="/account" element={<Account />} />
           <Route path="/account-settings" element={<AccountSettings />} />
            <Route path="/change-password"element={<ChangePassword />} />
             <Route path="/payment-history"element={<PaymentHistory />} />
          <Route path="/my-packages" element={<MyPackages />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/destinations/:type" element={<Domestic />} />
          <Route path="/booking/:packageId" element={<BookingPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/payment-success" element={<PaymentSuccessPage />} />
          <Route path="/admin/dashboard" element={<AdminPanel />} />
          <Route path="/admin/manage-users" element={<ManageUsers />} />
          

          <Route path="/admin/package-list" element={<AdminPackageList />} />
          <Route
            path="/admin/create-package"
            element={<AdminCreatePackage />}
          />

          {/* Auth-protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/user/:id" element={<Index />} />
            {/* Add more protected routes here */}
          </Route>

          {/* Auth public routes (only accessible when not logged in) */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
