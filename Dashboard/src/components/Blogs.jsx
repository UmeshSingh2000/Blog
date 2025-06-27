import React, { useEffect, useState } from "react"
import Card from "./Card"
import axios from "axios"
import toast from "react-hot-toast"

const api = import.meta.env.VITE_BACKEND_URL

const Blogs = () => {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`${api}/getMyBlogs`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      if (response.status === 200) {
        setBlogs(response.data.blogs)
      }
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error(error.response.data.message || "No blogs found")
      } else if (error.response?.status === 403) {
        toast.error("You are not authorized to view these blogs")
      } else {
        toast.error("Error fetching blogs")
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBlogs()
  }, [])

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-12">
      <h1 className="text-4xl font-extrabold text-center mb-8 text-gray-800 dark:text-white">
        Your Posted Blogs
      </h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading blogs...</p>
      ) : blogs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog, index) => (
            <div
              key={blog._id}
              className="transition-transform transform hover:scale-[1.02] duration-200 ease-in-out"
            >
              <Card blog={blog} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 px-4 border border-dashed rounded-xl bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
          <p className="text-lg text-gray-500 dark:text-gray-300">You haven't posted any blogs yet.</p>
        </div>
      )}
    </div>
  )
}

export default Blogs
