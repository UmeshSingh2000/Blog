const User = require('../Database/Models/userSchema');
const { comparePassword } = require('../Helpers/comparePassword');
const generateToken = require('../Helpers/generateToken');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const path = require('path');
const { hashPass } = require('../Helpers/hashPassword');
const sendEmail = require('../Helpers/mailer');
const { generateOtp, verifyOtpHelper } = require('../Helpers/OTP');
const registeruser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email, and password are required' });
        }
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Create new user
        const newUser = new User({
            name,
            email,
            password: await hashPass(password), // Password should be hashed before saving in production
            role: role // Default role is 'user'
        });

        let html = fs.readFileSync(path.join(__dirname, '../Helpers/account-created.html'), 'utf-8');
        html = html
            .replace('{{name}}', name)
            .replace('{{email}}', email)
            .replace('{{password}}', password); // only if it's a generated password
        await sendEmail({
            to: email,
            subject: 'Account Created Successfully',
            html: html
        })
        await newUser.save();
        res.status(201).json({ message: 'User created successfully', user: newUser });
    }
    catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Validate input
        if (!email || !password) {
            return res.status(400).jzson({ message: 'Email and password are required' });
        }
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        const token = generateToken(user._id, user.role, user.email);
        // res.cookie('token', token, {
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        //     sameSite: 'None', // Prevent CSRF attacks,
        //     maxAge: 24 * 60 * 60 * 1000, // 1 day
        //     path: '/' // Ensure the cookie is accessible on all routes
        // })
        // If password is valid, return user data (excluding password)
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}



const sendOtp = async (req, res) => {
    try {
        const { email } = req.body
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const otp = generateOtp();
        let html = fs.readFileSync(path.join(__dirname, '../Helpers/otpEmail.html'), 'utf-8');
        html = html
            .replace('{{otp}}', otp)
            .replace('{{name}}', user.name)
        await sendEmail({
            to: email,
            subject: 'Password Reset OTP',
            html: html
        })
        // Save OTP to user document (you might want to hash it before saving)
        user.otp = await hashPass(otp); // Store OTP in user document
        user.otpVerified = false;
        await user.save();
        res.status(200).json({ message: 'OTP sent successfully' });
    }
    catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

const verifyOtp = async (req, res) => {
    try {
        // const {id} = req.user;
        const { otp, email } = req.body;
        if (!otp || !email) {
            return res.status(400).json({ message: 'OTP and email is required' });
        }
        const isValid = await verifyOtpHelper(otp, email);
        if (!isValid.success) {
            return res.status(400).json({ message: isValid.message });
        }
        res.status(200).json({ message: isValid.message });
    }
    catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}


const resetPassword = async (req, res) => {
    try {
        const { newPassword, email } = req.body;
        // const {id} = req.user;
        if (!newPassword || !email) {
            return res.status(400).json({ message: 'new password and email are required' });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.password = await hashPass(newPassword);
        user.otpVerified = false;
        await user.save();
        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}


const getMyData = async (req, res) => {
    try {
        const { id } = req.user; // Assuming user ID is stored in req.user
        const user = await User.findById(id).select('-password -otpVerified -otp'); // Exclude password from response
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ user });
    }
    catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

//check password for user
const verifyPassword = async (req, res) => {
    try {
        const { id } = req.user; // Assuming user ID is stored in req.user
        const { password } = req.body;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        res.status(200).json({ message: 'Password verified successfully' });
    } catch (error) {
        console.error('Error verifying password:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}


const updateProfilePicture = async (req, res) => {
    try {
        const { id } = req.user;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const profilePictureFile = req.files?.profilePicture?.[0];
        if (!profilePictureFile) {
            return res.status(400).json({ message: "Profile picture is required" });
        }
        const profilePictureResult = await cloudinary.uploader.upload(profilePictureFile.path, {
            folder: "blog_images/profile_pictures",
            transformation: [
                { width: 1200, crop: 'limit' },
                { quality: "auto" },
                { fetch_format: "auto" }
            ]
        });
        fs.unlinkSync(profilePictureFile.path);
        user.profilePicture = profilePictureResult.secure_url;
        await user.save();
        res.status(200).json({ message: 'Profile picture updated successfully', user });
    } catch (error) {
        console.error('Error updating profile picture:', error);
        res.status(500).json({ message: 'Server error', error: error.message });

    }
}

const updateProfile = async (req, res) => {
    try {
        const { id } = req.user;
        const data = req.body;
        if (data.password) {
            data.password = await hashPass(data.password); // Hash the password before saving
        }
        const user = await User.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User data updated successfully', user });
    } catch (error) {
        console.error('Error updating user data:', error);
        res.status(500).json({ message: 'Server error', error: error.message });

    }
}

// Subscribe to newsletter
const subscribeToNewsletter = async (req, res) => {
    try {
        const { email, userId } = req.body;
        if (!email || !userId) {
            return res.status(400).json({ message: 'Email and userId is required' });
        }
        const isUser = await User.findById(userId);
        if (!isUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (isUser.subscribers.includes(email)) {
            return res.status(400).json({ message: 'You are already subscribed to the newsletter' });
        }
        isUser.subscribers.push(email);
        await isUser.save();
        res.status(200).json({ message: 'Subscribed to newsletter successfully' });

    } catch (error) {
        console.error('Error subscribing to newsletter:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

const unsubscribeFromNewsletter = async (req, res) => {
    try {
        const { email, userId } = req.query;
        if (!email || !userId) {
            return res.status(400).json({ message: 'Email and userId is required' });
        }
        const isUser = await User.findById(userId);
        if (!isUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        isUser.subscribers = isUser.subscribers.filter(subscriber => subscriber !== email);
        await isUser.save();
        res.status(200).json({ message: 'Unsubscribed from newsletter successfully' });

    } catch (error) {
        console.error('Error unsubscribing from newsletter:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}


const contactMeEmailSender = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        let html = fs.readFileSync(path.join(__dirname, '../Helpers/contactMeEmail.html'), 'utf-8');
        html = html
            .replaceAll('{{name}}', name)
            .replaceAll('{{email}}', email)
            .replaceAll('{{message}}', message)
        await sendEmail({
            from: email,
            to: process.env.EMAIL_USER,
            subject: `Contact Me: ${subject}`,
            html
        })
        res.status(200).json({ message: 'Contact email sent successfully' });
    } catch (error) {
        console.error('Error sending contact email:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}


module.exports = {
    loginUser,
    registeruser,
    sendOtp,
    verifyOtp,
    resetPassword,
    getMyData,
    verifyPassword,
    updateProfile,
    subscribeToNewsletter,
    unsubscribeFromNewsletter,
    contactMeEmailSender,
    updateProfilePicture
}