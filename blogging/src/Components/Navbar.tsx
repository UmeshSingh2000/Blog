"use client";
import React, { useEffect, useState } from "react";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50); // change when scrolling past 50px
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`w-full fixed top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/90 shadow-md py-2" : "bg-wh ite py-4"
      }`}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-2 transition-all duration-300">
        {/* Logo */}
        <div
          className={`font-extrabold tracking-tight transition-all duration-300 ${
            scrolled
              ? "text-2xl text-gray-900"
              : "text-3xl text-gray-800"
          }`}
        >
          <a href="/">
            Potato<span className="text-[#F04952]">trails</span>
          </a>
        </div>

        {/* Desktop Nav Links */}
        <ul className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
          <li className="hover:text-[#F04952] transition-colors duration-200">
            <a href="/">Home</a>
          </li>
          <li className="hover:text-[#F04952] transition-colors duration-200">
            <a href="/">About</a>
          </li>
          <li className="hover:text-[#F04952] transition-colors duration-200">
            <a href="#blogs">Blogs</a>
          </li>
          <li className="hover:text-[#F04952] transition-colors duration-200">
            <a href="/shop">Shop</a>
          </li>
          <li className="hover:text-[#F04952] transition-colors duration-200">
            <a href="#contact">Contact</a>
          </li>
        </ul>

        {/* Desktop Admin Button */}
        <div>
          <a
            href={process.env.NEXT_PUBLIC_ADMIN_URL}
            target="_blank"
            className={`hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-md shadow-md transition-all duration-300 ${
              scrolled
                ? "bg-[#F04952] text-white hover:bg-[#f9545c]"
                : "bg-[#F04952] text-white"
            }`}
          >
            <FontAwesomeIcon icon={faRightToBracket} className="w-4 h-4" />
            Admin
          </a>
        </div>

        {/* Mobile Menu */}
        <details className="md:hidden relative">
          <summary className="text-2xl cursor-pointer marker:hidden list-none">
            &#9776;
          </summary>
          <div className="absolute right-0 top-10 bg-white border rounded-lg shadow-lg w-56 p-4 flex flex-col gap-3 z-50">
            <a href="/" className="text-sm font-medium text-gray-700 hover:text-[#F04952]">
              Home
            </a>
            <a href="#blogs" className="text-sm font-medium text-gray-700 hover:text-[#F04952]">
              Blogs
            </a>
            <a href="/merch" className="text-sm font-medium text-gray-700 hover:text-[#F04952]">
              Merch
            </a>
            <a href="#contact" className="text-sm font-medium text-gray-700 hover:text-[#F04952]">
              Contact
            </a>
            <a
              href={process.env.NEXT_PUBLIC_ADMIN_URL}
              target="_blank"
              className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-gray-950 text-white text-sm font-semibold rounded-md shadow hover:bg-gray-900 transition-all duration-200"
            >
              <FontAwesomeIcon icon={faRightToBracket} className="w-4 h-4" />
              <span>Admin</span>
            </a>
          </div>
        </details>
      </nav>
    </header>
  );
};

export default Navbar;
