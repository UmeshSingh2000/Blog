//password hashing function using bcrypt
const bcrypt = require('bcrypt');
const hashPass = async(password) => {
    return await bcrypt.hash(password, 10)
}
module.exports = {
    hashPass
}