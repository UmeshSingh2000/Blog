const express = require('express');
const authenticateToken = require('../Middlewares/authenticateToken');
const { getAllUsers, registeruser, blockUserAccount } = require('../Controllers/superAdminController');
const isSuperAdmin = require('../Middlewares/isSuperAdmin');
const { loginLimiter } = require('../Helpers/rateLimiter');

const router = express.Router();

router.post('/register', authenticateToken,isSuperAdmin, loginLimiter, registeruser);
router.get('/getAllUsers',authenticateToken,isSuperAdmin,getAllUsers)
router.post('/blockUserAccount/:id', authenticateToken, isSuperAdmin, blockUserAccount)



module.exports = router;