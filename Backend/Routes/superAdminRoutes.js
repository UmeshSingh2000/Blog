const express = require('express');
const authenticateToken = require('../Middlewares/authenticateToken');
const { getAllUsers, registeruser, blockUserAccount, unBlockUserAccount } = require('../Controllers/superAdminController');
const isSuperAdmin = require('../Middlewares/isSuperAdmin');
const { loginLimiter } = require('../Helpers/rateLimiter');

const router = express.Router();

router.post('/register', authenticateToken,isSuperAdmin, loginLimiter, registeruser);
router.get('/getAllUsers',authenticateToken,isSuperAdmin,getAllUsers)
router.post('/blockUserAccount/:id', authenticateToken, isSuperAdmin, blockUserAccount)
router.post('/unBlockUserAccount/:id', authenticateToken, isSuperAdmin, unBlockUserAccount)



module.exports = router;