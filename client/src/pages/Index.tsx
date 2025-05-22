// import React, { useState } from 'react';
// import Navbar from '@/components/Navbar';
// import Footer from '@/components/Footer';
// import HeroSection from '@/components/HeroSection';
// import FeaturedDestinations from '@/components/FeaturedDestinations';
// import Testimonials from '@/components/Testimonials';
// import NewsletterSection from '@/components/NewsletterSection';
// import { useParams, Link } from 'react-router-dom';
// import PartnerLogo from '@/images/PartnerLogo.jpg';

// const Index = () => {
//   const [showSidebar, setShowSidebar] = useState(false);
//   const { id } = useParams();

//   return (
//     <div className="min-h-screen flex flex-col relative">
//       <Navbar />
//       <main className="flex-grow pt-16">

//         {/* Floating Partner Card on Right Side */}
//         <div className="fixed top-28 right-4 z-40">
//           <div className="bg-white rounded-2xl shadow-xl p-4 w-64 text-center">
//             <h2 className="text-md font-semibold text-gray-800 mb-2">Our Travel Partner</h2>
//             <button
//               onClick={() => setShowSidebar(true)}
//               className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
//             >
//               View Detail
//             </button>
//           </div>
//         </div>

//         {/* Sidebar Popup Panel */}
//         <div
//           className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl transition-transform duration-300 ease-in-out z-50 ${
//             showSidebar ? 'translate-x-0' : 'translate-x-full'
//           }`}
//         >
//           <div className="p-6 relative h-full">
//             <button
//               onClick={() => setShowSidebar(false)}
//               className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl"
//             >
//               &times;
//             </button>
//             <img
//               src={PartnerLogo}
//               alt="Partner Detail"
//               className="w-24 h-24 object-cover mx-auto rounded-md"
//             />
//             <h3 className="text-xl font-bold text-center mt-4">Partner Company Name</h3>
//             <p className="mt-2 text-sm text-gray-600 text-center">
//               This partner is a trusted provider of high-quality travel packages.
//             </p>
//             <div className="flex justify-center mt-6">
//               <Link
//                 to="/partner-details"
//                 className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
//               >
//                 Visit Page
//               </Link>
//             </div>
//           </div>
//         </div>

//         {/* Main Sections */}
//         <HeroSection />
//         <FeaturedDestinations />
//         {/* <PopularPackages /> */}
//         <Testimonials />
//         <NewsletterSection />
//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default Index;



import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import FeaturedDestinations from '@/components/FeaturedDestinations';
// import PopularPackages from '@/components/PopularPackages';
import Testimonials from '@/components/Testimonials';
import NewsletterSection from '@/components/NewsletterSection';
import { useParams, Link } from 'react-router-dom';
import PartnerLogo from '@/images/PartnerLogo.jpg';

const Index = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16">
        <HeroSection />
        <FeaturedDestinations />

        {/* 👇 Modern Partner Section */}
        <section className="py-10 bg-gray-50">
          <h2 className="text-3xl font-bold text-center mb-8">Our Trusted Travel Partner</h2>
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-6">
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
              <img src={PartnerLogo} alt="Partner" className="h-20 w-auto mx-auto mb-4" />
              <h3 className="text-center font-semibold text-lg">XYZ Travels</h3>
              <p className="text-sm text-gray-600 text-center mt-2">
                Premium travel experiences across the globe.
              </p>
              <div className="flex justify-center mt-4">
                <Link to="/partner-details" className="text-orange-600 hover:underline">
                  View Details →
                </Link>
              </div>
            </div>
            {/* You can duplicate this card for more partners if needed */}
          </div>
        </section>

        <Testimonials />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
