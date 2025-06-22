'use client'

import Footer from '@/Components/Footer'
import Loader from '@/Components/Loader/Loader'
import MarkdownRenderer from '@/Components/MarkdownRenderer'
import Navbar from '@/Components/Navbar'
import ProgressBar from '@/Components/ProgressBar'
import { notFound } from 'next/navigation'
import { useEffect, useState } from 'react'
import { use } from 'react'
import Subscribe from '@/Components/Subscribe'
export default function BlogDetailPage({ params }) {
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const { id } = use(params)
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/getblog/${id}`, {
          cache: 'no-store',
        })

        if (!res.ok) return notFound()

        const data = await res.json()
        setUserId(data.blog.author?._id || null)
        setBlog(data.blog)
      }
      catch (error) {
        console.error('Error fetching blog:', error)
        notFound()
      }
      finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])
  

  // if (!blog) return null
  if (loading) {
    return (
      <div className='h-screen flex items-center justify-center'>
        <Loader />
      </div>
    )
  }
  return (
    <>
      <Navbar />
      <ProgressBar />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold mb-2">{blog.title}</h1>
        <div className='flex items-center justify-between mb-6'>
          <p className="text-gray-600 mb-6 text-sm">By {blog.author?.name}</p>
          <p className="text-gray-500 text-xs mb-4"><span className="font-bold">Posted:</span>
            {new Date(blog.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <img
          src={blog.coverImage.url || blog.coverImage}
          alt={blog.title}
          className="rounded-xl w-full h-auto mb-2"
        />
        <figcaption className="text-center text-gray-500 text-sm italic">
          {blog.coverImage.subtitle || 'Cover Image'}
        </figcaption>
        {/* <div>
          <h1 className='font-bold'>Excert</h1>
          {blog.excerpt && <p className="text-gray-500 mb-6">{blog.excerpt}</p>}
        </div> */}
        <hr />
        <div className="prose prose-lg dark:prose-invert max-w-none mt-2">
          {blog.content.map((block, idx) => {
            if (block.type === 'content') {
              return <MarkdownRenderer key={idx} content={block.value} />
            } else if (block.type === 'image') {
              return (
                <figure key={idx} className="my-6">
                  <img
                    loading="lazy"
                    src={block.value}
                    alt={`Blog Image ${idx + 1}`}
                    className="rounded-xl w-full h-auto"
                  />
                  {block.subtitle && (
                    <figcaption className="mt-2 text-center text-gray-500 text-sm italic">
                      {block.subtitle}
                    </figcaption>
                  )}
                </figure>
              )
            } else {
              return null
            }
          })}
        </div>
      </div>
      <Subscribe userId={userId} />
      <Footer />
    </>
  )
}
