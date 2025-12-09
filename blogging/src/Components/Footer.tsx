"use client"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faPinterest } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '@/context/ThemeContext';

export default function Footer() {
  const { theme } = useTheme();
  return (
    <footer className={`max-w-[1920px] mx-auto border-t ${theme === "dark" ? "bg-gray-950" : "bg-white"}`}>
      <div className="max-w-7xl mx-auto px-6 py-20">

        {/* SUBSCRIBE SECTION */}
        <div className="text-center mb-20">
          <h2 className={`text-2xl md:text-3xl font-semibold ${theme === "dark" ? "text-gray-200" : "text-gray-800"} mb-4`}>
            Join Our Newsletter
          </h2>
          <p className={`text-gray-500 ${theme === "dark" ? "text-gray-400" : "text-gray-500"} mb-6`}>
            Get the latest travel stories, tips, and blog updates — straight to your inbox.
          </p>

          {/* Subscribe bar */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-xl mx-auto">
            <input
              type="email"
              placeholder="Enter your email..."
              className="
                w-full sm:flex-1 px-5 py-3 rounded-xl border 
                border-gray-300 dark:border-gray-700 
                bg-white dark:bg-gray-900 
                text-gray-700 dark:text-gray-200 
                shadow-sm 
                focus:outline-none focus:ring-2 focus:ring-[#F04952]
                transition
              "
            />

            <button className="
                px-6 py-3 bg-[#F04952] text-white rounded-xl
                font-medium shadow hover:bg-[#d83d46] 
                transition
              ">
              Subscribe
            </button>
          </div>
        </div>

        {/* TOP SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-14">

          {/* Brand */}
          <div>
            <h2 className={`text-2xl font-semibold ${theme === "dark" ? "text-gray-200" : "text-gray-800"} tracking-tight`}>
              Potato<span className="text-[#F04952]">Trails</span>
            </h2>
            <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"} mt-3 max-w-xs`}>
              Discover stories that spark your next adventure. Travel, lifestyle,
              culture — blogs that inspire and excite.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={`text-lg font-medium ${theme === "dark" ? "text-gray-200" : "text-gray-700"} mb-4`}>
              Quick Links
            </h3>
            <ul className={`space-y-2 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
              <li><a href="/" className="hover:text-[#F04952] transition">About</a></li>
              <li><a href="/" className="hover:text-[#F04952] transition">Contact</a></li>
              <li><a href="/blogs" className="hover:text-[#F04952] transition">Blogs</a></li>
              <li><a href="/" className="hover:text-[#F04952] transition">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className={`text-lg font-medium ${theme === "dark" ? "text-gray-200" : "text-gray-700"} mb-4`}>
              Connect With Us
            </h3>
            <div className="flex space-x-6">
              <a
                href="https://instagram.com"
                target="_blank"
                className="text-gray-500 hover:text-pink-600 text-2xl transition-transform hover:scale-110"
              >
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a
                href="mailto:example@example.com"
                className="text-gray-500 hover:text-blue-600 text-2xl transition-transform hover:scale-110"
              >
                <FontAwesomeIcon icon={faEnvelope} />
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                className="text-gray-500 hover:text-red-600 text-2xl transition-transform hover:scale-110"
              >
                <FontAwesomeIcon icon={faPinterest} />
              </a>
            </div>
          </div>
        </div>

        {/* COPYRIGHT BOTTOM */}
        <div className="border-t pt-6 flex flex-col md:flex-row gap-3 md:gap-0 items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} PotatoTrail. All rights reserved. By using this website, you agree to our User Agreement, Privacy Policy, and Cookie Policy. We respect applicable privacy and data protection laws in the regions where our visitors reside and are committed to honoring your rights. Some of the links on this site are affiliate links, which means we may earn a commission if you purchase through them, at no extra cost to you. Any reproduction, distribution, or transmission of content from PotatoTrail is not allowed without our prior written permission.</p>
        </div>
      </div>
    </footer>
  );
}
