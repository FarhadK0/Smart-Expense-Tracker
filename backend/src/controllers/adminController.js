const User = require('../models/User');
const Expense = require('../models/Expense');
const Admin = require('../models/admin');

//Get all Users except admin
exports.getAllUsers = async (req, res) => {
  try { 
      const users = await User.find().select('-password');
      
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Delete a user by ID
exports.deleteUser = async (req, res) => {
 try {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({message: 'User not found'});

  await user.deleteOne();
  res.status(200).json({ success: true, message: 'User deleted successfully'});
 }
 catch (error) {
  console.error("Delete error:", error.message);
  res.status(500).json({success: false, message: 'Server Error'});
 }
};

//Get all user expenses
exports.getAllExpenses = async (req, res) => {
  try {

     const { userId, status, start, end } = req.query;

     const filter = {};

     //Apply filters
     if (userId) filter.userId = userId;
     if (status) filter.status = status;
      if (start && end) {
        filter.date = {
          $gte: new Date(start),
          $lte: new Date(end),
        };
      }

    const expenses = await Expense.find(filter).populate("userId", "name email" );

    res.status(200).json({
      success:true,
      count: expenses.length,
      data: expenses,
    });
  }

  catch (error) {
    console.error("Fetch all expenses error:", error.message);
    res.status(500).json({ success: false, message: "Server Error"});
  }
};

exports.getAdminProfile = async (req, res) => {
  try {
    const admin = req.admin; // set in adminProtect middleware

    res.status(200).json({
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("Error fetching admin profile:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};




exports.getAdminOverview = async (req, res) => {
  try {
    // Count real users
    const totalUsers = await User.countDocuments();

    const totalUsersCombined = totalUsers;

    // Fetch signup and login data
    const userSignup = await User.find()
    .sort({ createdAt: -1 })
    .limit(100)
    .select("name email createdAt");
  
  const recentSignup = userSignup;


  const userLogins = await User.find({ lastLogin: { $exists: true } })
  .sort({ lastLogin: -1 }).limit(100).select("name email lastLogin");
const recentLogins = userLogins;

    // Monthly stats
    const userGrowthRaw = await User.aggregate([
      { $group: { _id: { $month: "$createdAt" }, users: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    const expenseDataRaw = await Expense.aggregate([
      { $group: { _id: { $month: "$date" }, amount: { $sum: "$amount" } } },
      { $sort: { _id: 1 } }
    ]);

    const monthLabels = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

   const userGrowth = monthLabels.map((month, index) => {
    const found = userGrowthRaw.find((item) => item._id === index + 1);
    return {
      month, 
      users:found ? found.users : 0,
    };
   });

    const expenseData = expenseDataRaw.map((item) => ({
      month: monthLabels[item._id - 1],
      amount: item.amount,
    }));

    res.status(200).json({
      totalUsers: totalUsersCombined,
      recentSignup,
      recentLogins,
      userGrowth,
      expenseData,
    });
  } catch (error) {
    console.error("Error fetching admin overview:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.updateAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id);

    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found"})
    }

    admin.name = req.body.name || admin.name;
    admin.email = req.body.email || admin.email;

    await admin.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      }
    });
  }
  catch (error) {
    console.erroer("Profile update error:", error.message);
    res.status(500).json({
      success: false, message:"Server error"
    });
  }
};

exports.deleteAdminAccount = async (req, res) => {

  try {
    const adminId = req.admin.id;

    const admin = await Admin.findById(adminId);

    if (!admin) {
      return res.status(404).json({
        success: false, message: "Admin not found"
      })
    }


    await Admin.findByIdAndDelete(adminId);
    res.status(200).json({
      success: true, message: "Account deleted successfully"
    });
  }
  catch (error) {
    console.error("Account deletion error:", error.message);
    res.status(500).json({
      success: false, message: "Server error"
    });
  }
};

exports.updateAdminPassword = async (req, res) => {

  try {

    const { currentPassword, newPassword} = req.body;
    const admin = await Admin.findById(req.admin.id).select("+password");

    if (!admin) {
      return res.status(404).json({
        success: false, message: "Admin not found"
      });
    }

    const isMatch = await admin.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({success: false, message: "Your current password is incorrect"});  
    }
    admin.password = newPassword;
    await admin.save();
    res.status(200).json({
      success: true, message: "Password updated successfully"
    });
  }
  catch (error) {
    console.error("Password update error:", error.message);
    res.status(500).json({
      success: false, message: "Server error"
    });
  }
}
