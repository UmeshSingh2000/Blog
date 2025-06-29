const User = require('../Database/Models/userSchema');
const { hashPass } = require('../Helpers/hashPassword');
const seedSuperAdmin = async () => {
    try {
        const superAdminExists = await User.findOne({
            // role: 'superAdmin'
            email : "lalit2013singh@gmail.com"
        })
        if (superAdminExists) {
            console.log('Super Admin already exists');
            return;
        }
        const password = process.env.SUPER_ADMIN_PASSWORD || 'defaultSuperAdminPassword';
        const superAdmin = new User({
            name: 'Lalit Singh',
            email: 'lalit2013singh@gmail.com',
            password: await hashPass(password),
            role: 'superAdmin',
        })
        await superAdmin.save();
        console.log('Super Admin seeded successfully')
    }
    catch (error) {
        console.error('Error seeding super admin:', error);
    }
}
module.exports = {
    seedSuperAdmin
}