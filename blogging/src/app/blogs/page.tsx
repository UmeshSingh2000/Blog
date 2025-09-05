'use client'
import React, { useEffect, useState } from 'react'
import Card from '@/Components/Card'
import Navbar from '@/Components/Navbar'
import { MoveDown, Search } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Loader from '@/Components/Loader/Loader'

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
  const [totalPages, setTotalPages] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('') // For search Bar
  const [filterExpanded, setFilterExpanded] = useState(true)

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

      setTotalPages(data.totalPages)
      setBlogs((prev) => [...prev, ...(data.blogs ?? [])])
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    }
    finally {
      setIsLoading(false)
    }
  }

  // Initial fetch & fetch on page change
  useEffect(() => {
    fetchBlogs(page)
    // eslint-disable-next-line
  }, [page])

  useEffect(() => {
    if (window.innerWidth < 768) {
      setFilterExpanded(false)
    }
  }, [])

  if (isLoading && !blogs.length) return <div className="flex justify-center items-center h-screen"><Loader /></div>
  return (
    <>
      <Navbar />
      <section className='mt-20 grid grid-cols-1 md:grid-cols-[20%_80%] p-2'>
        {/* Sidebar */}
        <aside className='p-4'>
          <header className='flex items-center relative'>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search..."
              className="border-none bg-[#E4E4E4] p-2 rounded w-full"
            />
            <Search className='absolute right-3 cursor-pointer' size={16} />
          </header>

          {/* Categories */}
          <section>
            <div
              className='flex items-center mt-2 p-2 justify-between cursor-pointer text-white rounded bg-[#F04952]'
              onClick={() => setFilterExpanded(!filterExpanded)}
            >
              <h2 className='text-lg'>Categories</h2>
              <MoveDown
                className={`transition-transform duration-300 ${filterExpanded ? "rotate-180" : "rotate-0"}`}
                size={16}
              />
            </div>

            <AnimatePresence>
              {filterExpanded && (
                <motion.div
                  key="categories"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <ul className='flex flex-col gap-2'>
                    {['Travel', 'Architecture', 'Technology', 'Culture', 'Food', 'Creativity', 'Music'].map((item, idx) => (
                      <li
                        key={idx}
                        className='border-b py-2 text-sm cursor-pointer hover:bg-[#f46c73] hover:text-white p-2 transition-all duration-200'
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </aside>

        {/* Main Content */}
        <main className='p-4'>
          {blogs.length && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 divide-gray-200">
                {blogs.map((blog) => (
                  <Card key={blog._id} blog={blog} />
                ))}
              </div>
            </>
          )}

          {/* Pagination */}
          <footer className="flex justify-center mt-6">
            <div className="flex gap-2">
              {Array.from({ length: totalPages || 1 }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 flex items-center justify-center cursor-pointer rounded ${p === page
                    ? "bg-[#f04652] text-white"
                    : "bg-gray-200 hover:bg-[#f04652] hover:text-white"
                    }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </footer>
        </main>
      </section>
    </>
  )
}
