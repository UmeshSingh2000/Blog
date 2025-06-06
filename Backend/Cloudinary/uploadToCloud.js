const cloudinary = require('cloudinary').v2;

const uploadToCloud = async (image) => {
    try {
        const result = await cloudinary.uploader.upload(image, {
            folder: 'blog_images',
            resource_type: 'image',
            use_filename: true,
            unique_filename: false,
        });
        return result;
    } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
        throw new Error('Image upload failed');
    }
}

module.exports = uploadToCloud;