const express = require('express');
const multer = require('multer');
const router = express.Router();
const { registeruser, loginUser } = require('../Controllers/userController');
const { loginLimiter } = require('../Helpers/rateLimiter');
const authenticateToken = require('../Middlewares/authenticateToken');
const { createBlog, deleteBlog, updateBlog, getBlogs, getBlogById } = require('../Controllers/blogController');
const upload = multer({ dest: 'uploads/' });


router.post('/login', loginUser);
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully' });
});
router.post('/register', authenticateToken, loginLimiter, registeruser);

router.post(
    '/createBlog',
    upload.fields([
        { name: 'coverImage', maxCount: 1 },
        { name: 'images', maxCount: 10 }, // adjust as needed
    ]),
    authenticateToken,
    createBlog
);
router.delete('/deleteBlog/:id', authenticateToken, deleteBlog);
router.put('/updateBlog/:id', authenticateToken, updateBlog);
router.get('/getBlogs', getBlogs); // there is no user login required to get blogs
router.get('/getblog/:id', getBlogById);




module.exports = router;