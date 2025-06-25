import Navbar from '@/Components/Navbar'
import React from 'react'
import Blogs from '../../Pages/Blogs'
import Footer from '@/Components/Footer'
import ContactUs from '@/Components/ContactUs'
import { FaArrowDown } from 'react-icons/fa';
const page = () => {
  return (
    <>
      <main className=''>
        <Navbar />
        <section className='hero flex items-center h-screen pl-4 mb-4'>
          <div className='text-center w-full'>
            <p className='text-white text-3xl md:text-6xl font-bold italic'>
              “Go where you <br />
              feel most <br />
              alive.”
            </p>
            <p className='text-white text-lg md:text-2xl mt-4 font-light tracking-wide'>
              Discover stories that spark your next adventure
            </p>
            <div className='mt-6 absolute left-1/2 transform -translate-x-1/2'>
              <a href="#blogs">
                <button className='flex cursor-pointer items-center justify-center gap-2 px-4 py-2 bg-white text-gray-800 font-semibold rounded-full shadow hover:bg-gray-200 transition'>
                  Explore <FaArrowDown className='animate-bounce' />
                </button>
              </a>
            </div>
          </div>
        </section>

        <Blogs />
        <ContactUs />
        <Footer />
      </main>
    </>
  )
}

export default page
