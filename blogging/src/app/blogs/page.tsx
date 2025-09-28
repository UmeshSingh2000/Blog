'use client'
import React, { useEffect, useState, useMemo } from 'react'
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
  slug: string
  category: string
}

export default function AllBlogs() {
  const [allBlogs, setAllBlogs] = useState<Blog[]>([])
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [filterExpanded, setFilterExpanded] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  const URL = process.env.NEXT_PUBLIC_API_URL

  // Fetch once
  async function fetchBlogs() {
    try {
      setIsLoading(true)
      setError('')
      const res = await fetch(`${URL}/getBlogs`, { cache: 'no-store' })
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setAllBlogs(data.blogs ?? [])
      setBlogs(data.blogs ?? [])
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBlogs()
    if (window.innerWidth < 768) setFilterExpanded(false)
    // eslint-disable-next-line
  }, [])

  // Filter blogs whenever search/category changes
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
  }, [search, selectedCategory, allBlogs])

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    allBlogs.forEach((blog) => {
      const cat = blog.category || 'Uncategorized'
      counts[cat] = (counts[cat] || 0) + 1
    })
    return counts
  }, [allBlogs])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    )
  }


  const categories = ['Travel', 'Architecture', 'Technology', 'Culture', 'Food', 'Creativity', 'Music']

  return (
    <>
      <Navbar />
      <section className="mt-20 grid grid-cols-1 md:grid-cols-[20%_80%] p-2">
        {/* Sidebar */}
        <aside className="p-4">
          <header className="flex items-center relative">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search..."
              className="border-none bg-[#E4E4E4] p-2 rounded w-full"
            />
            <Search className="absolute right-3 cursor-pointer" size={16} />
          </header>

          {/* Categories */}
          <section>
            <div
              className="flex items-center mt-2 p-2 justify-between cursor-pointer text-white rounded bg-[#F04952]"
              onClick={() => setFilterExpanded(!filterExpanded)}
            >
              <h2 className="text-lg">Categories</h2>
              <MoveDown
                className={`transition-transform duration-300 ${filterExpanded ? 'rotate-180' : 'rotate-0'}`}
                size={16}
              />
            </div>

            <AnimatePresence>
              {filterExpanded && (
                <motion.div
                  key="categories"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <ul className="flex flex-col gap-2">
                    {categories.map((item, idx) => (
                      <li
                        key={idx}
                        onClick={() => setSelectedCategory(item)}
                        className={`flex justify-between items-center border-b py-2 text-sm cursor-pointer p-2 transition-all duration-200 
                          ${selectedCategory === item ? 'bg-[#f04652] text-white' : 'hover:bg-[#f46c73] hover:text-white'}`}
                      >
                        <span>{item}</span>
                        <span className="text-xs  px-2 py-0.5 text-gray-600">
                          {categoryCounts[item.toLowerCase()] || 0}
                        </span>
                      </li>
                    ))}
                    <li
                      onClick={() => setSelectedCategory('')}
                      className="flex justify-between items-center border-b py-2 text-sm cursor-pointer p-2 hover:bg-gray-200 transition-all duration-200"
                    >
                      <span>All</span>
                      <span className="text-xs  px-2 py-0.5 text-gray-600">
                        {allBlogs.length}
                      </span>
                    </li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </aside>

        {/* Main Content */}
        <main className="p-4">
          {blogs.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 divide-gray-200">
              {blogs.map((blog) => (
                <Card key={blog._id} blog={blog} />
              ))}
            </div>
          ) : (
            <p className="text-center mt-10">No blogs found.</p>
          )}
        </main>
      </section>
    </>
  )
}
