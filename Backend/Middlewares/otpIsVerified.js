const User = require('../Database/Models/userSchema');
const otpIsVerified = async(req, res, next) => {
    try {
        const {id} = req.user;
        if (!id) {
            return res.status(400).json({ message: 'User ID is required' });
        }
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (!user.otpVerified) {
            return res.status(403).json({ message: 'OTP not verified' });
        }
        // If OTP is verified, proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error('Error in otpIsVerified middleware:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
module.exports = otpIsVerified;