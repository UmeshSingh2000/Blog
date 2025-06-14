const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const validateId = require("../Helpers/validateId");
const Blog = require("../Database/Models/blogSchema");
const Tag = require('../Database/Models/tagsSchema')

const createBlog = async (req, res) => {
  try {
    const { sections } = req.body; // tags containing an array of tags IDs
    const author = req.user.id;

    if (!sections) {
      return res.status(400).json({ message: "Sections are required" });
    }

    const parsedSections = JSON.parse(sections);
    const tagsIds = JSON.parse(req.body.tagsIds || '[]');

    const titleSection = parsedSections.find(s => s.type === "title");
    const excerptSection = parsedSections.find(s => s.type === "excerpt");

    const title = titleSection?.value?.trim();
    const excerpt = excerptSection?.value?.trim();

    if (!title || !excerpt || !author) {
      return res.status(400).json({ message: "Title, excerpt, and author are required" });
    }

    if (!validateId(author)) {
      return res.status(400).json({ message: "Invalid author ID" });
    }

    // Validate cover image
    if (!req.files?.coverImage || req.files.coverImage.length === 0) {
      return res.status(400).json({ message: "Cover image is required" });
    }

    // Upload cover image
    const coverImageFile = req.files.coverImage[0];
    const coverImageResult = await cloudinary.uploader.upload(coverImageFile.path, {
      folder: "blog_images/cover",
    });
    fs.unlinkSync(coverImageFile.path);

    // Upload content images and store mapping
    const imageFiles = req.files.images || [];
    const uploadedImageMap = {}; // { originalFileName: uploadedURL }

    for (const file of imageFiles) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "blog_images/content",
      });
      uploadedImageMap[file.originalname] = result.secure_url;
      fs.unlinkSync(file.path);
    }

    //insert tags in db
    const insertedIds = [];
    if (tagsIds && Array.isArray(tagsIds)) {
      for (const tag of tagsIds) {
        if (validateId(tag)) {
          const isExist = await Tag.findOne({ name: tag });
          if (isExist) {
            insertedIds.push(isExist._id);
          }
          else {
            return res.status(400).json({ message: `Tag ID does not exist: ${tag}` });
          }
        } else {
          let existingTag = await Tag.findOne({ name: tag });
          if (!existingTag) {
            const newTag = new Tag({ name: tag.trim() });
            existingTag = newTag;
            await newTag.save();
          }
          insertedIds.push(existingTag._id);
        }
      }
    }



    // Construct content array
    const content = parsedSections
      .filter(s => s.type === "content" || s.type === "image")
      .map(block => {
        if (block.type === "image") {
          const imageUrl = uploadedImageMap[block.value]; // `value` holds original filename
          if (!imageUrl) {
            throw new Error(`Missing uploaded URL for image: ${block.value}`);
          }

          return {
            type: "image",
            value: imageUrl,
            subtitle: block.subtitle?.trim() || "" // optional subtitle
          };
        } else {
          return {
            type: "content",
            value: block.value.trim()
          };
        }
      });

    // Create and save blog
    const newBlog = new Blog({
      title,
      excerpt,
      content,
      author,
      coverImage: coverImageResult.secure_url,
      tags: insertedIds
    });

    await newBlog.save();

    res.status(201).json({
      message: "Blog created successfully",
      blog: newBlog
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
    const blogs = await Blog.find().populate('author', 'name email').select('-__v -createdAt -updatedAt -content');
    if (!blogs || blogs.length === 0) {
      return res.status(404).json({ message: 'No blogs found' });
    }
    res.status(200).json({ message: 'Blogs retrieved successfully', blogs });
  } catch (error) {
    console.error('Error retrieving blogs:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!validateId(id)) {
      return res.status(400).json({ message: 'Invalid blog ID' });
    }
    const blog = await Blog.findById(id).populate('author', 'name email ');
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.status(200).json({ message: 'Blog retrieved successfully', blog });
  } catch (error) {
    console.error('Error retrieving blog:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

module.exports = {
  createBlog,
  deleteBlog,
  updateBlog,
  getBlogs,
  getBlogById
}