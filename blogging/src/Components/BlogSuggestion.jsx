'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import Card from './Card'

const BlogSuggestion = ({ blogId, authorId, theme }) => {
    const [blogs, setBlogs] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchBlogSuggestions = async () => {
        if (!authorId) return

        setLoading(true)
        setError(null)

        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/getBlogSuggestion/${authorId}?blogId=${blogId}`
            )
            if (response.status === 200) {
                setBlogs(response.data.blogs || [])
            }
        } catch (error) {
            setError(error.response?.data?.message || "Failed to load suggestions")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchBlogSuggestions()
    }, [authorId])


    // Loading Skeleton
    const LoadingSkeleton = () => (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, index) => (
                <div key={index} className="animate-pulse">
                    <div className="w-full h-40 bg-gray-200 rounded-md"></div>
                    <div className="mt-3 h-4 bg-gray-200 w-2/3 rounded"></div>
                    <div className="mt-2 h-4 bg-gray-200 w-1/2 rounded"></div>
                </div>
            ))}
        </div>
    )

    // Error UI
    const ErrorState = () => (
        <p className="text-center text-red-600 py-10">{error}</p>
    )

    // Empty UI
    const EmptyState = () => (
        <p className="text-center text-gray-500 py-10">
            No suggestions available right now.
        </p>
    )

    if (!authorId) return null

    return (
        <section className="mt-20 max-w-6xl mx-auto px-4 mb-10">

            {/* Section Title */}
            <h2 className={`text-2xl font-bold mb-6 text-center ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                You might also like
            </h2>

            {/* Content */}
            <div>
                {loading ? (
                    <LoadingSkeleton />
                ) : error ? (
                    <ErrorState />
                ) : blogs.length === 0 ? (
                    <EmptyState />
                ) : (
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {blogs.map((blog) => (

                            <Card key={blog._id} blog={blog} />

                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}

export default BlogSuggestion
