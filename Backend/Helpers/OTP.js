const User = require('../Database/Models/userSchema')
const bcrypt = require('bcrypt');

const generateOtp = ()=>{
    try{
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        return otp;
    }
    catch (error) {
        console.error("Error generating OTP:", error);
        throw new Error("Failed to generate OTP");
    }
}

const verifyOtpHelper = async(otp, email) => {
    try {
        if (!otp || typeof otp !== 'string') {
            return {success:false,message:"Invalid OTP format"};
        }
        const user = await User.findOne({email});
        if (!user) {
            return { success: false, message: "User not found!" };
        }
        const isOtpValid = await bcrypt.compare(otp, user.otp);
        if (!isOtpValid) {
            return { success: false, message: "Wrong Otp" };
        }
        // If OTP matches, clear the OTP field
        user.otp = null;
        user.otpVerified = true; // Mark OTP as verified
        await user.save();
        return { success: true, message: "OTP verified successfully" };
    } catch (error) {
        console.error("Error in OTP verification:", error);
        return { success: false, message: "OTP verification failed" };
    }
}

module.exports = {verifyOtpHelper, generateOtp};