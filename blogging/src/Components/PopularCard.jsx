'use client'
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const PopularCard = ({ blog }) => {
    return (
        <motion.div
            className="flex flex-col md:flex-row gap-4 p-4 mt-5 rounded-lg max-w-4xl mx-auto"
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
        >
            {/* Cover Image */}
            <div className="w-full md:w-52 rounded-md overflow-hidden">
                <Image
                    src={blog.coverImage?.url}
                    alt={blog.coverImage?.subtitle || blog.title}
                    width={500}
                    height={500}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Content */}
            <div className="flex flex-col w-full md:w-2/3">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                        {blog.title}
                    </h2>
                    <p className="text-sm md:text-md text-gray-600 mt-2">
                        {blog.excerpt}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mt-3">
                        {blog.tags?.slice(0, 3).map(tag => (
                            <span
                                key={tag._id}
                                className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                            >
                                #{tag.name}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Author + Button */}
                <div className="flex items-center justify-between mt-4">
                    {/* Author */}
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full overflow-hidden">
                            <Image
                                src={blog.author?.profilePicture}
                                alt={blog.author?.name}
                                width={28}
                                height={28}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                            {blog.author?.name}
                        </span>
                    </div>

                    {/* Button */}
                    <button className="bg-red-500 text-white text-sm font-medium px-4 py-1.5 rounded-md hover:bg-red-600 cursor-pointer transition">
                        Read more
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default PopularCard;
