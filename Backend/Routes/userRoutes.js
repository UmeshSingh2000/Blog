const express = require('express');
const multer = require('multer');
const router = express.Router();
const { loginUser, sendOtp, verifyOtp, resetPassword, getMyData, verifyPassword, updateProfile, subscribeToNewsletter, unsubscribeFromNewsletter, contactMeEmailSender, updateProfilePicture, updateUserAbout, updateEducation, getWriters } = require('../Controllers/userController');
const { loginLimiter } = require('../Helpers/rateLimiter');
const authenticateToken = require('../Middlewares/authenticateToken');
const { createBlog, deleteBlog, updateBlog, getBlogs, getBlogById, getMyBlogs, addCommentToBlog, addCommentsToBlog, getblogComments, getBlogSuggestion, incrementCount, generateSlugs, getRandomBlogs } = require('../Controllers/blogController');
const { getTags } = require('../Controllers/tagController');
const otpIsVerified = require('../Middlewares/otpIsVerified');
const fetchWeather = require('../Helpers/fetchWeather');
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

router.post('/verifyPassword', authenticateToken, loginLimiter, verifyPassword) // verify password for user
router.get('/getMyData', authenticateToken, getMyData);
router.put('/updateUserAbout', authenticateToken, loginLimiter, updateUserAbout)
router.put('/updateProfile', authenticateToken, loginLimiter, updateProfile)
router.put('/updateEducation', authenticateToken, loginLimiter, updateEducation)
router.put('/updateProfilePicture', upload.fields([
    { name: 'profilePicture', maxCount: 1 },
]), authenticateToken, loginLimiter, updateProfilePicture)
router.post('/subscribeToNewsletter', subscribeToNewsletter)
router.get('/unsubscribeFromNewsletter', unsubscribeFromNewsletter)

//otp related routes
router.post('/sendotp', loginLimiter, sendOtp); // otp for password reset or verification
router.post('/verifyOtp', loginLimiter, verifyOtp) // verify otp for password reset or verification
router.post('/resetPassword', loginLimiter, otpIsVerified, resetPassword); // reset password after otp verification



router.get('/getWriters',getWriters); // for landing page
router.get('/getRandomBlogs', getRandomBlogs);






//blog related routes
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
router.get('/getBlogSuggestion/:id', getBlogSuggestion)

//tags related routes
router.get('/getTags', authenticateToken, getTags);


//anonymous routes
router.post('/contactMe', loginLimiter, contactMeEmailSender)
router.get('/getWeather', loginLimiter, async (req, res) => {
    try {
        const response = await fetchWeather();
        if (!response) {
            return res.status(500).json({ message: 'Failed to fetch weather data' });
        }
        return res.status(200).json({ message: 'Weather data fetched successfully', response });

    } catch (error) {
        console.error("Error fetching weather data:", error);
        return res.status(500).json({ message: 'Internal Server Error' });

    }
})
router.post('/addCommentsToBlog/:id', loginLimiter, addCommentsToBlog);
router.get('/getblogComments/:id', getblogComments);
router.post('/incrementCount/:id', incrementCount);

// router.post('/generateSlugs', loginLimiter, generateSlugs);


module.exports = router;