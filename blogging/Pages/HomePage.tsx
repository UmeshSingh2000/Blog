"use client";

import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Eye } from "lucide-react";
/* --------------------------------------------------
   MAIN HOMEPAGE COMPONENT
-------------------------------------------------- */
export default function HomePageMerged() {
  return (
    <>
      <HeroMinimal />
      <FeaturedArticles />
    </>
  );
}

/* --------------------------------------------------
   SECTION 1 — MINIMALISTIC HERO
-------------------------------------------------- */
function HeroMinimal() {
  const [weatherData, setWeatherData] = useState<any[]>([]);
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 6;

  useEffect(() => {
    async function fetchWeather() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/feature/weather`
        );
        if (response.ok) {
          const res = await response.json();
          setWeatherData(res);
        }
      } catch (error) {
        console.error("Error fetching weather:", error);
      }
    }
    fetchWeather();
  }, []);

  const handleNext = () => {
    if (startIndex + visibleCount < weatherData.length) {
      setStartIndex(startIndex + visibleCount);
    }
  };

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(0, prev - visibleCount));
  };

  const visibleCards = weatherData.slice(startIndex, startIndex + visibleCount);

  return (
    <section className="relative w-full max-w-[1920px] mx-auto h-[480px] md:h-[560px] flex items-center pl-6 mt-16 overflow-hidden ">

      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/iskra-photography-AtRYCQGiJ_w-unsplash.jpg"
          alt="Hero background"
          fill
          className="object-cover object-bottom brightness-[0.55]"
        />
      </div>

      {/* HERO CONTENT */}
      <div className="w-full z-10">
        <h1 className="text-white text-4xl md:text-6xl font-semibold leading-tight">
          Find Places<br />That Make You Feel{" "}
          <span className="text-[#F04952] font-bold">Alive.</span>
        </h1>

        <p className="text-white/90 text-base md:text-lg mt-4 max-w-md">
          Simple stories, powerful experiences — curated for explorers.
        </p>

        <button className="mt-6 px-5 py-2.5 bg-[#F04952] text-white text-sm md:text-base font-medium rounded-md shadow hover:bg-[#d63c46] transition">
          <a href="/blogs">Explore Blogs</a>
        </button>
      </div>

      {/* WEATHER WIDGET */}
      <div className="absolute hidden md:flex flex-col gap-4 bottom-6 right-6 z-20">
        <div className="flex gap-3 overflow-hidden">
          {visibleCards.map((w, idx) => (
            <div
              key={idx}
              className="bg-white/10 text-white px-4 py-3 rounded-md min-w-[160px] backdrop-blur-md border border-white/10"
            >
              <h3 className="text-sm font-medium">{w.city}</h3>
              <p className="text-2xl font-bold">{w.temperature}°C</p>
              <p className="text-xs opacity-80">{w.description}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2 justify-end">
          <button
            onClick={handlePrev}
            disabled={startIndex === 0}
            className="w-9 h-9 bg-white/20 text-white rounded-full flex items-center justify-center"
          >
            <ChevronLeft />
          </button>

          <button
            onClick={handleNext}
            disabled={startIndex + visibleCount >= weatherData.length}
            className="w-9 h-9 bg-white/20 text-white rounded-full flex items-center justify-center"
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------
   SECTION 2 — FEATURED ARTICLES SLIDER (PREMIUM UI)
-------------------------------------------------- */
function FeaturedArticles() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [index, setIndex] = useState(0);

  const CACHE_KEY = "recentBlogsCache";
  const CACHE_DURATION = 1000 * 60 * 5; // 5 minutes

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/getBlogs?limit=8`
      );

      const data = response.data.blogs;

      // Save entire list in cache (same as RecentArticles)
      const cacheObj = {
        timestamp: Date.now(),
        data,
      };

      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheObj));

      // Featured shows only first 3
      setBlogs(data.slice(0, 3));
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  useEffect(() => {
    // Check cache
    const cached = localStorage.getItem(CACHE_KEY);

    if (cached) {
      const parsed = JSON.parse(cached);
      const isExpired = Date.now() - parsed.timestamp > CACHE_DURATION;

      if (!isExpired) {
        // Use cached blogs — only first 3
        setBlogs(parsed.data.slice(0, 3));
        return;
      }
    }

    // Otherwise fetch new
    fetchBlogs();
  }, []);

  if (blogs.length === 0)
    return (
      <div className="w-full flex justify-center">
        <p className="text-gray-500">Loading featured articles...</p>
      </div>
    );

  const next = () => setIndex((prev) => (prev + 1) % blogs.length);
  const prev = () => setIndex((prev) => (prev - 1 + blogs.length) % blogs.length);

  return (
    <section className="w-full flex flex-col items-center mt-9 mb-20 ">

      <div className="mb-4">
        <Image src="/pt.png" alt="PT Logo" width={70} height={70} />
      </div>

      <h2 className="text-3xl font-bold text-center tracking-tight">
        Must-Read Articles
      </h2>

      <p className="text-gray-500 text-sm text-center mt-2">
        My best articles — recommended for everyone
      </p>

      {/* SLIDER */}
      <div className="relative w-full mt-10 overflow-hidden shadow-xl h-[350px] md:h-[420px]">

        <div
          className="flex h-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {blogs.map((b) => (
            <div key={b._id} className="w-full min-w-full h-full relative">
              <Image src={b.coverImage.url} alt={b.title} fill className="object-cover" />

              <div className="absolute inset-0 bg-black/40 backdrop-blur-xs"></div>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-6 text-center">

                {/* Meta */}
                <div className="flex items-center gap-4 mb-5 text-sm font-medium opacity-95 flex-wrap justify-center">
                  <span className="px-4 py-1.5 bg-white/15 rounded-full border border-white/20 flex items-center gap-2">
                    👤 {b.author?.name}
                  </span>

                  <span className="px-4 py-1.5 bg-white/15 rounded-full border border-white/20 capitalize flex items-center gap-2">
                    📂 {b.category}
                  </span>

                  <span className="px-4 py-1.5 bg-white/15 rounded-full border border-white/20 flex items-center gap-2">
                    <Eye/> {b.views}
                  </span>
                </div>

                <h3 className="text-xl md:text-2xl font-medium max-w-2xl">
                  {b.title}
                </h3>

                <p className="text-white/90 text-sm md:text-md mt-3 max-w-2xl hidden md:block">
                  {b.excerpt}
                </p>

                <a
                  href={`/blog/${b.slug}`}
                  className="mt-6 px-6 py-2.5 text-sm bg-white/90 text-gray-900 font-semibold rounded-md hover:bg-white transition"
                >
                  Read More
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Arrows */}
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg"
        >
          <ChevronLeft />
        </button>

        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg"
        >
          <ChevronRight />
        </button>
      </div>
    </section>
  );
}

