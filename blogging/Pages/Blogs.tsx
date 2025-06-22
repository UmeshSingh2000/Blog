import Card from '@/Components/Card';

import Link from 'next/link'
interface Blog {
    title: string;
    _id: string;
    author: {
        _id: string;
        name: string;
        email: string;
    };
    tags: [
        {
            _id: string;
            name: string;
        }
    ];
    excerpt: string;
    coverImage: {
        url: string;
        subtitle : string;
    };
}

export default async function Blogs() {
    const URL = process.env.NEXT_PUBLIC_API_URL;
    let blogs: Blog[] = [];

    try {
        const response = await fetch(`${URL}/getBlogs`, {
            cache: 'no-store',
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        blogs = data.blogs ?? [];
    } catch (error) {
        console.error('Error fetching blogs:', error);
        return (
            <section className="p-4 text-red-600 font-semibold text-center">
                Failed to load blogs. Please try again later.
            </section>
        );
    }

    return (
        <section id="blogs" className="blogs min-h-screen relative mt-5 p-3">
            <div className="flex flex-col items-start justify-center gap-1 mb-4">
                <div className="flex items-end gap-2">
                    <h1 className="text-3xl font-black">Blogs</h1>
                    <p className="text-gray-600 underline italic">Our Latest Trails</p>
                </div>
                <p className="italic text-lg font-extralight">
                    Curated adventures, untold tales, and breathtaking escapes. Dive into our stories from the road.
                </p>
            </div>
            <hr />
            <div className="container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                {blogs.length > 0 ? (
                    blogs.map((blog) => <Link key={blog._id} href={`/blog/${blog._id}`}><Card blog={blog} /></Link>)
                ) : (
                    <p className="text-center text-gray-500 col-span-full">No blogs available.</p>
                )}
            </div>
        </section>
    );
}
