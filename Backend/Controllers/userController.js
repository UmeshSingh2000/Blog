const User = require('../Database/Models/userSchema');
const { comparePassword } = require('../Helpers/comparePassword');
const generateToken = require('../Helpers/generateToken');
const fs = require('fs');
const path = require('path');
const { hashPass } = require('../Helpers/hashPassword');
const sendEmail = require('../Helpers/mailer');
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
            password : await hashPass(password), // Password should be hashed before saving in production
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
            return res.status(400).json({ message: 'Email and password are required' });
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
        const token = generateToken(user._id, user.role);
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: 'None', // Prevent CSRF attacks,
            Secure: true, // Use secure cookies in production
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        })
        // If password is valid, return user data (excluding password)
        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}


module.exports = {
    loginUser,
    registeruser
}