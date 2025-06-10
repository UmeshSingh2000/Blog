'use client'
import Card from '@/Components/Card'
import Loader from '@/Components/Loader/Loader';
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
interface Blog {
    title: string,
    _id: string,
    content: [
        {
            type: string,
            value:string
        }
    ],
    author: {
        _id: string,
        name: string,
        email: string,
    },
    excerpt: string;
    coverImage: string,
    createdAt: string,
    updatedAt: string
}
const Blogs = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [blogs, setBlogs] = useState<Blog[]>([])
    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const response = await axios.get<{ blogs?: Blog[] }>('http://localhost:5000/api/getBlogs', {
                withCredentials: true,
            })
            toast.success('Blogs fetched successfully!', {
                position: "top-right"
            })
            const blogs = response.data.blogs ?? [];

            if (response.status === 200) {
                setBlogs(blogs);
            }
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 404) {
                    toast.error('No blogs found.',{
                        position: "top-right"
                    });
                } else {
                    toast.error('An error occurred while fetching blogs.',{
                        position: "top-right"
                    });
                }
            } else {
                toast.error('An unexpected error occurred.',{
                    position: "top-right"
                });
            }
        }
        finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchBlogs();
    }, [])
    return (
        <section id="blogs" className='blogs h-screen relative mt-3 p-3' >

            <div className=' flex flex-col items-start justify-center gap-1 mb-4'>
                <div className='flex items-end gap-2'>
                    <h1 className='text-3xl font-black'>Blogs</h1>
                    <p className='text-gray-600 underline italic'>Our Latest Trails</p>
                </div>
                <p className='italic text-lg font-extralight'>Curated adventures, untold tales, and breathtaking escapes. Dive into our stories from the road.</p>
            </div>
            <hr />
            {error && <div className='text-red-500 text-center mt-4'>{error}</div>}
            {
                loading ? <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                    <Loader />
                </div> :
                    <div className="container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                        {
                            blogs.map((blog) => (
                                <Card key={blog._id} blog={blog} />
                            ))
                        }
                    </div>
            }

        </section >
    )
}

export default Blogs
