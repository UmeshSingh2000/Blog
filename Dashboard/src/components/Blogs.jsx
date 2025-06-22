import React, { useEffect, useState } from "react"
import Card from "./Card"
import axios from "axios"
import toast from "react-hot-toast"
const api = import.meta.env.VITE_BACKEND_URL

const Blogs = () => {
  const [blogs, setBlogs] = useState([])
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
      if (error.response && error.response.status === 404) {
        toast.error(error.response.data.message || "No blogs found")
      }
      else if (error.response && error.response.status === 403) {
        toast.error("You are not authorized to view these blogs")
      } else {
        toast.error("Error fetching blogs:", error)
      }
    }
  }
  useEffect(() => {
    fetchBlogs()
  }, [])
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Your posted Blogs</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <Card key={blog._id} blog={blog} />
        ))}
      </div>
    </div>
  )
}

export default Blogs
