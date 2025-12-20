"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { Eye } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const CACHE_KEY = "recentBlogsCache";
const CACHE_DURATION = 1000 * 60 * 5; // 5 minutes

export default function RecentArticles() {
    const { theme } = useTheme();
    const [blogs, setBlogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchBlogs = async () => {
        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/getBlogs?limit=8`
            );

            const data = response.data.blogs;

            const cacheObject = {
                timestamp: Date.now(),
                data,
            };

            localStorage.setItem(CACHE_KEY, JSON.stringify(cacheObject));

            setBlogs(data);
        } catch (error) {
            console.error("Error fetching blogs:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // const cached = localStorage.getItem(CACHE_KEY);

        // if (cached) {
        //     const parsed = JSON.parse(cached);
        //     const isExpired = Date.now() - parsed.timestamp > CACHE_DURATION;

        //     if (!isExpired) {
        //         setBlogs(parsed.data);
        //         setLoading(false);
        //         return;
        //     }
        // }

        fetchBlogs();
    }, []);

    if (loading)
        return (
            <section className="max-w-6xl mx-auto px-4 py-10">
                <p className="text-center text-gray-500">Loading articles...</p>
            </section>
        );

    if (blogs.length === 0)
        return (
            <section className="max-w-6xl mx-auto px-4 py-10">
                <p className="text-center text-gray-500">No articles found.</p>
            </section>
        );



    return (
        <div className={`${theme === "dark" ? "bg-[#1A1A1A]" : "bg-white"}`}>


            <section className="max-w-6xl mx-auto px-4 py-10">

                <h2 className={`text-3xl font-semibold text-center ${theme === "dark" ? "text-white" : "text-gray-900"} mb-1`}>
                    Recent Articles
                </h2>
                <p className="text-center text-gray-500 mb-10 text-sm">
                    All My Posts With Interesting Stories
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">

                    {/* FEATURED (FIRST BLOG) */}
                    {blogs.length > 0 && (
                        <div className={`lg:col-span-2 ${theme === "dark" ? "bg-[#1A1A1A] text-white" : "bg-gray-50"} rounded-md`}>
                            <div className="w-full h-64 lg:h-80 overflow-hidden shadow-sm rounded-md">
                                <Image
                                    src={blogs[0].coverImage.url}
                                    alt={blogs[0].title}
                                    width={900}
                                    height={500}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-2">

                                {/* META */}
                                <div className={`flex items-center gap-3 mt-3 text-xs ${theme === "dark" ? "text-white" : "text-gray-600"}`}>
                                    <span className="px-2 py-1 bg-gray-200 rounded capitalize text-gray-600">
                                        {blogs[0].category}
                                    </span>
                                    <span>👤 {blogs[0].author?.name}</span>
                                    <span className="flex items-center gap-1"><Eye size={16} /> {blogs[0].views}</span>
                                </div>

                                <h3 className="text-lg font-semibold mt-2 mb-2">
                                    {blogs[0].title}
                                </h3>

                                <p className={`text-sm leading-relaxed ${theme === "dark" ? "text-white" : "text-gray-600"}`}>
                                    {blogs[0].excerpt}
                                </p>

                                <a
                                    href={`/blog/${blogs[0].slug}`}
                                    className="block text-[#EB5359] text-xs mt-3 font-medium hover:underline"
                                >
                                    Read More
                                </a>
                            </div>
                        </div>
                    )}

                    {/* OTHER BLOGS */}
                    {blogs.slice(1).map((post, index) => (
                        <div key={post._id || index} className={`${theme === 'dark' ? 'bg-[#1A1A1A] text-white' : 'bg-gray-50'} rounded-md ${index === 0 ? 'h-80' : "h-auto"} `}>
                            <div className="w-full h-40 overflow-hidden shadow-sm rounded-md">
                                <Image
                                    src={post.coverImage.url}
                                    alt={post.title}
                                    width={400}
                                    height={300}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-2">


                                {/* META */}
                                <div className={`flex items-center gap-3 mt-3 text-xs ${theme === "dark" ? "text-white" : "text-gray-600"}`}>
                                    <span className="px-2 py-1 bg-gray-200 text-gray-600 rounded capitalize">
                                        {post.category}
                                    </span>
                                    <span>👤 {post.author?.name}</span>
                                    <span className="flex items-center gap-1"><Eye size={16} /> {post.views}</span>
                                </div>

                                <h3 className="text-sm font-semibold mt-2 mb-1">
                                    {post.title}
                                </h3>

                                <p className={`text-xs leading-relaxed line-clamp-3 ${theme === "dark" ? "text-white" : "text-gray-600"}`}>
                                    {post.excerpt}
                                </p>

                                <a
                                    href={`/blog/${post.slug}`}
                                    className="block text-[#EB5359] text-xs mt-2 font-medium hover:underline"
                                >
                                    Read More
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-center mt-12">
                    <a
                        href="/blogs"
                        className="px-6 py-2 bg-black text-white text-sm rounded-md hover:bg-gray-800 transition"
                    >
                        Browse All Blogs
                    </a>
                </div>

            </section>
        </div>
    );
}
