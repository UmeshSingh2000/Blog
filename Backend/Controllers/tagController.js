const Tag = require('../Database/Models/tagsSchema')
const getTags = async (req, res) => {
    try {
        const { search } = req.query;
        const tags = await Tag.find({
            name: {
                $regex: search ? search : "",
                $options: "i"
            }
        }).sort({ createdAt: -1 }).limit(10);
        res.status(200).json(tags);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    getTags
}