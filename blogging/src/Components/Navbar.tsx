"use client";
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Image from "next/image";
import { Menu, ArrowLeft, Instagram, Github, Linkedin, AmpersandIcon, KeyRound } from "lucide-react";
import { Moon, Sun } from "lucide-react";
import axios from "axios";

const categories = [
  "Travel", "Architecture", "Technology", "Culture",
  "Food", "Creativity", "Music",
];

// You can fetch real blogs — here placeholders for UI demo
const sampleBlogs = [
  { title: "10 Best Places to Travel in Winter", slug: "winter-travel" },
  { title: "Why Food Culture Matters", slug: "food-culture" },
  { title: "How Technology is Changing Travel", slug: "tech-travel" },
];



const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [blogPopup, setBlogPopup] = useState(false);
  const [rightMenuOpen, setRightMenuOpen] = useState(false);
  const [theme, setTheme] = useState("light");
  const popupRef = useRef<HTMLDivElement | null>(null);
  const [randomBlogs, setRandomBlogs] = useState([]);
  const fetchRandomBlogs = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/getRandomBlogs`);
      setRandomBlogs(response.data.blogs || []);
    }
    catch (error) {
      console.error("Failed to fetch random blogs:", error);
    }
  }

  useEffect(() => {
    fetchRandomBlogs();
  }, [])
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
      setBlogPopup(false);
    };

    const handleOutside = (e: any) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setBlogPopup(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleOutside);
    };
  }, []);

  const popupVariants: Variants = {
    hidden: { opacity: 0, y: -20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  };

  const rightMenuVariants: Variants = {
    hidden: { x: "100%" },
    show: { x: "0%", transition: { duration: 0.35, ease: "easeOut" } },
    exit: { x: "100%", transition: { duration: 0.25 } },
  };
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    if (rightMenuOpen) {
      html.style.overflow = "hidden";
      body.style.overflow = "hidden";
    } else {
      html.style.overflow = "auto";
      body.style.overflow = "auto";
    }

    return () => {
      html.style.overflow = "auto";
      body.style.overflow = "auto";
    };
  }, [rightMenuOpen]);

  useEffect(() => {

    const wrapper = document.getElementById("page-wrapper");
    const navbar = document.getElementById("navbar-wrapper");

    if (!wrapper || !navbar) return;

    if (rightMenuOpen) {
      wrapper.style.transform = "translateX(-120px) scale(0.98)";
      navbar.style.transform = "translateX(-120px)";
    } else {
      wrapper.style.transform = "translateX(0px) scale(1)";
      navbar.style.transform = "translateX(0px)";
    }

    return () => {
      wrapper.style.transform = "translateX(0px) scale(1)";
      navbar.style.transform = "translateX(0px)";
    };
  }, [rightMenuOpen]);



  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const current = saved || "light";

    setTheme(current);
    document.documentElement.classList.toggle("dark", current === "dark");
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };






  return (
    <>
      {/* NAVBAR */}
      <header
        className={`fixed w-full top-0 z-[999] transition-all duration-300 ${scrolled
          ? "backdrop-blur-xl bg-white/70 shadow-sm border-b border-white/20 py-2"
          : "backdrop-blur-lg bg-white/30 py-4 border-b border-transparent"
          }`}
      >
        <nav id="navbar-wrapper" className="max-w-7xl mx-auto flex items-center justify-between px-4 transition-all duration-500">

          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <Image src="/pt.png" width={48} height={48} alt="Logo" />
            <span className="font-semibold tracking-tight text-lg text-gray-800 hidden sm:inline">
              Potato<span className="text-[#F04952]">Trails</span>
            </span>
          </a>

          {/* Desktop navigation */}
          <ul className="hidden md:flex items-center gap-6">
            {[
              { name: "Home", href: "/" },
              { name: "About", href: "/about" },
              { name: "Blogs", href: "/blogs" },
              { name: "Shop", href: "/shop" },
              { name: "Contact", href: "/contact" },
            ].map((item) => (
              <li
                key={item.name}
                className="group relative"
                onMouseEnter={() => item.name === "Blogs" && setBlogPopup(true)}
                onMouseLeave={() => setBlogPopup(false)}
              >
                <a className="text-sm text-gray-700 hover:text-[#F04952]" href={item.href}>
                  {item.name}
                </a>
                <span className="absolute left-0 -bottom-[3px] w-0 h-[2px] bg-[#F04952] transition-all duration-300 group-hover:w-full"></span>

                {/* CATEGORY DROPDOWN - NOW CORRECTLY POSITIONED */}
                <AnimatePresence>
                  {item.name === "Blogs" && blogPopup && (
                    <motion.div
                      ref={popupRef}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.18 }}
                      className="
          absolute top-full left-0 mt-2
          bg-white 
          border border-gray-200 
          py-3 w-48 z-[999]
        "
                    >
                      {categories.map((cat) => (
                        <a
                          key={cat}
                          href={`/blogs?category=${cat.toLowerCase()}`}
                          className="
              block px-4 py-2 text-sm text-gray-700 
              hover:bg-[#F04952] hover:text-white 
              transition
            "
                        >
                          {cat}
                        </a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>

            ))}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button
              onClick={() => setRightMenuOpen(true)}
              className="text-gray-800 text-2xl cursor-pointer md:text-3xl"
            >
              <ArrowLeft size={20} />
            </button>
          </ul>

          {/* RIGHT ICON → Open Right Menu */}

        </nav>
      </header>



      <AnimatePresence>
        {rightMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-[1000]"
              onClick={() => setRightMenuOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              variants={rightMenuVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              className="
          fixed right-0 top-0 h-full w-[330px]
          bg-white shadow-xl z-[1100] 
          flex flex-col p-5 overflow-y-auto
        "
            >
              {/* Close Button */}
              <button
                className="text-xl text-gray-600 hover:text-gray-900 self-end mb-6"
                onClick={() => setRightMenuOpen(false)}
              >
                ✕
              </button>

              {/* ---------------------------------- */}
              {/* LIST OF POSTS */}
              {/* ---------------------------------- */}

              <h3 className="text-xs font-semibold text-gray-500 tracking-wider mb-3">
                LIST OF POSTS
              </h3>

              <div className="space-y-6 mb-10">
                {sampleBlogs.map((post, i) => (
                  <a key={i} href={`/blog/${post.slug}`} className="block group">
                    <div className="w-full h-28 rounded-md overflow-hidden mb-2">
                      <img
                        src="https://demo.birdwp.com/orin/wp-content/uploads/2021/08/florencia-potter-QCRdeq27OEU-unsplash.jpg"
                        alt={post.title}
                        width={400}
                        height={200}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                    </div>
                    <p className="text-sm font-semibold text-gray-800">
                      {post.title}
                    </p>
                    <p className="text-xs text-gray-500">August 15, 2024</p>
                  </a>
                ))}
              </div>

              {/* ---------------------------------- */}
              {/* POPULAR POSTS */}
              {/* ---------------------------------- */}

              <h3 className="text-xs font-semibold text-gray-500 tracking-wider mb-3">
                POPULAR POSTS
              </h3>

              <div className="space-y-4 mb-10">
                {sampleBlogs.map((post, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="
                w-6 h-6 flex items-center justify-center 
                rounded-full bg-gray-200 text-xs font-semibold text-gray-700
              ">
                      {index + 1}
                    </span>

                    <a href={`/blog/${post.slug}`}>
                      <p className="text-sm font-semibold text-gray-900">{post.title}</p>
                      <p className="text-xs text-gray-500">2 min read • 4.9k views</p>
                    </a>
                  </div>
                ))}
              </div>

              {/* ---------------------------------- */}
              {/* RANDOM POSTS */}
              {/* ---------------------------------- */}

              <h3 className="text-xs font-semibold text-gray-500 tracking-wider mb-3">
                RANDOM POSTS
              </h3>

              <div className="space-y-4 mb-10">
                {randomBlogs.length > 0 ? (
                  randomBlogs.map((post: any, i) => (
                    <a
                      key={post._id}
                      href={`/blog/${post.slug}`}
                      className="flex items-center gap-3 group"
                    >
                      <div className="w-1/4 h-14 rounded-md overflow-hidden">
                        <img
                          src={post.coverImage?.url}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition"
                        />
                      </div>

                      <div className="w-3/4">
                        <p className="text-sm font-semibold text-gray-800 group-hover:text-[#F04952] transition line-clamp-2">
                          {post.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </a>
                  ))
                ) : (
                  <p className="text-xs text-gray-400">Loading...</p>
                )}
              </div>

              {/* ---------------------------------- */}
              {/* SOCIAL ICONS */}
              {/* ---------------------------------- */}

              <h3 className="text-xs font-semibold text-gray-500 tracking-wider mb-3">
                LINKS
              </h3>

              <div className="flex gap-4 mb-6">
                <a href="#" className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200">
                  <Instagram size={18} />
                </a>
                <a href="#" className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200">
                  <Github size={18} />
                </a>
                <a href="#" className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200">
                  <Linkedin size={18} />
                </a>
                <a href={process.env.NEXT_PUBLIC_ADMIN_URL} className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200">
                  <KeyRound size={18} />
                </a>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

    </>
  );
};

export default Navbar;
