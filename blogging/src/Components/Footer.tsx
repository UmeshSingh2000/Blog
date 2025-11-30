import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faPinterest } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

export default function Footer() {
  return (
    <footer className="max-w-[1920px] mx-auto border-t bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-6 py-20">

        {/* SUBSCRIBE SECTION */}
        <div className="text-center mb-20">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Join Our Newsletter
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
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
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white tracking-tight">
              Potato<span className="text-[#F04952]">Trails</span>
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 max-w-xs">
              Discover stories that spark your next adventure. Travel, lifestyle,
              culture — blogs that inspire and excite.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2 text-gray-500 dark:text-gray-400">
              <li><a href="/" className="hover:text-[#F04952] transition">About</a></li>
              <li><a href="/" className="hover:text-[#F04952] transition">Contact</a></li>
              <li><a href="/blogs" className="hover:text-[#F04952] transition">Blogs</a></li>
              <li><a href="/" className="hover:text-[#F04952] transition">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-4">
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
          <p>&copy; {new Date().getFullYear()} Potato Trails. All rights reserved.</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Crafted with ❤️ for travelers & creators.
          </p>
        </div>
      </div>
    </footer>
  );
}
