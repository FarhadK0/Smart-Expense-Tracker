const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');

exports.adminProtect = async (req, res, next) => {

  let token;

  //Chcek for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    //Set token from Bearer token
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized to access this route' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //Attach admin to request
    req.admin = await Admin.findById(decoded.id).select("-password");

    if (!req.admin) {
    return res.status(401).json({message: 'Not authorized to access this route'});
    }
    next();
  }
  catch (err) {
    res.status(401).json({ message: 'Not authorized to access this route' });
  }
};