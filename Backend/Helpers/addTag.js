const Tags = require('../Database/Models/tagsSchema')

const addTag = async (tags) => {
    try {
        const addedTags = [];
        // Check if the tag already exists
        for (const tagName of tags) {
            const existingTag = await Tags.findOne({ name: tagName.trim().toLowerCase()});
            if (existingTag) {
                addedTags.push(existingTag); // Add existing tag to the result
                continue; // Skip to the next tag if it already exists
            }

            //create a new tag
            const newTag = new Tags({ name: tagName.trim().toLowerCase()});
            await newTag.save();
            addedTags.push(newTag);
        }
        return {
            success: true,
            message: "Tags added successfully",
            data: addedTags
        }
    }
    catch (error) {
        console.error("Error adding tag:", error);
        throw error;
    }
}
module.exports = addTag;