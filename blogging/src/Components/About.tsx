"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "@/context/ThemeContext";

export default function AboutPage() {
    const { theme } = useTheme();

    const [writers, setWriters] = useState<any[]>([]);
    const DEFAULT_PIC = "/default User.png";

    useEffect(() => {
        const cached = localStorage.getItem("writers");
        if (cached) setWriters(JSON.parse(cached));
    }, []);

    return (
        <main className={`min-h-screen mt-20 ${theme === "dark" ? "bg-[#1A1A1A] text-white" : "bg-white text-black"}`}>


            {/* ---------------- HERO ---------------- */}
            <section className="max-w-7xl mx-auto px-6 pt-28 pb-20">
                <div className="grid md:grid-cols-2 gap-16 items-center">

                    {/* Image */}
                    <div className="relative">
                        <div className="relative w-full h-80 md:h-[420px] rounded-xl overflow-hidden shadow-md">
                            <img
                                src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&auto=format&fit=crop"
                                alt="About PotatoTrails"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Text */}
                    <div className="space-y-6">
                        <span className="text-sm font-semibold tracking-widest text-[#F04952] uppercase">
                            Our Story
                        </span>

                        <h1 className="text-5xl font-semibold tracking-tight">
                            About{" "}
                            <span className="text-[#F04952]">PotatoTrails</span>
                        </h1>

                        <p className={`text-lg leading-relaxed ${theme === "dark" ? "text-white" : "text-black"}`}>
                            PotatoTrails is your modern travel journal — where stories of adventure,
                            food, places, and cultures come together.
                        </p>
                        <p className={`text-lg leading-relaxed ${theme === "dark" ? "text-white" : "text-black"}`}>
                            Our mission: inspire exploration, celebrate cultures, and share meaningful
                            journeys.
                        </p>
                        <p className={`text-lg leading-relaxed ${theme === "dark" ? "text-white" : "text-black"}`}>
                            We bring real stories, honest experiences, and fresh perspectives from travelers
                            across the world.
                        </p>

                        {/* Stats */}
                        {/* <div className="grid grid-cols-3 gap-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                            {[
                                { label: "Stories", value: "500+" },
                                { label: "Readers", value: "50k+" },
                                { label: "Countries", value: "80+" },
                            ].map((stat, i) => (
                                <div key={i}>
                                    <div className="text-2xl font-semibold text-[#F04952]">{stat.value}</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div> */}
                    </div>
                </div>
            </section>



            {/* ---------------- VALUES ---------------- */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl font-semibold">Our Values</h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-3">
                            What guides the stories we tell
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: "🌍",
                                title: "Authenticity",
                                desc: "Real experiences from real travelers.",
                            },
                            {
                                icon: "🍜",
                                title: "Culture",
                                desc: "Celebrating traditions with respect.",
                            },
                            {
                                icon: "✨",
                                title: "Inspiration",
                                desc: "Encouraging everyone to explore.",
                            },
                        ].map((value, i) => (
                            <div
                                key={i}
                                className="p-8 bg-white rounded-xl border border-gray-200 shadow-sm"
                            >
                                <div className="text-4xl mb-4">{value.icon}</div>
                                <h3 className="text-xl font-medium mb-2 text-black">{value.title}</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {value.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>



            {/* ---------------- WRITERS (DYNAMIC) ---------------- */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl font-semibold">Meet Our Writers</h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-3">
                            The people behind the stories
                        </p>
                    </div>

                    {writers.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                            {writers.map((writer: any) => (
                                <div key={writer._id} className="text-center">
                                    <div className="w-36 h-36 mx-auto rounded-full overflow-hidden shadow-md">
                                        <Image
                                            src={writer.profilePicture || DEFAULT_PIC}
                                            alt={writer.name}
                                            width={200}
                                            height={200}
                                            className="object-cover w-full h-full"
                                        />
                                    </div>

                                    <h3 className="mt-4 text-xl font-medium">{writer.name}</h3>
                                    <p className="text-[#F04952] text-sm mt-1">
                                        {writer.title || "Writer"}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500">Loading writers...</p>
                    )}
                </div>
            </section>



            {/* ---------------- CTA ---------------- */}
            <section className="py-20 bg-[#F04952] text-white">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-semibold mb-4">Want to Collaborate?</h2>
                    <p className="text-lg text-white/90 mb-8">
                        Have a story, idea, or contribution for PotatoTrails? Let’s connect.
                    </p>

                    <a
                        href="/contact"
                        className="inline-block bg-white text-[#F04952] px-8 py-3 rounded-md font-medium shadow-sm hover:bg-gray-100 transition"
                    >
                        Contact Us
                    </a>
                </div>
            </section>

        </main>
    );
}
