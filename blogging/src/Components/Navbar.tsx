"use client";
import React, { useEffect, useState } from "react";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion, AnimatePresence, Variants } from "framer-motion";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animation variants
  const menuVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.2 },
    },
    exit: {
      opacity: 0,
      transition: { staggerChildren: 0.08, staggerDirection: -1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1], // ✅ fixed easing (cubic-bezier)
      },
    },
    exit: {
      opacity: 0,
      y: 20,
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }, // ✅ added ease
    },
  };

  return (
    <header
      className={`w-full fixed top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/90 shadow-md py-2" : "bg-white py-4"
      }`}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 transition-all duration-300">
        {/* Logo */}
        <div
          className={`font-extrabold tracking-tight transition-all duration-300 ${
            scrolled ? "text-2xl text-gray-900" : "text-3xl text-gray-800"
          }`}
        >
          <a href="/">
            Potato<span className="text-[#F04952]">trails</span>
          </a>
        </div>

        {/* Desktop Nav Links */}
        <ul className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
          {["Home", "About", "Blogs", "Shop", "Contact"].map((item, idx) => (
            <li
              key={idx}
              className="hover:text-[#F04952] transition-colors duration-200"
            >
              <a href={item === "Blogs" ? "#blogs" : `/${item.toLowerCase()}`}>
                {item}
              </a>
            </li>
          ))}
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

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-3xl cursor-pointer"
        >
          ☰
        </button>
      </nav>

      {/* Mobile Fullscreen Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.42, 0, 0.58, 1] }}
            className="fixed inset-0 bg-white flex flex-col items-center justify-center z-40 md:hidden"
          >
            {/* Close Button */}
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-6 right-6 text-3xl text-gray-700 hover:text-[#F04952] transition-colors"
            >
              ✕
            </button>

            <motion.ul
              variants={menuVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              className="flex flex-col items-center gap-6"
            >
              {["Home", "Blogs", "Merch", "Contact"].map((item, idx) => (
                <motion.li
                  key={idx}
                  variants={itemVariants}
                  className="text-2xl font-semibold text-gray-800 hover:text-[#F04952] cursor-pointer"
                  onClick={() => setMenuOpen(false)}
                >
                  <a
                    href={
                      item === "Blogs"
                        ? "#blogs"
                        : item === "Merch"
                        ? "/merch"
                        : `/${item.toLowerCase()}`
                    }
                  >
                    {item}
                  </a>
                </motion.li>
              ))}

              <motion.li variants={itemVariants}>
                <a
                  href={process.env.NEXT_PUBLIC_ADMIN_URL}
                  target="_blank"
                  className="flex items-center justify-center gap-2 w-40 px-4 py-2 bg-[#F04952] text-white text-lg font-semibold rounded-md shadow hover:bg-gray-900 transition-all duration-200"
                >
                  <FontAwesomeIcon icon={faRightToBracket} className="w-5 h-5" />
                  <span>Admin</span>
                </a>
              </motion.li>
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
