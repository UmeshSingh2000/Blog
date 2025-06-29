const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const validateId = require("../Helpers/validateId");
const Blog = require("../Database/Models/blogSchema");
const User = require('../Database/Models/userSchema');
const Tag = require('../Database/Models/tagsSchema');
const sendEmail = require('../Helpers/mailer');

// onblog Creation send email to all subscribers

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
    const coverImageSubtitle = req.body.coverImageSubtitle;

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
      transformation: [
        { width: 1200, crop: 'limit' },
        { quality: "auto" },
        { fetch_format: "auto" }
      ]
    });
    fs.unlinkSync(coverImageFile.path);

    // Upload content images and store mapping
    const imageFiles = req.files.images || [];
    const uploadedImageMap = {}; // { originalFileName: uploadedURL }

    for (const file of imageFiles) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "blog_images/content",
        transformation: [
          { width: 1200, crop: 'limit' },
          { quality: "auto" },
          { fetch_format: "auto" }
        ]
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
      coverImage: {
        url: coverImageResult.secure_url,
        subtitle: coverImageSubtitle?.trim() || "" // optional subtitle
      },
      tags: insertedIds
    });

    await newBlog.save();

    //send email to all subscribers
    const user = await User.findById(author);
    if (!user) {
      return res.status(404).json({ message: "Author not found" });
    }
    const subscribers = user.subscribers //[]
    if (subscribers && subscribers.length > 0) {
      let html = fs.readFileSync(path.join(__dirname, '../Helpers/newsletter.html'), 'utf-8');
      html = html
        .replace('{{blogTitle}}', title)
        .replace('{{name}}', user.name)
        .replace('{{publishDate}}', new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }))
        .replace('{{blogUrl}}', `${process.env.FRONTEND_URL}/blog/${newBlog._id}`)

      subscribers.forEach(async (subscriber) => {
        const htmlForSubscriber = html.replace(
          '{{unsubscribeUrl}}',
          `${process.env.FRONTEND_URL}/unsubscribe?email=${subscriber}&userId=${user._id}` // handle later????????????
        );
        await sendEmail({
          to: subscriber,
          subject: `New Blog Post: ${title}`,
          html: htmlForSubscriber
        })
      })
    }

    

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
    const { blogId } = req.params;
    const author = req.user.id;

    const coverImageSubtitle = req.body.coverImageSubtitle;
    // Validate required fields
    if (!req.body.sections) {
      return res.status(400).json({ message: "Sections are required" });
    }
    // Parse incoming data
    const parsedSections = JSON.parse(req.body.sections);
    const tagsIds = JSON.parse(req.body.tagsIds || '[]');

    // Find and validate existing blog
    const existingBlog = await Blog.findById(blogId);
    if (!existingBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Verify ownership
    if (existingBlog.author.toString() !== author) {
      return res.status(403).json({ message: "Unauthorized to update this blog" });
    }

    // Extract title and excerpt
    const titleSection = parsedSections.find(s => s.type === "title");
    const excerptSection = parsedSections.find(s => s.type === "excerpt");

    if (!titleSection?.value?.trim() || !excerptSection?.value?.trim()) {
      return res.status(400).json({ message: "Title and excerpt are required" });
    }

    // Process cover image
    let coverImageUrl = existingBlog.coverImage;
    if (req.file) { // Assuming single file for cover image ---------------------fix later-----------
      // Delete old cover image if exists
      if (coverImageUrl) {
        const publicId = coverImageUrl.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`blog_images/cover/${publicId}`);
      }

      // Upload new cover image
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "blog_images/cover",
      });
      fs.unlinkSync(req.file.path);
      coverImageUrl = result.secure_url;
    }

    // Process content images
    const contentImages = parsedSections
      .filter(s => s.type === "image")
      .map(img => ({ id: img.id, file: img.file, subtitle: img.subtitle }));

    const imageUpdates = {};
    for (const img of contentImages) {
      if (img.file) {
        // This would need to match your actual file handling
        // You might need to adjust based on how files are sent
        const result = await cloudinary.uploader.upload(img.file.path, {
          folder: "blog_images/content",
        });
        fs.unlinkSync(img.file.path);
        imageUpdates[img.id] = result.secure_url;
      }
    }

    // Process tags
    const validTagIds = [];
    for (const tagId of tagsIds) {
      if (validateId(tagId)) {
        const tagExists = await Tag.exists({ _id: tagId });
        if (tagExists) {
          validTagIds.push(tagId);
        }
      } else {
        // Handle string tags (create new if needed)
        const normalizedTag = tagId.trim().toLowerCase();
        let tag = await Tag.findOne({ name: normalizedTag });
        if (!tag) {
          tag = new Tag({ name: normalizedTag });
          await tag.save();
        }
        validTagIds.push(tag._id);
      }
    }

    // Reconstruct content sections
    const updatedContent = parsedSections
      .filter(s => s.type === 'content' || s.type === 'image')
      .map(section => {
        if (section.type === 'image') {
          return {
            type: 'image',
            value: imageUpdates[section.id] || section.value, // Use new URL or existing
            subtitle: section.subtitle || ''
          };
        }
        return {
          type: 'content',
          value: section.value
        };
      });

    // Update blog document
    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      {
        title: titleSection.value.trim(),
        excerpt: excerptSection.value.trim(),
        content: updatedContent,
        coverImage: {
          url : coverImageUrl.url,
          subtitle: coverImageSubtitle ? coverImageSubtitle.trim() : ''
        },
        tags: validTagIds,
        updatedAt: new Date()
      },
      { new: true }
    ).populate('tags', 'name');

    res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      blog: updatedBlog
    });

  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update blog",
      error: error.message
    });
  }
};

const getBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalBlogs = await Blog.countDocuments();

    const blogs = await Blog.find({status: "published"})
      .skip(skip)
      .limit(limit)
      .populate('author', 'name email profilePicture')
      .populate('tags', 'name')
      .select('-__v -createdAt -updatedAt -content')
      .sort({ createdAt: -1 }); // optional: sort by newest

    if (!blogs.length) {
      return res.status(404).json({ message: 'No blogs found' });
    }

    res.status(200).json({
      message: 'Blogs retrieved successfully',
      totalBlogs,
      currentPage: page,
      totalPages: Math.ceil(totalBlogs / limit),
      blogs,
    });
  } catch (error) {
    console.error('Error retrieving blogs:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getMyBlogs = async (req, res) => {
  try {
    const { id } = req.user;
    if (!validateId(id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    const myBlogs = await Blog.find({ author: id })
      .populate('author', 'name email')
      .populate('tags', 'name')
      .select('-__v -createdAt -updatedAt -content')
      .sort({ createdAt: -1 }); // optional: sort by newest
    if (!myBlogs.length) {
      return res.status(404).json({ message: 'You dont have any blogs posted!' });
    }
    res.status(200).json({
      message: 'My blogs retrieved successfully',
      blogs: myBlogs,
    });
  } catch (error) {
    console.error('Error retrieving my blogs:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}


const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!validateId(id)) {
      return res.status(400).json({ message: 'Invalid blog ID' });
    }
    const blog = await Blog.findById(id).populate('author', 'name email about profilePicture title').populate('tags', 'name');
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
  getBlogById,
  getMyBlogs
}