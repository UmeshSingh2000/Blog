const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const validateId = require("../Helpers/validateId");
const Blog = require("../Database/Models/blogSchema");

const createBlog = async (req, res) => {
    try {
        const { title, content, author } = req.body;
        if (!title || !content || !author) {
            return res.status(400).json({ message: 'Title, content and author  are required' });
        }
        if (!req.file) {
            return res.status(400).json({ message: 'Cover image is required' });
        }
        if (!validateId(author)) {
            return res.status(400).json({ message: 'Invalid author ID' });
        }
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'blog_images',
        });
        fs.unlinkSync(req.file.path);

        // Create new blog post
        const newBlog = new Blog({
            title,
            content,
            author,
            coverImage: result.secure_url,
        });
        await newBlog.save();
        res.status(201).json({ message: 'Blog created successfully', blog: newBlog });
    } catch (error) {
        console.error('Error creating blog:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

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