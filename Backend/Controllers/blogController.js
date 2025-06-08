const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const validateId = require("../Helpers/validateId");
const Blog = require("../Database/Models/blogSchema");

const createBlog = async (req, res) => {
  try {
    const { title, content, excerpt } = req.body;
    const author = req.user.id;

    if (!title || !content || !author || !excerpt) {
      return res.status(400).json({ message: "All fields required!" });
    }

    if (!validateId(author)) {
      return res.status(400).json({ message: "Invalid author ID" });
    }

    // Check cover image (single file)
    if (!req.files?.coverImage || req.files.coverImage.length === 0) {
      return res.status(400).json({ message: "Cover image is required" });
    }

    // Upload cover image
    const coverImageFile = req.files.coverImage[0];
    const coverImageResult = await cloudinary.uploader.upload(coverImageFile.path, {
      folder: "blog_images/cover",
    });
    fs.unlinkSync(coverImageFile.path);

    // Upload additional blog images (optional)
    const imageFiles = req.files.images || [];
    const uploadedImages = [];

    for (const file of imageFiles) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "blog_images/content",
      });
      uploadedImages.push(result.secure_url);
      fs.unlinkSync(file.path);
    }

    // Create and save blog
    const newBlog = new Blog({
      title,
      content,
      excerpt,
      author,
      coverImage: coverImageResult.secure_url,
      images: uploadedImages,
    });

    await newBlog.save();

    res.status(201).json({
      message: "Blog created successfully",
      blog: newBlog,
    });
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;
        if (!validateId(id)) {
            return res.status(400).json({ message: 'Invalid blog ID' });
        }
        const blog = await Blog.findByIdAndDelete(id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.status(200).json({ message: 'Blog deleted successfully', blog });
    } catch (error) {
        console.error('Error deleting blog:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;
        if (!validateId(id)) {
            return res.status(400).json({ message: 'Invalid blog ID' });
        }
        if (!title || !content) {
            return res.status(400).json({ message: 'Title and content are required' });
        }
        const updatedBlog = await Blog.findByIdAndUpdate(id, { title, content }, { new: true });
        if (!updatedBlog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.status(200).json({ message: 'Blog updated successfully', blog: updatedBlog });
    } catch (error) {
        console.error('Error updating blog:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

const getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().populate('author', 'name email');
        if (!blogs || blogs.length === 0) {
            return res.status(404).json({ message: 'No blogs found' });
        }
        res.status(200).json({ message: 'Blogs retrieved successfully', blogs });
    } catch (error) {
        console.error('Error retrieving blogs:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

module.exports = {
    createBlog,
    deleteBlog,
    updateBlog,
    getBlogs
}