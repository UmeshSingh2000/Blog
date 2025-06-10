const mongoose = require('mongoose');
const { Schema } = mongoose;

const contentBlockSchema = new Schema({
    type: {
        type: String,
        enum: ['content', 'image'], // you can add more types if needed
        required: true
    },
    value: {
        type: String,
        required: true,
        trim: true
    }
}, { _id: false });

const blogSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: [contentBlockSchema], // ordered content blocks
    coverImage: {
        type: String,
        required: false
    },
    excerpt: {
        type: String,
        trim: true,
        maxlength: 150
    },
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
