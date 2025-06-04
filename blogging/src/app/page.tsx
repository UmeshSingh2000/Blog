import Navbar from '@/Components/Navbar'
import React from 'react'
import Blogs from '../../Pages/Blogs'

const page = () => {
  return (
    <>
      <main>
        <Navbar />
        <section className='hero flex items-center h-screen pl-4 bg-gray-100'>
          <div className=''>
            <p className='text-white text-5xl font-bold italic'>Curated travel stories & visual <br /> diaries from every corner <br /> of the world</p>
          </div>
        </section>
        <Blogs/>
      </main>
    </>
  )
}

export default page
