"use client"
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

interface Blog {
  title: string;
  _id: string;
  author: {
    _id: string;
    name: string;
    email: string;
    profilePicture?: string;
  };
  tags: {
    _id: string;
    name: string;
  }[];
  excerpt: string;
  coverImage: {
    url: string;
    subtitle: string;
  };
  views: number;
  slug: string;
  category: string;
}

interface CardProps {
  blog: Blog;
}

const Card: React.FC<CardProps> = ({ blog }) => {
  const { theme } = useTheme();
  return (
    <div className={`w-full rounded-md ${theme === "dark" ? "transparent text-white" : "bg-gray-100 text-black"}`}>

      {/* IMAGE */}
      <div className="w-full h-40 overflow-hidden rounded-md">
        <Image
          src={blog.coverImage.url}
          alt={blog.title}
          width={400}
          height={300}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-2">

        {/* META INFO */}
        <div className={`flex items-center gap-3 mt-3 text-xs ${theme === "dark" ? "text-white" : "text-gray-600"}`}>
          <span className={`px-2 py-1 rounded capitalize ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`}>
            {blog.category}
          </span>

          <span>👤 {blog.author?.name}</span>

          <span className="flex items-center gap-1">
            <Eye size={16} /> {blog.views}
          </span>
        </div>

        {/* TITLE */}
        <h3 className="text-sm font-semibold mt-2 mb-1 line-clamp-1">
          {blog.title}
        </h3>

        {/* EXCERPT */}
        <p className={`text-xs leading-relaxed line-clamp-3 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
          {blog.excerpt}
        </p>

        {/* READ MORE */}
        <Link
          href={`/blog/${blog.slug}`}
          className="block text-xs mt-2 text-[#EB5359] font-medium hover:underline"
        >
          Read More
        </Link>
      </div>
    </div>
  );
};

export default Card;
