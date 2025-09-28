"use client";
import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const HomePage = () => {
  const { scrollYProgress } = useScroll();
  const [weatherData, setWeatherData] = useState<any[]>([]);
  const [startIndex, setStartIndex] = useState(0); // start index for visible cards
  const visibleCount = 6; // how many cards are visible at a time

  // Scale background between 1 and 1.6 as you scroll
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.6]);
  const textScale1 = useTransform(scrollYProgress, [0, 1], [1, 0.7]);
  const textScale2 = useTransform(scrollYProgress, [0, 1], [1, 0.6]);
  const buttonScale = useTransform(scrollYProgress, [0, 1], [1, 0.5]);

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
    if (startIndex - visibleCount >= 0) {
      setStartIndex(startIndex - visibleCount);
    } else {
      setStartIndex(0);
    }
  };

  const visibleCards = weatherData.slice(startIndex, startIndex + visibleCount);

  return (
    <section className="relative w-full max-w-[1920px] mx-auto h-[500px] md:h-[600px] flex items-center md:items-start pl-4 mt-16 overflow-hidden">
      {/* Background Image */}
      <motion.div
        style={{ scale: bgScale }}
        className="absolute inset-0 -z-10 w-full h-full"
      >
        <Image
          src="/iskra-photography-AtRYCQGiJ_w-unsplash.jpg"
          alt="Hero background"
          fill
          className="object-cover object-bottom"
          priority
        />
      </motion.div>

      {/* Weather Widget */}
      <div className="absolute hidden z-50 bottom-6 left-6 md:flex flex-col md:flex-row gap-4">
        {/* Cards */}
        <div className="flex gap-4 overflow-hidden">
          {visibleCards.map((weather, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}       // start invisible and slightly below
              animate={{ opacity: 1, y: 0 }}        // animate to visible and in place
              transition={{ duration: 0.4, delay: idx * 0.1 }} // stagger cards
              className="bg-black/40 text-white p-4 rounded-lg shadow-lg backdrop-blur-md min-w-[200px]"
            >
              <h3 className="text-lg font-semibold">{weather.city}</h3>
              <p className="text-3xl font-bold">{weather.temperature}°C</p>
              <p className="text-sm italic">{weather.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Buttons: stacked below on mobile, side on desktop */}
        <div className="flex gap-2 items-center mt-2 md:mt-0">
          <button
            onClick={handlePrev}
            disabled={startIndex === 0}
            className={`bg-black/50 cursor-pointer text-white p-2 rounded-full hover:bg-black/70 ${startIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
          >
            <ChevronLeft />
          </button>
          <button
            onClick={handleNext}
            disabled={startIndex + visibleCount >= weatherData.length}
            className={`bg-black/50 cursor-pointer text-white p-2 rounded-full hover:bg-black/70 ${startIndex + visibleCount >= weatherData.length
              ? "opacity-50 cursor-not-allowed"
              : ""
              }`}
          >
            <ChevronRight />
          </button>
        </div>
      </div>


      {/* Text Content */}
      <div className="w-full relative z-10">
        <motion.p
          style={{ scale: textScale1 }}
          className="text-white text-4xl md:text-7xl font-bold italic pt-10"
        >
          “Go where you
          feel <br /> most
          <span className="text-[#F04952]"> alive.</span>
        </motion.p>

        <motion.p
          style={{ scale: textScale2 }}
          className="text-white text-md md:text-xl mt-4 font-light tracking-wide"
        >
          Discover stories that spark your next adventure
        </motion.p>

        <motion.div style={{ scale: buttonScale }} className="mt-6">
          <button className="flex cursor-pointer items-center justify-center gap-2 px-4 py-2 bg-[#F04952] text-white font-semibold rounded-md shadow-lg">
            <a href="/blogs">Explore</a>
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default HomePage;
