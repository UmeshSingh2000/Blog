import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye } from "lucide-react";

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
  return (
    <div className="w-full">

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

      {/* META INFO */}
      <div className="flex items-center gap-3 mt-3 text-xs text-gray-600">
        <span className="px-2 py-1 bg-gray-200 rounded capitalize">
          {blog.category}
        </span>

        <span>👤 {blog.author?.name}</span>

        <span className="flex items-center gap-1">
          <Eye size={16} /> {blog.views}
        </span>
      </div>

      {/* TITLE */}
      <h3 className="text-sm font-semibold mt-2 mb-1">
        {blog.title}
      </h3>

      {/* EXCERPT */}
      <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
        {blog.excerpt}
      </p>

      {/* READ MORE */}
      <Link
        href={`/blog/${blog.slug}`}
        className="block text-xs mt-2 text-gray-800 font-medium hover:underline"
      >
        Read More
      </Link>
    </div>
  );
};

export default Card;
