// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SmoothScrollWrapper from "./components/SmoothScrollWrapper";
import QRPopup from "./components/QRPopup";

import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import NotFound from "./pages/NotFound";
import AllDestinations from "./components/AllDestinations";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import SearchResultsPage from "./pages/SearchResultsPage";
import MyPackages from "./pages/MyPackages";
import Domestic from "./pages/Domestic";
import BookingPage from "./pages/BookingPage";
import PaymentPage from "./pages/PaymentPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import Account from "./pages/Account";
import AccountSettings from "./pages/AccountSettings";
import ChangePassword from "./pages/ChangePassword";
import PaymentHistory from "./pages/PaymentHistory";
import AdminCreatePackage from "./pages/AdminCreatePackage";
import AdminPanel from "./pages/AdminPanel";
import AdminPackageList from "./pages/AdminPackageList";
import ManageUsers from "./pages/AdminManageUsers";
import AllPackagesPage from "./pages/AllPackagesPage";
import PartnerDetails from "./Parnters/PartnerDetails";
import Destination from "./pages/AdminDestination";
import DomesticDestination from "./pages/AdminDestinationDomestic";
import InternationalDestination from "./pages/AdminDestinationInternational";
import StatePackages from "./pages/AdminStatePackages";
import CreateState from "./pages/AdminCreateState";
import ExplorePackages from "./pages/ExplorePackages";
import FeaturedPackages from "./components/FeaturedPackages";
import ViewPackages from "./pages/ViewPackages";
import ViewPackageDetails from "./pages/ViewPackageDetails";
import BookingList from "./pages/AdminBookingList";
import ManageBookings from "./pages/AdminManageBookings";
import EditPackage from "./pages/AdminEditPackage";
import PageWishlist from "./pages/PageWishlist";
import CustomPackageForm from "./pages/CustomPackageForm";

import CustomPackageList from "./pages/AdminCustomPackageList";
import AdminHotelsPage from "./pages/AdminHotelsPage";
import AdminLocationsPage from "./pages/AdminLocationsPage";
import EditLocationPage from "./pages/AdminEditLocation";
import EditHotelPage from "./pages/AdminEditHotel";
import CreateHotelPage from "./pages/AdminCreateHotel";
import CreateLocationPage from "./pages/AdminCreateLocation";
import UserCustomPackage from "./pages/UserCustomPackage";
import CustomPackageDetails from "./pages/CustomPackageDetails";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <QRPopup />
        <SmoothScrollWrapper>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/destinations" element={<AllDestinations />} />
            <Route path="/all-packages" element={<AllPackagesPage />} />
            {<Route path="/all-packages" element={<ExplorePackages />} />}
            <Route path="/search-results" element={<SearchResultsPage />} />
            <Route path="/partner-details" element={<PartnerDetails />} />
            <Route path="/all-packages" element={<FeaturedPackages />} />
            <Route path="/account" element={<Account />} />
            <Route path="/account-settings" element={<AccountSettings />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/payment-history" element={<PaymentHistory />} />
            <Route path="/my-packages" element={<MyPackages userId="" />} />
            <Route path="/destinations/:type" element={<Domestic />} />
            <Route
              path="/booking/:packageId"
              element={<BookingPage packageId={""} price={""} />}
            />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/payment-success" element={<PaymentSuccessPage />} />
            <Route path="/packages/:id" element={<ViewPackageDetails />} />
            <Route
              path="/custom-packages/add"
              element={<CustomPackageForm />}
            />
            <Route
              path="/custom-packages/view"
              element={<CustomPackageDetails />}
            />
            <Route path="/custom-packages" element={<UserCustomPackage />} />
            <Route
              path="/packages/:id/details"
              element={<ViewPackageDetails />}
            />
            <Route path="/wishlist" element={<PageWishlist />} />
            <Route
              path="/custom-packages-form"
              element={<CustomPackageForm />}
            />
            {/* <Route path="/custom-packages" element={<UserCustomPackage />} /> */}
            <Route path="/admin/dashboard" element={<AdminPanel />} />
            <Route path="/admin/manage-users" element={<ManageUsers />} />
            <Route path="/admin/bookings" element={<BookingList />} />
            <Route path="/admin/manage-bookings" element={<ManageBookings />} />
            <Route path="/admin/destination" element={<Destination />} />
            <Route
              path="/admin/destination/domestic"
              element={<DomesticDestination />}
            />
            <Route
              path="/admin/destination/international"
              element={<InternationalDestination />}
            />
            <Route
              path="/admin/state/:id/packages"
              element={<StatePackages />}
            />
            <Route path="/admin/create-state" element={<CreateState />} />
            <Route path="/admin/package-list" element={<AdminPackageList />} />
            <Route
              path="/admin/create-package"
              element={<AdminCreatePackage />}
            />
            <Route path="/admin/edit-package/:id" element={<EditPackage />} />
            <Route
              path="/admin/custom-packages"
              element={<CustomPackageList />}
            />
            <Route path="/admin/hotels" element={<AdminHotelsPage />} />.
            <Route path="/admin/hotels/edit/:id" element={<EditHotelPage />} />
            <Route path="/admin/hotels/create" element={<CreateHotelPage />} />
            <Route path="/admin/locations" element={<AdminLocationsPage />} />
            <Route
              path="/admin/locations/edit/:id"
              element={<EditLocationPage />}
            />
            <Route
              path="/admin/locations/create"
              element={<CreateLocationPage />}
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
        </SmoothScrollWrapper>
        {/* <ChatbotWithQR /> */}
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
