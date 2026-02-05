import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-blue-500">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Brand / Logo Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-3">College Events</h2>
          <p className="text-gray-400">
            A modern platform to discover and register for all upcoming college events.
          </p>
        </div>

        {/* Navigation Links */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="/#home" className="hover:text-blue-400 transition">Home</a></li>
            <li><a href="/#about" className="hover:text-blue-400 transition">About Us</a></li>
            <li><a href="/#events" className="hover:text-blue-400 transition">Events</a></li>
            <li><a href="/#gallery" className="hover:text-blue-400 transition">Gallery</a></li>
            <li><a href="/#contact" className="hover:text-blue-400 transition">Contact</a></li>
          </ul>
        </div>

        {/* Social Media Links */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-3">Follow Us</h3>
          <div className="flex space-x-4 text-2xl">
            <a href="#" className="hover:text-blue-400 transition"><FaFacebook /></a>
            <a href="#" className="hover:text-blue-400 transition"><FaTwitter /></a>
            <a href="#" className="hover:text-blue-400 transition"><FaInstagram /></a>
            <a href="#" className="hover:text-blue-400 transition"><FaLinkedin /></a>
            <a href="#" className="hover:text-blue-400 transition"><FaGithub /></a>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="bg-gray-800 text-center text-gray-400 py-4 text-sm border-t border-gray-700">
        © {new Date().getFullYear()} College Events. All Rights Reserved.
      </div>
    </footer>
  );
}
