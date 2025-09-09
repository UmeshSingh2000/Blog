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
import AboutTheAuthor from '@/Components/AboutTheAuthor'
import CommentSection from '@/Components/CommentSection'
import ImageModal from '@/Components/ImageModal'
import BlogSuggestion from '@/Components/BlogSuggestion'
import axios from 'axios'
export default function BlogDetailPage({ params }) {
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const { id } = use(params)
  const [userId, setUserId] = useState(null)

  // Image modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [images, setImages] = useState([])
  const incrementCount = async () => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/incrementCount/${id}`);
      if (res.status === 200) {
        console.log("View count incremented successfully");
      }
    } catch (error) {
      console.error("Error incrementing view count:", error);
    }
  }
  useEffect(() => {
    incrementCount();
  }, [])
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/getblog/${id}`, {
          cache: 'no-store',
        })


        if (!res.ok) return notFound()

        const data = await res.json()
        console.log(data)
        setUserId(data.blog.author?._id || null)
        setBlog(data.blog)

        // Extract all images for the modal
        const allImages = []

        // Add cover image
        if (data.blog.coverImage) {
          allImages.push({
            src: data.blog.coverImage.url || data.blog.coverImage,
            alt: data.blog.title,
            subtitle: data.blog.coverImage.subtitle || 'Cover Image'
          })
        }

        // Add content images
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

  const closeModal = () => {
    setIsModalOpen(false)
  }

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
      <Navbar />
      {/* <ProgressBar /> */}
      <div className="max-w-7xl mx-auto px-4 mt-16 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2">
            <h1 className="text-4xl font-bold mb-2">{blog.title}</h1>
            <div className='flex items-center justify-between mb-6'>
              <p className="text-gray-600 text-sm">By {blog.author?.name}</p>
              <p className="text-gray-500 text-xs">
                <span className="font-bold">Posted: </span>
                {new Date(blog.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>

            {/* Cover Image - Clickable */}
            <div className="relative group cursor-pointer" onClick={() => openModal(0)}>
              <img
                src={blog.coverImage.url || blog.coverImage}
                alt={blog.title}
                className="rounded-xl w-full h-auto mb-2"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-xl flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
            </div>

            <figcaption className="text-center text-gray-500 text-sm italic mb-6">
              {blog.coverImage.subtitle || 'Cover Image'}
            </figcaption>

            <hr className="mb-6" />

            <div className="prose prose-lg dark:prose-invert max-w-none">
              {blog.content.map((block, idx) => {
                if (block.type === 'content') {
                  return <MarkdownRenderer key={idx} content={block.value} />
                } else if (block.type === 'image') {
                  const imageIndex = images.findIndex(img => img.src === block.value)
                  return (
                    <figure key={idx} className="my-6">
                      <div
                        className="relative group cursor-pointer"
                        onClick={() => openModal(imageIndex)}
                      >
                        <img
                          loading="lazy"
                          src={block.value}
                          alt={`Blog Image ${idx + 1}`}
                          className="rounded-xl w-full h-auto"
                        />
                        {/* Overlay on hover */}
                        <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-xl flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                            </svg>
                          </div>
                        </div>
                      </div>
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

          {/* Comments Section - Right Side */}
          <div className="lg:col-span-1">
            <CommentSection blogId={id} />
          </div>
        </div>
      </div>

      <Subscribe userId={userId} />
      <AboutTheAuthor author={blog.author} />
      <BlogSuggestion blogId={id} authorId={blog.author._id} />
      <Footer />

      {/* Image Modal */}
      <ImageModal
        isOpen={isModalOpen}
        onClose={closeModal}
        images={images}
        currentIndex={currentImageIndex}
        onPrevious={goToPrevious}
        onNext={goToNext}
      />
    </>
  )
}
