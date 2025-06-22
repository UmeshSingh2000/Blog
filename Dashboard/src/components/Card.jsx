import axios from "axios";
import { Eye, Pen, Trash } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const api = import.meta.env.VITE_BACKEND_URL;
const mainUrl = import.meta.env.VITE_POTATO_TRAILS_URL

const ImageCard = ({ blog }) => {
  const navigate = useNavigate();
  const maxExcerptLength = 100;
  const truncatedExcerpt =
    blog.excerpt.length > maxExcerptLength
      ? blog.excerpt.slice(0, maxExcerptLength) + "..."
      : blog.excerpt;



  const deleteBlog = async (id) => {
    if (!id) {
      toast.error("Blog ID is required to delete the blog");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this blog?")) {
      return;
    }
    try {
      const response = await axios.delete(`${api}/deleteBlog/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      if (response.status === 200) {
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to delete blog");
    }
  }

  return (
    <div className="rounded-lg overflow-hidden bg-white shadow-lg hover:shadow-xl transition duration-300 group flex flex-col">
      {/* Cover Image */}
      <div className="relative overflow-hidden rounded-t-lg">
        <img
          src={blog.coverImage.url}
          alt={blog.title}
          className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Title */}
      <div className="p-4 pb-0">
        <h2 className="text-xl font-semibold text-gray-800">{blog.title}</h2>
      </div>

      {/* Excerpt */}
      <div className="p-4 pt-2">
        <p className="text-sm text-gray-600 leading-relaxed">{truncatedExcerpt}</p>
      </div>

      {/* Buttons */}
      <div className="p-4 pt-2 flex gap-3 mt-auto">
        <button className="w-1/3 cursor-pointer flex items-center justify-center gap-1 bg-gray-100 text-gray-800 py-2 rounded-md hover:bg-gray-200 transition duration-200 text-sm"
          onClick={()=> window.open(`${mainUrl}/blog/${blog._id}`,'_blank')}
        >
          <Eye className="h-4 w-4" />
          View
        </button>
        <button className="w-1/3 cursor-pointer flex items-center justify-center gap-1 bg-black text-white py-2 rounded-md text-sm"
          onClick={() => navigate(`/editBlog/${blog._id}`)}
        >
          <Pen className="h-4 w-4" />
          Edit
        </button>
        <button className="w-1/4 cursor-pointer flex items-center justify-center gap-1 bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition duration-200 text-sm"
          onClick={() => deleteBlog(blog._id)}
        >
          <Trash className="h-4 w-4" />
          Delete
        </button>
      </div>
    </div>
  );
};

export default ImageCard;
