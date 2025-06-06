const express = require('express');
const multer = require('multer');
const router = express.Router();
const { registeruser, loginUser } = require('../Controllers/userController');
const { loginLimiter } = require('../Helpers/rateLimiter');
const authenticateToken = require('../Middlewares/authenticateToken');
const { createBlog, deleteBlog, updateBlog, getBlogs } = require('../Controllers/blogController');
const upload = multer({ dest: 'uploads/' });


router.post('/login',loginLimiter, loginUser);
router.post('/register',authenticateToken,loginLimiter, registeruser);

router.post('/createBlog',upload.single('image'),authenticateToken,createBlog);
router.delete('/deleteBlog/:id',authenticateToken,deleteBlog);
router.put('/updateBlog/:id',authenticateToken,updateBlog);
router.get('/getBlogs', authenticateToken,getBlogs);




module.exports = router;