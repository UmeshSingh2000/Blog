const mongoose = require('mongoose');
const { Schema } = mongoose;
const blogSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    coverImage: {
        type: String,
        required: false,
    },
    excerpt: { // short description of the blog
        type: String,
        trim: true,
        maxlength: 150,
    },
    images:[
        {
            type: String,
            required: false
        }
    ],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});
const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;