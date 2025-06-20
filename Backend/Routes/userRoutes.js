const express = require('express');
const multer = require('multer');
const router = express.Router();
const { registeruser, loginUser, sendOtp, verifyOtp, resetPassword, getMyData, verifyPassword, updateProfile, subscribeToNewsletter } = require('../Controllers/userController');
const { loginLimiter } = require('../Helpers/rateLimiter');
const authenticateToken = require('../Middlewares/authenticateToken');
const { createBlog, deleteBlog, updateBlog, getBlogs, getBlogById, getMyBlogs } = require('../Controllers/blogController');
const { getTags } = require('../Controllers/tagController');
const otpIsVerified = require('../Middlewares/otpIsVerified');
const upload = multer({ dest: 'uploads/' });


router.post('/login', loginLimiter, loginUser);
router.get('/logout', (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'None',
        path: '/', // match this!
    });
    res.status(200).json({ message: 'Logged out successfully' });
});
router.post('/register', authenticateToken, loginLimiter, registeruser);
router.post('/verifyPassword',authenticateToken,loginLimiter,verifyPassword) // verify password for user
router.get('/getMyData',authenticateToken,getMyData);
router.put('/updateProfile',authenticateToken,loginLimiter,updateProfile)
router.post('/subscribeToNewsletter',loginLimiter,subscribeToNewsletter)

//otp related routes
router.post('/sendotp', loginLimiter, sendOtp); // otp for password reset or verification
router.post('/verifyOtp', loginLimiter, verifyOtp) // verify otp for password reset or verification
router.post('/resetPassword', loginLimiter, otpIsVerified, resetPassword); // reset password after otp verification








router.post(
    '/createBlog',
    upload.fields([
        { name: 'coverImage', maxCount: 1 },
        { name: 'images', maxCount: 10 }, // adjust as needed
    ]), loginLimiter,
    authenticateToken,
    createBlog
);
router.delete('/deleteBlog/:id', authenticateToken, deleteBlog);
router.put('/updateBlog/:blogId',
    upload.fields([
        { name: 'coverImage', maxCount: 1 },
        { name: 'images', maxCount: 10 }, // if you're uploading more files (like content images)
    ]),
    authenticateToken, updateBlog);
router.get('/getBlogs', getBlogs); // there is no user login required to get blogs
router.get('/getblog/:id', getBlogById);

router.get('/getMyBlogs', authenticateToken, getMyBlogs) // this route is for getting blogs of the logged in user



//tags related routes
router.get('/getTags', authenticateToken, getTags);





module.exports = router;