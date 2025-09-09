const slugify = require('slugify');
const { nanoid } = require('nanoid');

const generateSlug = (title) => {
    const baseSlug = slugify(title, { lower: true, strict: true, trim: true }).slice(0, 50); // keep title part short
    const uniqueId = nanoid(6); // short unique id (6 chars)
    return `${baseSlug}-${uniqueId}`;
};

module.exports = generateSlug;