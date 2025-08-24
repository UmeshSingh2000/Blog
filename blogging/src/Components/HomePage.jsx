"use client";
import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

const HomePage = () => {
  const { scrollYProgress } = useScroll();

  // Scale background between 1 and 1.6 as you scroll
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.6]);
  const textScale1 = useTransform(scrollYProgress, [0, 1], [1, 0.5]);
  const textScale2 = useTransform(scrollYProgress, [0, 1], [1, 0.4]);

  // Button scales same way as text
  const buttonScale = useTransform(scrollYProgress, [0, 1], [1, 0.3]);

  return (
    <section className="relative h-[400px] md:h-screen flex items-center md:items-start pl-4 m-4 rounded-xl overflow-hidden">
      {/* Background Image with scroll zoom */}
      <motion.div style={{ scale: bgScale }} className="absolute inset-0 -z-10">
        <Image
          src="/iskra-photography-AtRYCQGiJ_w-unsplash.jpg"
          alt="Hero background"
          fill
          className="object-cover object-bottom"
          priority
        />
      </motion.div>

      {/* Text Content */}
      <div className="w-full relative z-10">
        <motion.p
          style={{ scale: textScale1 }}
          className="text-white text-4xl md:text-8xl font-bold italic pt-10"
        >
          “Go where you
          feel <br /> most
          <span className="text-[#F04952]"> alive.</span>
        </motion.p>

        <motion.p
          style={{ scale: textScale2 }}
          className="text-white text-md md:text-2xl mt-4 font-light tracking-wide"
        >
          Discover stories that spark your next adventure
        </motion.p>

        {/* Button scales on scroll */}
        <motion.div style={{ scale: buttonScale }} className="mt-6">
          <button
            className="flex cursor-pointer items-center justify-center gap-2 px-4 py-2 
             bg-[#F04952] text-white font-semibold rounded-md shadow-lg"
          >
            <a href="#blogs">Explore</a>
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default HomePage;
