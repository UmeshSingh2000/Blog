'use client'
import Image from "next/image";
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const About = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const textScale1 = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);
  const textScale2 = useTransform(scrollYProgress, [0, 0.5], [0.5, 1]);
  const infoTransform = useTransform(scrollYProgress, [0, 0.5], ["-10px", "0px"]);
  const footerTransform = useTransform(scrollYProgress, [0, 1], ["200px", "-100px"]);
  const bgColorTransform = useTransform(scrollYProgress, [0, 0.7], ["#ffffff", "#E8E8E8"]);

  return (
    <motion.section
      ref={ref}
      id="about"
      style={{ backgroundColor: bgColorTransform }}
      className="relative w-full max-w-[1920px] mx-auto p-5 md:px-8 md:py-20"
    >
      {/* Top Grid */}
      <div className="grid md:grid-cols-2 gap-4 md:gap-12 items-start">
        {/* Left */}
        <div className="space-y-6 md:px-20">
          <header>
            <motion.h1
              className="text-4xl md:text-6xl font-bold leading-snug"
              
            >
              Who we are and{" "}
              <span className="bg-[#F04952] text-white px-2">what we do</span>
            </motion.h1>
            <motion.p
              
              className="text-gray-700 text-lg"
            >
              Meet the Traveler Behind the Stories
            </motion.p>
          </header>

          <motion.footer
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="flex items-center gap-3"
          >
            <motion.img
              src="https://res.cloudinary.com/dtxqmoevl/image/upload/f_auto,q_auto,w_100/v1750961474/blog_images/profile_pictures/civ76ydodgjmiuvlzehr.jpg"
              alt="Admin Profile"
              className="rounded-full object-cover z-10 w-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
            />
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
             
            >
              <h2 className="font-semibold text-gray-900">Lalit Singh</h2>
              <p className="text-sm text-[#F04952]">Town Planner</p>
            </motion.div>
          </motion.footer>
        </div>

        {/* Right */}
        <div className="text-gray-700 text-md leading-relaxed space-y-6 md:w-3/4">
          <motion.p
            
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
          >
            We are passionate travelers and storytellers, exploring unique
            destinations and sharing our experiences with the world. Our goal
            is to inspire your adventures through engaging stories, practical
            tips, and insights into local culture.
          </motion.p>
          <motion.p
            
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
          >
            We also focus on promoting sustainable and responsible travel,
            helping readers discover the beauty of the world while preserving
            it for future generations.
          </motion.p>
        </div>
      </div>

      {/* Bottom Tagline */}
      <div className="text-left md:text-center overflow-hidden">
        <motion.h2
          className="text-4xl md:text-8xl font-extrabold tracking-tight whitespace-nowrap"
          style={{ x: footerTransform }}
        >
          Your Next <span className="text-[#F04952]">Adventure</span> Awaits
        </motion.h2>
      </div>
    </motion.section>
  );
};

export default About;
