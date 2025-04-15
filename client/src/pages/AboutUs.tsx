import React from 'react';
import { Link } from 'react-router-dom';
import { getHomePath } from '../utils/getHomePath';


const AboutUs = () => {
  const isLoggedIn = localStorage.getItem('token'); // or however you store auth
  const userId = localStorage.getItem('userId'); // assuming you store user ID

  // const backLink = isLoggedIn && userId ? `/user/${userId}` : '/';
  
  return (
    <section className="bg-white py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Us</h1>
          <p className="text-lg text-gray-600">
            Welcome to <span className="font-semibold text-blue-600">TravelForAll</span> — your gateway to unforgettable adventures!
            We are passionate about helping you explore the world and create lasting memories through carefully crafted travel experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h2>
            <p className="text-gray-600">
              Our mission is to make travel accessible and enjoyable for everyone. Whether you're dreaming of a tropical escape, a cultural city tour, or an adventurous mountain trek, we’ve got the perfect package for you.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Why Choose Us?</h2>
            <ul className="list-disc list-inside text-gray-600">
              <li>Experienced travel experts</li>
              <li>Affordable and customizable packages</li>
              <li>24/7 customer support</li>
              <li>Trusted by thousands of happy travelers</li>
            </ul>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Us</h2>
          <p className="text-gray-600">Have questions or need help planning your trip? Reach out to us at:</p>
          <p className="text-blue-600 font-semibold mt-2">support@travelforall.com</p>
        </div>

        <div className="mt-12">
          <Link to={getHomePath()} className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg shadow">
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
