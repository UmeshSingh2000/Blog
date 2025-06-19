const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
    name:{
        type: String,
        required: true  
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin','superAdmin','user'],
        default: 'user'
    },
    otp: {
        type: String
    },
    otpVerified: {
        type: Boolean,
        default: false
    },
    profilePicture: {
        data: Buffer,
        contentType: String
    },
},{
    timestamps: true
})
const Admin = mongoose.model('User', userSchema);
module.exports = Admin;