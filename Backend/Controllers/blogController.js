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
        public_id: coverImageResult.public_id,
        subtitle: coverImageSubtitle?.trim() || "" // optional subtitle
      },
      tags: insertedIds,
      status: "published", // default to published, can be changed later
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

    // ✅ Process cover image (if uploaded)
    let updatedCoverImage = existingBlog.coverImage;

    if (req.files?.coverImage?.[0]) {
      const file = req.files.coverImage[0];

      // Delete old image from Cloudinary if available
      if (existingBlog.coverImage?.public_id) {
        await cloudinary.uploader.destroy(existingBlog.coverImage.public_id);
      }

      const result = await cloudinary.uploader.upload(file.path, {
        folder: "blog_images/cover",
        transformation: [
          { width: 1200, crop: "limit" },
          { quality: "auto" },
          { fetch_format: "auto" }
        ]
      });
      fs.unlinkSync(file.path);

      updatedCoverImage = {
        url: result.secure_url,
        public_id: result.public_id,
        subtitle: coverImageSubtitle?.trim() || ""
      };
    } else {
      // Only update subtitle if image not changed
      updatedCoverImage.subtitle = coverImageSubtitle?.trim() || updatedCoverImage.subtitle;
    }

    // ✅ Upload new content images
    const imageUpdates = {};
    const imageFiles = req.files?.images || [];

    for (const file of imageFiles) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "blog_images/content",
        transformation: [
          { width: 1200, crop: "limit" },
          { quality: "auto" },
          { fetch_format: "auto" }
        ]
      });

      fs.unlinkSync(file.path);
      imageUpdates[file.originalname] = result.secure_url;
    }

    // ✅ Process tags (existing + new)
    const validTagIds = [];
    for (const tag of tagsIds) {
      if (validateId(tag)) {
        const tagExists = await Tag.exists({ _id: tag });
        if (tagExists) validTagIds.push(tag);
      } else {
        const normalized = tag.trim().toLowerCase();
        let tagDoc = await Tag.findOne({ name: normalized });
        if (!tagDoc) {
          tagDoc = new Tag({ name: normalized });
          await tagDoc.save();
        }
        validTagIds.push(tagDoc._id);
      }
    }

    // ✅ Rebuild blog content sections
    const updatedContent = parsedSections
      .filter(s => s.type === "content" || s.type === "image")
      .map(section => {
        if (section.type === "image") {
          return {
            type: "image",
            value: imageUpdates[section.value] || section.value, // match by filename
            subtitle: section.subtitle || ""
          };
        }
        return {
          type: "content",
          value: section.value
        };
      });

    // ✅ Update blog document
    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      {
        title: titleSection.value.trim(),
        excerpt: excerptSection.value.trim(),
        content: updatedContent,
        coverImage: updatedCoverImage,
        tags: validTagIds,
        updatedAt: new Date()
      },
      { new: true }
    ).populate("tags", "name");

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

    const blogs = await Blog.find({ status: "published" })
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

// to be done by user
// const addCommentToBlog = async (req, res) => {
//   try {
//     const { id } = req.params // blog Id
//     if (!validateId(id)) {
//       return res.status(400).json({ message: 'Invalid blog ID' });
//     }
//     const { content } = req.body; // comment content
//     if (!content || content.trim() === '') {
//       return res.status(400).json({ message: 'Comment content is required' });
//     }
//     const blog = await Blog.findById(id);
//     if (!blog) {
//       return res.status(404).json({ message: 'Blog not found' });
//     }
//     blog.comments.push({
//       content: content.trim(),
//     })
//     await blog.save();
//     res.status(200).json({ message: 'Comment added successfully', blog });
//   } catch (error) {
//     console.error('Error adding comment to blog:', error);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// }
// single comment added seperately not any reply
const addCommentsToBlog = async (req, res) => {
  try {
    const { id } = req.params; // blog Id
    if (!validateId(id)) {
      return res.status(400).json({ message: 'Invalid blog ID' });
    }
    const { comments, authorName } = req.body; // single comment
    if (!comments || comments.trim() === '') {
      return res.status(400).json({ message: 'Comment content is required' });
    }
    if (!authorName || authorName.trim() === '') {
      return res.status(400).json({ message: 'Author name is required' });
    }

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    blog.comments.push({
      content: comments.trim(),
      authorName: authorName.trim(),
      createdAt: new Date(),
      reply: []
    })
    await blog.save();

    res.status(200).json({ message: 'Comments added successfully', id: blog.comments[blog.comments.length - 1]._id });
  } catch (error) {
    console.error('Error adding comments to blog:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

const getblogComments = async (req, res) => {
  try {
    const { id } = req.params; // blog Id
    if (!validateId(id)) {
      return res.status(400).json({ message: 'Invalid blog ID' });
    }
    const blog = await Blog.findById(id).select('comments');
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.status(200).json({ message: 'Comments retrieved successfully', comments: blog.comments });
  } catch (error) {
    console.error('Error retrieving comments:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

const getBlogSuggestion = async (req, res) => {
  try {
    const { id } = req.params; // author Id
    if (!validateId(id)) {
      return res.status(400).json({ message: 'Invalid author ID' });
    }
    const blogs = await Blog.find({ author: id, status: "published" })
      .select('title excerpt coverImage author createdAt')
      .populate('author', 'name profilePicture')
      .sort({ createdAt: -1 }) // optional: sort by newest
      .limit(5); // limit to 5 suggestions
    if (!blogs.length) {
      return res.status(404).json({ message: 'No blog suggestions found for this author' });
    }
    res.status(200).json({
      message: 'Blog suggestions retrieved successfully',
      blogs
    })
  } catch (error) {
    console.error('Error retrieving blog suggestions:', error);
    res.status(500).json({ message: 'Server error', error: error.message });

  }
}




module.exports = {
  createBlog,
  deleteBlog,
  updateBlog,
  getBlogs,
  getBlogById,
  getMyBlogs,
  // addCommentToBlog,
  addCommentsToBlog,
  getblogComments,
  getBlogSuggestion
}