import React from "react"
import Card from "./Card"

const Blogs = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Latest Blogs</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {/* Example: Render 6 cards */}
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} />
        ))}
      </div>
    </div>
  )
}

export default Blogs
