import React from 'react';
import { Link } from 'react-router-dom';
import { getHomePath } from '../utils/getHomePath';

const AboutUs: React.FC = () => {
  const isLoggedIn: string | null = localStorage.getItem('token');
  const userId: string | null = localStorage.getItem('userId');

  return (
    <section className="bg-background py-16 text-foreground font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="card-hover backdrop-blur-card p-6 rounded-lg shadow-md mb-8 border-l-4 border-secondary">
          <h1 className="text-4xl font-bold mb-4 text-secondary">About Us</h1>
          <p className="text-lg">
            Welcome to <span className="font-semibold text-primary">TravelForAll</span> — your gateway to unforgettable adventures!
            We are passionate about helping you explore the world and create lasting memories through carefully crafted travel experiences.
          </p>
        </div>

        {/* Mission and Why Us */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10">
          <div className="card-hover backdrop-blur-card p-6 rounded-lg border-l-4 border-secondary">
            <h2 className="text-2xl font-semibold mb-4 text-secondary">Our Mission</h2>
            <p>
              Our mission is to make travel accessible and enjoyable for everyone. Whether you're dreaming of a tropical escape, a cultural city tour, or an adventurous mountain trek, we’ve got the perfect package for you.
            </p>
          </div>

          <div className="card-hover backdrop-blur-card p-6 rounded-lg border-l-4 border-secondary">
            <h2 className="text-2xl font-semibold mb-4 text-secondary">Why Choose Us?</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Experienced travel experts</li>
              <li>Affordable and customizable packages</li>
              <li>24/7 customer support</li>
              <li>Trusted by thousands of happy travelers</li>
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="card-hover backdrop-blur-card p-6 rounded-lg mt-10 border-l-4 border-secondary">
          <h2 className="text-2xl font-semibold mb-4 text-secondary">Contact Us</h2>
          <p>Have questions or need help planning your trip? Reach out to us at:</p>
          <p className="text-primary font-semibold mt-2">support@travelforall.com</p>
        </div>

        {/* Back Link */}
        <div className="mt-12 text-center">
          <Link
            to={getHomePath()}
            className="inline-block bg-primary hover:bg-secondary text-secondary-foreground font-medium py-2 px-6 rounded-lg shadow transition-all"
          >
            Back to Home
          </Link>
        </div>

      </div>
    </section>
  );
};

export default AboutUs;
