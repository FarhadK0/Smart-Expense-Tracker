const express = require('express');
const { adminLogin, adminRegister, forgotAdminPassword, resetAdminPassword} = require('../controllers/adminauthController');

const router = express.Router();

//POST /api/admin/login
router.post('/login', adminLogin);
router.post('/signup', adminRegister);
router.post("/forgot-password", forgotAdminPassword);
router.post('/reset-password/:token', resetAdminPassword);


module.exports = router;