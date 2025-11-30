import AllBlogs from '@/Components/AllBlogs'
import React, { Suspense } from 'react'

const page = () => {
  return (
    <div>
      <Suspense fallback={<div className="p-4 text-center">Loading blogs...</div>}>
        <AllBlogs />
      </Suspense>
    </div>
  )
}

export default page
