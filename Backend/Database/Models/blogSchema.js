const mongoose = require('mongoose');
const { Schema } = mongoose;

const contentBlockSchema = new Schema({
    type: {
        type: String,
        enum: ['content', 'image'],
        required: true
    },
    value: {
        type: String,
        required: true,
        trim: true
    },
    subtitle: {
        type: String,
        trim: true,
        maxlength: 200,
        validate: {
            validator: function (value) {
                // Only allow subtitle if type is 'image'
                if (this.type === 'image') return true;
                return value === undefined || value === null || value === '';
            },
            message: 'Subtitle is only allowed when type is "image".'
        }
    }
}, { _id: false });

const blogSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: [contentBlockSchema],
    coverImage: {
        url:{
            type: String,
            required: true,
            trim: true
        },
        subtitle:{
            type:String,
            trim : true,
            maxlength: 200,
        }
    },
    excerpt: {
        type: String,
        trim: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tags'
    }],
}, {
    timestamps: true
});

const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;
