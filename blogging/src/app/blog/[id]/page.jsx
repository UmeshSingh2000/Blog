'use client'
import Footer from '@/Components/Footer'
import Loader from '@/Components/Loader/Loader'
import MarkdownRenderer from '@/Components/MarkdownRenderer'
import Subscribe from '@/Components/Subscribe'
import AboutTheAuthor from '@/Components/AboutTheAuthor'
import CommentSection from '@/Components/CommentSection'
import ImageModal from '@/Components/ImageModal'
import BlogSuggestion from '@/Components/BlogSuggestion'
import { notFound, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useTheme } from '@/context/ThemeContext'

export default function BlogDetailPage() {
  const { theme } = useTheme();
  const { id } = useParams()

  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState(null)

  // Image modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [images, setImages] = useState([])

  // Increment Views
  const incrementCount = async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/incrementCount/${id}`)
    } catch (error) {
      console.error("Error incrementing view count:", error)
    }
  }

  useEffect(() => {
    incrementCount()
  }, [])

  // Fetch Blog Data
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

        // Collect all images for modal
        const allImages = []

        // Cover
        if (data.blog.coverImage) {
          allImages.push({
            src: data.blog.coverImage.url || data.blog.coverImage,
            alt: data.blog.title,
            subtitle: data.blog.coverImage.subtitle || 'Cover Image'
          })
        }

        // Content images
        data.blog.content.forEach((block, idx) => {
          if (block.type === 'image') {
            allImages.push({
              src: block.value,
              alt: `Blog Image ${idx + 1}`,
              subtitle: block.subtitle || `Image ${idx + 1}`
            })
          }
        })

        setImages(allImages)
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

  const openModal = (imageIndex) => {
    setCurrentImageIndex(imageIndex)
    setIsModalOpen(true)
  }

  const closeModal = () => setIsModalOpen(false)

  const goToPrevious = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    )
  }

  const goToNext = () => {
    setCurrentImageIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    )
  }

  if (loading) {
    return (
      <div className='h-screen flex items-center justify-center'>
        <Loader />
      </div>
    )
  }

  return (
    <>
      <div className={`${theme === "dark" ? "bg-[#1A1A1A] text-white" : "bg-white text-black"}`}>

        <div className="max-w-6xl mx-auto px-4 pt-24 pb-20">

          {/* Title */}
          <h1 className={`text-4xl md:text-5xl font-bold leading-tight ${theme === "dark" ? "text-white" : "text-gray-900"} mb-4`}>
            {blog.title}
          </h1>

          {/* Short description */}
          {blog.excerpt && (
            <p className={`text-gray-600 text-lg leading-relaxed mb-4 max-w-3xl ${theme === "dark" ? "text-white" : "text-gray-600"}`}>
              {blog.excerpt}
            </p>
          )}

          {/* Read More Anchor */}
          <a
            href="#content"
            className="text-blue-700 font-semibold text-sm hover:underline mb-10 block"
          >
            Read More
          </a>

          {/* MAIN GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* LEFT CONTENT */}
            <div className="lg:col-span-2">

              {/* Cover Image */}
              <div
                className="relative group rounded-xl overflow-hidden"
                onClick={() => openModal(0)}
              >
                <img
                  src={blog.coverImage.url || blog.coverImage}
                  alt={blog.title}
                  className="rounded-xl w-full h-auto object-cover"
                />
              </div>

              {/* Meta */}
              <div className={`flex items-center gap-4 mt-4 text-sm ${theme === "dark" ? "text-white" : "text-gray-700"}`}>
                <span className={`px-3 py-1 rounded-md text-xs capitalize ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`}>
                  {blog.category}
                </span>

                <span className="flex items-center gap-1 text-sm">
                  👤 {blog.author?.name}
                </span>

                <span className="flex items-center gap-1 text-sm">
                  👁 {blog.views}
                </span>
              </div>

              <figcaption className="text-gray-500 text-sm italic mt-3">
                {blog.coverImage.subtitle || "Cover Image"}
              </figcaption>

              {/* Blog Content */}
              <div id="content" className="mt-8 prose prose-lg max-w-none leading-relaxed text-gray-800">

                {blog.content.map((block, idx) => {
                  if (block.type === 'content') {
                    return (
                      <div key={idx} className="mb-8">
                        <MarkdownRenderer theme={theme} content={block.value} />
                      </div>
                    )
                  }

                  if (block.type === 'image') {
                    const imageIndex = images.findIndex(img => img.src === block.value)

                    return (
                      <figure key={idx} className="my-8">
                        <div
                          className="relative rounded-xl overflow-hidden group"
                          onClick={() => openModal(imageIndex)}
                        >
                          <img
                            src={block.value}
                            alt={block.subtitle || "Blog Image"}
                            className="w-full h-auto rounded-xl object-cover"
                          />
                        </div>

                        {block.subtitle && (
                          <figcaption className="text-gray-500 text-sm italic text-center mt-2">
                            {block.subtitle}
                          </figcaption>
                        )}
                      </figure>
                    )
                  }

                  return null
                })}

              </div>

            </div>

            {/* RIGHT SIDEBAR */}
            <div className="lg:col-span-1">
              <CommentSection theme={theme} blogId={blog._id} />
            </div>

          </div>

        </div>

        {/* Sections Below */}
        <Subscribe userId={userId} />
        <AboutTheAuthor theme={theme} author={blog.author} />
        <BlogSuggestion theme={theme} blogId={id} authorId={blog.author._id} />
        <Footer />

        {/* Image Modal */}
        {/* <ImageModal
        isOpen={isModalOpen}
        onClose={closeModal}
        images={images}
        currentIndex={currentImageIndex}
        onPrevious={goToPrevious}
        onNext={goToNext}
        /> */}
      </div>
    </>
  )
}
