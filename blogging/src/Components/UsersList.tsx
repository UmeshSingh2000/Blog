"use client";

import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function UsersList() {
    const [writers, setWriters] = useState([]);

    const DEFAULT_PIC =
        "/default User.png"; // fallback photo

    // Fetch from API + Cache in localStorage
    const fetchWriters = async () => {
        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/getWriters`
            );

            const data = response.data;

            // Save to state + cache
            setWriters(data);
            localStorage.setItem("writers", JSON.stringify(data));
        } catch (error) {
            console.error("Error fetching writers:", error);
        }
    };

    useEffect(() => {
        // Load from cache first
        const cached = localStorage.getItem("writers");
        if (cached) {
            setWriters(JSON.parse(cached));
        }

        // Fetch fresh data
        fetchWriters();
    }, []);

    return (
        <section className="w-full py-10">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <h2 className="text-2xl font-semibold mb-10 text-center">Our Writers</h2>

                {/* Team Grid — CENTER CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 
                        gap-10 place-items-center">
                    {writers.length > 0 ? (
                        writers.map((user: any) => (
                            <div key={user._id} className="flex flex-col items-center w-full max-w-[250px]">
                                {/* Image Block */}
                                <div className="w-full rounded-full h-64 overflow-hidden">
                                    <Image
                                        src={user.profilePicture || DEFAULT_PIC}
                                        alt={user.name}
                                        width={500}
                                        height={500}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Text */}
                                <p className="mt-3 text-gray-900 font-medium text-center">{user.name}</p>
                                <p className="text-gray-600 text-sm text-center">{user.title}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-600">Loading writers...</p>
                    )}
                </div>
            </div>
        </section>
    );
}
