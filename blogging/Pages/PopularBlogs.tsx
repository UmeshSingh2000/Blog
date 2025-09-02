'use client'
import React, { useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from "framer-motion";
import PopularCard from '@/Components/PopularCard';
import axios from 'axios';

const URL = process.env.NEXT_PUBLIC_API_URL;

export interface BlogTag {
  _id: string;
  name: string;
}

export interface BlogAuthor {
  _id: string;
  name: string;
  email: string;
  profilePicture: string;
}

export interface BlogCoverImage {
  url: string;
  public_id: string;
  subtitle?: string;
}

export interface Blog {
  _id: string;
  title: string;
  excerpt: string;
  status: "draft" | "published" | "archived";
  author: BlogAuthor;
  coverImage: BlogCoverImage;
  tags: BlogTag[];
  comments: any[]; // you can replace with Comment[] when ready
  views: number;
  category: string;
  createdAt?: string;
  updatedAt?: string;
}

const PopularBlogs = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const { scrollYProgress } = useScroll();
  const headingTransform = useTransform(scrollYProgress, [0, 0.5], ['-100px', '100px'])

  const fetchPopularBlog = async () => {
    try {
      setLoading(true);
      const response = await axios.get<{ blogs: Blog[] }>(`${URL}/getBlogs?limit=4`);
      if (response.data.blogs.length) {
        setBlogs(response.data.blogs);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPopularBlog()
  }, [])

  return (
      <div className="w-full max-w-[1920px] mx-auto">
    <div className='bg-[#E8E8E8] pb-2'>

        <header className='bg-amber-500 overflow-hidden'>
          <motion.h1
            className='text-4xl md:text-6xl font-bold '
            style={{ x: headingTransform }}
          >
            Top Stories.
          </motion.h1>
        </header>
        <section>
          {blogs.length > 0 ? (
            blogs.map((blog) => (
              <PopularCard key={blog._id} blog={blog} />
            ))
          ) : (
            <p>No popular blogs found.</p>
          )}
        </section>
      </div>
    </div>
  )
}

export default PopularBlogs
