import React from 'react';
import { faSearch, faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Navbar = () => {
  return (
    <header className="w-full bg-white shadow-md sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto flex items-center justify-between py-3 px-2">
        {/* Logo */}
        <div className="text-3xl font-extrabold text-gray-800 tracking-tight">
          <a href="/">Potato<span className="text-blue-500">trails</span></a>
        </div>

        {/* Desktop Nav Links */}
        <ul className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
          <li className="hover:text-blue-500 transition-colors duration-200">
            <a href="/">Home</a>
          </li>
          <li className="hover:text-blue-500 transition-colors duration-200">
            <a href="#blogs">Blogs</a>
          </li>
          <li className="hover:text-blue-500 transition-colors duration-200">
            <a href="/shop">Shop</a>
          </li>
          <li className="hover:text-blue-500 transition-colors duration-200">
            <a href="#contact">Contact</a>
          </li>
        </ul>

        {/* Desktop Search + Login */}
        <div className='flex justify-between gap-2'>
          {/* <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-1 w-[240px] border border-gray-300">
            <FontAwesomeIcon icon={faSearch} className="text-gray-500 text-sm" />
            <input
              type="text"
              placeholder="Search..."
              aria-label="Search blog posts"
              className="ml-3 w-full bg-transparent outline-none text-sm placeholder-gray-500 text-gray-800"
            />
          </div> */}
          <a
            href={process.env.NEXT_PUBLIC_ADMIN_URL}
            target="_blank"
            className="hidden md:inline-flex  items-center gap-2 px-4 py-2 bg-gray-950 text-white text-sm font-semibold rounded-md shadow-md hover:bg-gray-900 transition-all duration-200"
          >
            <FontAwesomeIcon icon={faRightToBracket} className="w-4 h-4" />
            Login
          </a>
        </div>

        {/* Mobile Menu */}
        <details className="md:hidden relative">
          <summary className="text-2xl cursor-pointer marker:hidden list-none">&#9776;</summary>
          <div className="absolute right-0 top-10 bg-white border rounded-lg shadow-lg w-56 p-4 flex flex-col gap-3 z-50">
            <a href="/" className="text-sm font-medium text-gray-700 hover:text-blue-500">Home</a>
            <a href="#blogs" className="text-sm font-medium text-gray-700 hover:text-blue-500">Blogs</a>
            <a href="/merch" className="text-sm font-medium text-gray-700 hover:text-blue-500">Merch</a>
            <a href="#contact" className="text-sm font-medium text-gray-700 hover:text-blue-500">Contact</a>
            <div className='flex flex-col gap-2'>
              {/* <div className="flex items-center bg-gray-100 rounded-full px-4 py-1 mt-2 border border-gray-300">
                <FontAwesomeIcon icon={faSearch} className="text-gray-500 text-sm" />
                <input
                  type="text"
                  placeholder="Search..."
                  aria-label="Search blog posts"
                  className="ml-3 w-full bg-transparent outline-none text-sm placeholder-gray-500 text-gray-800"
                />
              </div> */}
              <a
                href={process.env.NEXT_PUBLIC_ADMIN_URL}
                target="_blank"
                className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-gray-950 text-white text-sm font-semibold rounded-md shadow hover:bg-gray-900 transition-all duration-200"
              >
                <FontAwesomeIcon icon={faRightToBracket} className="w-4 h-4" />
                <span>Login</span>
              </a>

            </div>
          </div>
        </details>
      </nav>
    </header>
  );
};

export default Navbar;
