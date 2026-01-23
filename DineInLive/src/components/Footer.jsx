import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#5C2E00] text-white mt-auto">
      
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 pt-12 pb-8">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 text-center sm:text-left">

          {/* Brand Section */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-2xl font-bold mb-4">Dine In Live</h3>
            <p className="text-gray-200 leading-relaxed mb-6">
              Your trusted platform for discovering nearby mess services,
              daily tiffin providers, and live food availability.
            </p>
            
            {/* Social Media Links */}
            <div className="flex gap-4 justify-center sm:justify-start text-xl">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-yellow-300 transition-colors duration-200 w-9 h-9 flex items-center justify-center bg-[#4A2400] rounded-full"
                aria-label="Facebook"
              >
                <span>f</span>
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-yellow-300 transition-colors duration-200 w-9 h-9 flex items-center justify-center bg-[#4A2400] rounded-full"
                aria-label="Instagram"
              >
                <span>📷</span>
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-yellow-300 transition-colors duration-200 w-9 h-9 flex items-center justify-center bg-[#4A2400] rounded-full"
                aria-label="Twitter"
              >
                <span>𝕏</span>
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-yellow-300 transition-colors duration-200 w-9 h-9 flex items-center justify-center bg-[#4A2400] rounded-full"
                aria-label="LinkedIn"
              >
                <span>in</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
            <ul className="flex flex-col gap-3 text-gray-200 font-medium">
              <li>
                <Link to="/search" className="hover:text-yellow-300 transition-colors duration-200 inline-block">
                  Search Mess
                </Link>
              </li>
              <li>
                <Link to="/partner" className="hover:text-yellow-300 transition-colors duration-200 inline-block">
                  Partner with Us
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-yellow-300 transition-colors duration-200 inline-block">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/feedback" className="hover:text-yellow-300 transition-colors duration-200 inline-block">
                  Feedback
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-xl font-semibold mb-4">Support</h4>
            <ul className="flex flex-col gap-3 text-gray-200 font-medium">
              <li>
                <Link to="/help" className="hover:text-yellow-300 transition-colors duration-200 inline-block">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-yellow-300 transition-colors duration-200 inline-block">
                  FAQs
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-300 transition-colors duration-200 inline-block">
                  Get the App
                </a>
              </li>
              <li>
                <Link to="/contact" className="hover:text-yellow-300 transition-colors duration-200 inline-block">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h4 className="text-xl font-semibold mb-4">Contact</h4>
            <ul className="flex flex-col gap-3 text-gray-200">
              <li className="flex items-start gap-2 justify-center sm:justify-start">
                <span className="text-yellow-300">📍</span>
                <span>Pune, Maharashtra</span>
              </li>
              <li className="flex items-start gap-2 justify-center sm:justify-start">
                <span className="text-yellow-300">✉️</span>
                <a href="mailto:support@dineinlive.com" className="hover:text-yellow-300 transition-colors duration-200">
                  support@dineinlive.com
                </a>
              </li>
              <li className="flex items-start gap-2 justify-center sm:justify-start">
                <span className="text-yellow-300">📞</span>
                <a href="tel:+919XXXXXXXXX" className="hover:text-yellow-300 transition-colors duration-200">
                  +91 9XXXXXXXXX
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Strip */}
      <div className="bg-[#4A2400] text-center py-5 text-sm text-gray-200 border-t border-[#6B3410]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p>
            © {new Date().getFullYear()} <span className="font-semibold">Dine In Live</span>. All rights reserved.
          </p>
          <div className="flex gap-6 text-gray-200">
            <Link to="/privacy" className="hover:text-yellow-300 transition-colors duration-200">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-yellow-300 transition-colors duration-200">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;