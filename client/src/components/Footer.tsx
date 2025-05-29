
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and about */}
          <div>
            <Link to="/" className="flex items-center mb-4">
              <span className="text-2xl font-bold text-white">Travell<span className="text-coral-500">ForAll</span></span>
            </Link>
            <p className="text-gray-400 mb-4">
              Discover the world with our premium travel packages. We provide unforgettable experiences for all travelers.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://www.instagram.com/_schoolforall_?igsh=MXB3dzZyamJoaTJscw==" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/destinations" className="text-gray-400 hover:text-white transition-colors">Destinations</Link>
              </li>
              <li>
                <Link to="/packages" className="text-gray-400 hover:text-white transition-colors">Packages</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/Contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Our Services</h3>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="text-gray-400 hover:text-white transition-colors">Adventure Tours</Link>
              </li>
              <li>
                <Link to="#" className="text-gray-400 hover:text-white transition-colors">Luxury Getaways</Link>
              </li>
              <li>
                <Link to="#" className="text-gray-400 hover:text-white transition-colors">Family Packages</Link>
              </li>
              <li>
                <Link to="#" className="text-gray-400 hover:text-white transition-colors">Cultural Experiences</Link>
              </li>
              <li>
                <Link to="#" className="text-gray-400 hover:text-white transition-colors">Honeymoon Specials</Link>
              </li>
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 mt-0.5 text-gray-400" />
                <span className="text-gray-400">Gate No.1230 SH.No.1, 2, 3 & 4, Ground Floor, Near Hiras Nagar Police Station, Hiras Nagar Society, Pirangut, Pune-412215, Maharashtra, India.</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-gray-400" />
                <span className="text-gray-400">+91 (913) 085-4236</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-gray-400" />
                <span className="text-gray-400">info@travellforall.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-center text-gray-400">
            &copy; {new Date().getFullYear()} TravellForAll. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
