const express = require('express');
const { adminProtect } = require('../middleware/adminauth');
const { getAllUsers, deleteUser, getAllExpenses, getAdminProfile, getAdminOverview,  updateAdminProfile, deleteAdminAccount, updateAdminPassword } = require('../controllers/adminController');


const router = express.Router();

//Potected routes
router.get("/dashboard", adminProtect, (req, res) => {
  res.json({
    message: "Welcome to the admin dashboard",
    admin: req.admin,
  });
});

// View all users
router.get('/users', adminProtect, getAllUsers);

//Detele User
router.delete('/users/:id', adminProtect, deleteUser);

//View All expenses
router.get('/expenses', adminProtect, getAllExpenses);

router.get('/me', adminProtect, getAdminProfile);

router.get('/overview', adminProtect, getAdminOverview);

router.put('/profile', adminProtect, updateAdminProfile);

router.delete('/delete', adminProtect, deleteAdminAccount);

router.put('/update-password', adminProtect, updateAdminPassword);

router.put('/me', adminProtect, updateAdminProfile);


module.exports = router;