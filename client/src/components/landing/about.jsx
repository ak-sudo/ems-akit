import React from "react";
import { motion } from "framer-motion";
import { Users, Target, Rocket } from "lucide-react";

export default function AboutUs() {
  return (
    <section className="relative bg-black text-white py-20 px-6 md:px-16 overflow-hidden" id="about">
      {/* Background gradient animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-purple-600/20 to-blue-500/20 animate-pulse blur-3xl"></div>

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        {/* Section Title */}
        <motion.h2
          className="text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-blue-400"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          About Us
        </motion.h2>

        <motion.p
          className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          We are on a mission to make college events more exciting, organized, 
          and accessible. Our platform connects students with upcoming events, 
          making participation as simple as a click.
        </motion.p>

        {/* Cards Section */}
        <div className="grid md:grid-cols-3 gap-10 mt-16">
          {/* Card 1 */}
          <motion.div
            className="p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-gray-700 hover:border-pink-500/70 transition-all shadow-lg hover:shadow-pink-500/30"
            whileHover={{ scale: 1.05 }}
          >
            <Users className="w-12 h-12 mx-auto text-pink-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Community First</h3>
            <p className="text-gray-400 text-sm">
              Bringing students together by making every event accessible 
              and fun to join.
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            className="p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-gray-700 hover:border-blue-500/70 transition-all shadow-lg hover:shadow-blue-500/30"
            whileHover={{ scale: 1.05 }}
          >
            <Target className="w-12 h-12 mx-auto text-blue-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Focused Goals</h3>
            <p className="text-gray-400 text-sm">
              Helping colleges organize smooth events with easy registrations 
              and real-time updates.
            </p>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            className="p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-gray-700 hover:border-purple-500/70 transition-all shadow-lg hover:shadow-purple-500/30"
            whileHover={{ scale: 1.05 }}
          >
            <Rocket className="w-12 h-12 mx-auto text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Innovation</h3>
            <p className="text-gray-400 text-sm">
              Leveraging modern tech to make student life more connected, 
              simple, and eventful.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
