const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const AdminSchema = new mongoose.Schema({

  name: {
    type: String,
    required: [true, 'Please enter  a name'],
  },

  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
    lowercase: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Please enter a valid email',
    ],
  },

  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: 6,
    select: false,
  },

 
  lastLogin: {
    type: Date,
  },

  
  createdAt: {
    type: Date,
    default: Date.now,
  },

  resetPasswordToken: String,
  resetPasswordExpire: Date,
  
 

});

//Hash password before saving
AdminSchema.pre('save', async function (next) {
  // Skip hashing if password is already a bcrypt hash
  if (!this.isModified("password") || this.password.startsWith("$2b$")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//compare entered password with hashed password in the database
AdminSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//Gernate a signed JWT token
AdminSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'

  });
};



module.exports = mongoose.model('Admin', AdminSchema);