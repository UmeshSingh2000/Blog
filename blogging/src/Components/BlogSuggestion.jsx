'use client'

import React, { useEffect, useState } from 'react'
import Card from './Card'
import axios from 'axios'
import Link from 'next/link'

const BlogSuggestion = ({ blogId, authorId }) => {
    const [blogs, setBlogs] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchBlogSuggestions = async () => {
        if (!authorId) return
        
        setLoading(true)
        setError(null)
        
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/getBlogSuggestion/${authorId}?blogId=${blogId}`)
            if (response.status === 200) {
                setBlogs(response.data.blogs || [])
            }
        } catch (error) {
            setError(error.response.data.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchBlogSuggestions()
    }, [authorId])

    // Loading skeleton component
    const LoadingSkeleton = () => (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                    <div className="h-48 bg-gray-200"></div>
                    <div className="p-6">
                        <div className="h-4 bg-gray-200 rounded mb-3"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                </div>
            ))}
        </div>
    )

    // Error state component
    const ErrorState = () => (
        <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
            </div>
            
            <p className="text-gray-600 mb-4">{error}</p>
            {/* <button 
                onClick={fetchBlogSuggestions}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Try again
            </button> */}
        </div>
    )

    // Empty state component
    const EmptyState = () => (
        <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No suggestions available</h3>
            <p className="text-gray-600">Check back later for more content recommendations.</p>
        </div>
    )

    // Don't render anything if no blogId
    if (!authorId) return null

    return (
        <section className="mt-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-5">
            {/* Section Header */}
            <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-3">
                    You might also like
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Discover more articles handpicked just for you based on your interests
                </p>
            </div>

            {/* Content */}
            <div className="relative">
                {loading ? (
                    <LoadingSkeleton />
                ) : error ? (
                    <ErrorState />
                ) : blogs.length === 0 ? (
                    <EmptyState />
                ) : (
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {blogs.map((blog, index) => (
                            <Link 
                                key={blog._id} 
                                href={`/blog/${blog._id}`}
                                className="group block transform transition-all duration-300 hover:scale-105"
                            >
                                <div className="relative">
                                    {/* Hover glow effect */}
                                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-0 group-hover:opacity-25 transition-opacity duration-300"></div>
                                    
                                    {/* Card container */}
                                    <div className="relative bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden group-hover:shadow-xl transition-shadow duration-300">
                                        <Card blog={blog} />
                                        
                                        {/* Hover overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Decorative elements */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-px h-16 bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>
        </section>
    )
}

export default BlogSuggestion