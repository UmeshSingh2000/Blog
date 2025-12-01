import AllBlogs from '@/Components/AllBlogs'
import Footer from '@/Components/Footer'
import React, { Suspense } from 'react'

const page = () => {
  return (
    <div>
      <Suspense fallback={<div className="p-4 text-center">Loading blogs...</div>}>
        <AllBlogs />
        <Footer />
      </Suspense>
    </div>
  )
}

export default page
