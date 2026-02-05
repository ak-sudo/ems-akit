import React from "react";
import { ChevronDown } from "lucide-react"; // using lucide-react for clean icons

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 pt-24"
    >
      <div className="max-w-4xl mx-auto text-center px-6">
        {/* Heading */}
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
          Welcome to{" "}
          <span className="text-blue-600">EMS - AKIT</span>
        </h1>

        {/* Catchy Subtitle */}
        <p className="mt-6 text-sm md:text-xl text-gray-600 font-medium">
          🎉 One place. All events. Endless memories.
          <br /> Stay connected. Stay involved. Stay inspired.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex justify-center gap-4">
          <a
            href="#events"
            className="bg-blue-600 text-white px-2 py-1 rounded-lg text-lg font-medium hover:bg-blue-700 transition shadow-md md:px-6 py-3"
          >
            Explore Events
          </a>
          <a
            href="#events"
            className="bg-white text-blue-600 border border-blue-600 px-2 py-1 rounded-lg text-lg font-medium hover:bg-blue-50 transition shadow-md md:px-6 py-3"
          >
            Register Now
          </a>
        </div>
      </div>

      {/* Decorative animated background blobs */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>

      {/* Scroll Down Indicator */}
      <a
        href="#about"
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-gray-600 hover:text-blue-600 transition"
      >
        <ChevronDown className="w-8 h-8 animate-bounce" />
      </a>

      {/* Animations */}
      <style>{`
        .animate-blob {
          animation: blob 8s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
      `}</style>
    </section>
  );
}
