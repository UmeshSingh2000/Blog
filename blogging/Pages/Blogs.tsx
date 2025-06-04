import Card from '@/Components/Card'
import React from 'react'

const Blogs = () => {
    return (
        <section id="blogs" className='blogs h-screen mt-3 p-3'>
            <div className=' flex flex-col items-start justify-center gap-1 mb-4'>
                <div className='flex items-end gap-2'>
                    <h1 className='text-3xl font-black'>Blogs</h1>
                    <p className='text-gray-600 underline italic'>Our Latest Trails</p>
                </div>
                <p className='italic text-lg font-extralight'>Curated adventures, untold tales, and breathtaking escapes. Dive into our stories from the road.</p>
            </div>
            <hr />
            <div className="container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                <Card />
                <Card />
                <Card />
                <Card />
            </div>
        </section>
    )
}

export default Blogs
