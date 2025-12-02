'use client'
import React, { useEffect, useState, useMemo, Suspense } from 'react'
import Card from '@/Components/Card'
import Loader from '@/Components/Loader/Loader'
import { useSearchParams } from "next/navigation";

interface Blog {
  title: string
  _id: string
  author: {
    _id: string
    name: string
    email: string
    profilePicture?: string
  }
  tags: {
    _id: string
    name: string
  }[]
  excerpt: string
  coverImage: {
    url: string
    subtitle: string
  }
  views: number
  slug: string
  category: string
}

export default function AllBlogs() {

  const searchParams = useSearchParams();

  const [allBlogs, setAllBlogs] = useState<Blog[]>([])
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [currentPage, setCurrentPage] = useState(1)

  const [totalPages, setTotalPages] = useState(1)

  const blogsPerPage = 8

  const URL = process.env.NEXT_PUBLIC_API_URL

  // Fetch blogs from backend
  async function fetchBlogs() {
    try {
      setIsLoading(true)
      setError('')
      const res = await fetch(`${URL}/getBlogs`, {
        cache: 'no-store'
      })
      if (!res.ok) throw new Error('Failed to fetch')

      const data = await res.json()
      setAllBlogs(data.blogs ?? [])
      setBlogs(data.blogs ?? [])
      setTotalPages(Math.ceil((data.blogs ?? []).length / blogsPerPage))
      setCurrentPage(1)
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  // Initial load
  useEffect(() => {
    fetchBlogs()
  }, [])

  // Handle category from URL
  useEffect(() => {
    const category = searchParams?.get("category");
    if (category) {
      setSelectedCategory(category);
    }
  }, [searchParams]);

  // Filter blogs whenever search or category changes
  useEffect(() => {
    let filtered = [...allBlogs]

    if (search.trim()) {
      filtered = filtered.filter(
        (blog) =>
          blog.title.toLowerCase().includes(search.toLowerCase()) ||
          blog.excerpt.toLowerCase().includes(search.toLowerCase()) ||
          blog.tags.some((t) => t.name.toLowerCase().includes(search.toLowerCase()))
      )
    }

    if (selectedCategory) {
      filtered = filtered.filter(
        (blog) => blog.category.toLowerCase() === selectedCategory.toLowerCase()
      )
    }

    setBlogs(filtered)
    setTotalPages(Math.ceil(filtered.length / blogsPerPage))
    setCurrentPage(1) // reset page for category/search
  }, [search, selectedCategory, allBlogs])

  // Slice blogs according to page number
  const paginatedBlogs = useMemo(() => {
    const start = (currentPage - 1) * blogsPerPage
    const end = start + blogsPerPage
    return blogs.slice(start, end)
  }, [blogs, currentPage])


  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    )
  }

  return (
    <>
      <section className="mt-20 w-full p-2">

        {/* TOP BANNER */}
        <section className="w-full h-52 md:h-64 rounded-xl overflow-hidden relative mb-10 bg-black shadow-lg">
          <img
            src="/WhatsApp Image 2025-12-01 at 22.29.35.jpeg"
            alt="Blog Banner"
            className="w-full h-full object-cover opacity-70 blur-[2px]"
          />

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
              Explore Our Blogs
            </h1>
            <p className="text-gray-200 mt-2 text-sm md:text-base max-w-xl">
              Discover stories, insights, tips, and updates crafted by our creators.
            </p>
          </div>
        </section>

        {/* SEARCH INPUT */}


        {/* MAIN CONTENT */}
        <main className="p-4">
          {paginatedBlogs.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {paginatedBlogs.map((blog) => (
                <Card key={blog._id} blog={blog} />
              ))}
            </div>
          ) : (
            <p className="text-center mt-10">No blogs found.</p>
          )}

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex justify-end w-full mt-10 gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 border rounded ${currentPage === i + 1 ? 'bg-black text-white' : 'bg-white'
                    }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </main>

      </section>
    </>
  )
}
