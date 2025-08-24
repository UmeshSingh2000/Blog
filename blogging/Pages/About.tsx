'use client'
import Image from "next/image";
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const About = () => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });


    const textScale = useTransform(scrollYProgress, [0, 0.5], [1.5, 1])
    const imageScale = useTransform(scrollYProgress, [0, 0.5], [2, 1])
    const infoTransform = useTransform(scrollYProgress, [0, 0.5], ['-100px', '0px'])

    const footerTransform = useTransform(scrollYProgress, [0, 1], ['200px', '-100px'])

    return (
        <section ref={ref} className="px-8 py-20">
            {/* Top Grid */}
            <div className="grid md:grid-cols-2 gap-12 items-start">
                {/* Left */}
                <div className="space-y-6 px-11 md:px-20">
                    <header>
                        <motion.h1 className="text-4xl md:text-6xl font-bold leading-snug" style={{ scale: textScale }}>
                            Who we are <br />
                            and{" "}
                            <span className="bg-[#F04952] text-white px-2">
                                what we do
                            </span>
                        </motion.h1>
                        <motion.p
                            style={{ scale: textScale }}
                            className="text-gray-700 text-lg"
                        >
                            Meet the Traveler Behind the Stories
                        </motion.p>
                    </header>

                    <motion.footer
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="flex items-center gap-3">
                        <motion.img
                            src="https://res.cloudinary.com/dtxqmoevl/image/upload/f_auto,q_auto,w_100/v1750961474/blog_images/profile_pictures/civ76ydodgjmiuvlzehr.jpg"
                            alt="Admin Profile"
                            width={50}
                            height={50}
                            className="rounded-full object-cover z-10"
                            style={{ scale: imageScale }}
                        />
                        <motion.div
                            style={{ x: infoTransform }}
                        >
                            <h2 className="font-semibold text-gray-900">Lalit Singh</h2>
                            <p className="text-sm text-[#F04952]">Town Planner</p>
                        </motion.div>
                    </motion.footer>
                </div>

                {/* Right */}
                <div className="text-gray-700 text-lg leading-relaxed space-y-6 w-3/4">
                    <motion.p
                        initial={{ scale: 0.8 }}
                        whileInView={{ scale: 1 }}
                    >
                        We are passionate travelers and storytellers, exploring unique
                        destinations and sharing our experiences with the world. Our goal
                        is to inspire your adventures through engaging stories, practical
                        tips, and insights into local culture.
                    </motion.p>
                    <motion.p
                        initial={{ scale: 0.7 }}
                        whileInView={{ scale: 1 }}
                    >
                        We also focus on promoting sustainable and responsible travel,
                        helping readers discover the beauty of the world while preserving
                        it for future generations.
                    </motion.p>
                </div>
            </div>

            {/* Bottom Tagline */}
            <div className="mt-20 text-left md:text-center overflow-hidden">
                <motion.h2 className="text-4xl md:text-8xl font-extrabold tracking-tight"
                    style={{ x: footerTransform }}
                >
                    Your Next{" "}
                    <span className="text-[#F04952]">Adventure</span>{" "}
                    Awaits
                </motion.h2>
            </div>
        </section>
    );
};

export default About;
