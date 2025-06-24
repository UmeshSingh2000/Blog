import Navbar from '@/Components/Navbar'
import React from 'react'
import Blogs from '../../Pages/Blogs'
import { Toaster } from 'react-hot-toast'
import Footer from '@/Components/Footer'
import ContactUs from '@/Components/ContactUs'
const page = () => {
  return (
    <>
      <main>
        <div><Toaster /></div>
        <Navbar />
        <section className='hero flex items-center h-screen pl-4 mb-4 bg-gray-100'>
          <div className='text-center w-full'>
            <p className='text-white text-3xl md:text-6xl font-bold italic'>“Go where you <br />
              feel most <br />
              alive.”</p>
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
