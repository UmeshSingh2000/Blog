const bcrypt = require('bcrypt');
const comparePassword = async (password, hashedPassword) => {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
        console.error('Error comparing password:', error);
        return false;
    }
}
module.exports = {
    comparePassword
};