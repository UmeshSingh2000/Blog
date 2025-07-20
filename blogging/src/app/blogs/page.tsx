'use client'
import React, { useEffect, useState } from 'react'
import Card from '@/Components/Card'
import Link from 'next/link'
// import SearchBar from '@/Components/SearchBar' // Optional

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
}

const PAGE_SIZE = 12 // Number of blogs per page

export default function AllBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState('')
  // const [query, setQuery] = useState('') // For search Bar

  const URL = process.env.NEXT_PUBLIC_API_URL

  // Fetch blogs paginated
  async function fetchBlogs(page: number) {
    try {
      setIsLoading(true)
      setError('')
      const res = await fetch(`${URL}/getBlogs?limit=${PAGE_SIZE}&page=${page}`, {
        cache: 'no-store',
      })
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      if (!data.blogs?.length) setHasMore(false)
      setBlogs((prev) => [...prev, ...(data.blogs ?? [])])
      setIsLoading(false)
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
      setIsLoading(false)
    }
  }

  // Initial fetch & fetch on page change
  useEffect(() => {
    fetchBlogs(page)
    // eslint-disable-next-line
  }, [page])

  // To handle "Load More" pagination
  function handleLoadMore() {
    if (!isLoading && hasMore) setPage((p) => p + 1)
  }

  return (
    <section className="min-h-screen py-10 bg-gradient-to-br from-blue-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Section */}
        <div className="flex flex-col gap-4 items-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-center text-blue-700 drop-shadow-sm uppercase tracking-tight">
            All Blog Stories
          </h1>
          <p className="text-lg md:text-xl text-gray-600 italic font-light text-center max-w-2xl">
            Every adventure, every tale. Explore our journeys across the globe – all in one place.
          </p>
          {/* <SearchBar value={query} onChange={setQuery} /> */}
        </div>
        <hr />
        {/* Blog Cards Grid */}
        <div className="container max-w-none mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">
          {error ? (
            <div className="col-span-full text-red-600 font-medium text-center py-5">
              {error}
            </div>
          ) : blogs.length === 0 && !isLoading ? (
            <div className="col-span-full text-gray-400 font-medium text-center py-5">
              No blogs available.
            </div>
          ) : (
            blogs.map((blog) => (
              <Link key={blog._id} href={`/blog/${blog._id}`}>
                <Card blog={blog} />
              </Link>
            ))
          )}
          {isLoading && (
            <div className="col-span-full flex justify-center py-8">
              <svg className="animate-spin h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            </div>
          )}
        </div>
        {/* Load More Button */}
        <div className="flex justify-center my-10">
          {!isLoading && hasMore && !error && (
            <button
              onClick={handleLoadMore}
              className="px-6 py-2 rounded-xl font-semibold bg-[#2B7FFF] text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 shadow-md active:scale-95 transition-all"
            >
              Load More Blogs
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
