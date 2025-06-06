const jwt = require('jsonwebtoken');
const generateToken = (id,role)=>{
    try{
        const payload = { id, role };
        const secretKey = process.env.JWT_SECRET
        const options = { expiresIn: '1d' }; // Token expires in 1 day
        const token = jwt.sign(payload, secretKey, options);
        return token;
    }
    catch(error){
        console.error('Error generating token:', error);
        throw new Error('Token generation failed');
    }
}
module.exports = generateToken;