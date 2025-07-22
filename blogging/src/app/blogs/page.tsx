'use client'
import React, { useEffect, useState } from 'react'
import Card from '@/Components/Card'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
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
  const router = useRouter()
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

  // Handle go back
  function handleGoBack() {
    router.back()
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-indigo-200/30 to-cyan-200/30 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Go Back Button */}
        <div className="mb-6">
          <button
            onClick={handleGoBack}
            className="group flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 hover:border-blue-300 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 text-gray-700 hover:text-blue-600 font-medium"
          >
            <svg 
              className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Go Back
          </button>
        </div>

        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
              All Blog Stories
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-2 rounded-full"></div>
          </div>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Every adventure, every tale. Explore our journeys across the globe – all in one place.
          </p>
          
          {/* Stats or additional info could go here */}
          <div className="mt-6 flex justify-center">
            <div className="px-6 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-white/40 shadow-sm">
              <span className="text-sm font-medium text-gray-600">
                {blogs.length > 0 && `${blogs.length}${hasMore ? '+' : ''} stories and counting`}
              </span>
            </div>
          </div>

          {/* <SearchBar value={query} onChange={setQuery} /> */}
        </div>

        {/* Decorative separator */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          <div className="px-4">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
        </div>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {error ? (
            <div className="col-span-full">
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-red-600 mb-2">Oops! Something went wrong</h3>
                <p className="text-gray-600">{error}</p>
                <button
                  onClick={() => {
                    setError('')
                    setPage(1)
                    setBlogs([])
                    fetchBlogs(1)
                  }}
                  className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : blogs.length === 0 && !isLoading ? (
            <div className="col-span-full">
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Stories Yet</h3>
                <p className="text-gray-500 mb-6">Be the first to share your adventure!</p>
                <Link
                  href="/create-blog"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create First Blog
                </Link>
              </div>
            </div>
          ) : (
            blogs.map((blog, index) => (
              <div
                key={blog._id}
                className="transform hover:scale-105 transition-transform duration-300"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animation: 'fadeInUp 0.6s ease-out forwards',
                  opacity: 0
                }}
              >
                <Link href={`/blog/${blog._id}`}>
                  <Card blog={blog} />
                </Link>
              </div>
            ))
          )}
          
          {/* Loading skeleton cards */}
          {isLoading && (
            <>
              {[...Array(8)].map((_, i) => (
                <div key={`skeleton-${i}`} className="animate-pulse">
                  <div className="bg-white rounded-2xl p-4 shadow-md">
                    <div className="w-full h-48 bg-gray-200 rounded-xl mb-4"></div>
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Load More Section */}
        <div className="flex flex-col items-center mt-16 space-y-4">
          {!isLoading && hasMore && !error && (
            <>
              <button
                onClick={handleLoadMore}
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center gap-2">
                  Load More Stories
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </span>
              </button>
              <p className="text-sm text-gray-500">
                Showing {blogs.length} of many amazing stories
              </p>
            </>
          )}

          {!hasMore && blogs.length > 0 && (
            <div className="text-center py-8">
              <div className="inline-flex items-center px-6 py-3 bg-green-50 border border-green-200 rounded-full text-green-700">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                You've reached the end! All stories loaded.
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  )
}
