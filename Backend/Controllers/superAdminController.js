const User = require('../Database/Models/userSchema')
const fs = require('fs');
const path = require('path');
const { hashPass } = require('../Helpers/hashPassword');
const sendEmail = require('../Helpers/mailer');

const getAllUsers = async (req, res) => {
    try {
        const {id} = req.user
        const filter = {_id : {$ne : id}}
        
        const limit = req.params.limit || 10
        const page = req.params.page || 1
        const skip = (page - 1) * limit
        const totalUsers = await User.countDocuments(filter);

        const users = await User.find(filter)
            .skip(skip)
            .limit(limit)

        res.status(200).json({
            users,
            totalUsers,
            totalPages: Math.ceil(totalUsers / limit),
            currentPage: page
        })
    } catch (error) {
        console.error("Error fetching users:", error)
        res.status(500).json({ message: "Internal server error" })
    }
}


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


const blockUserAccount = async(req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.status = 'blocked';
        await user.save();
        res.status(200).json({ message: 'User account blocked successfully', user });
    } catch (error) {
        console.error('Error blocking user account:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}


module.exports = {
    getAllUsers,
    registeruser,
    blockUserAccount
}