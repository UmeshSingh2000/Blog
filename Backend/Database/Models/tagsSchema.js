const mongoose = require('mongoose')
const { Schema } = mongoose
const tagsSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    }
}, {
    timestamps: true,
})
const Tags = mongoose.model('Tags', tagsSchema)
module.exports = Tags