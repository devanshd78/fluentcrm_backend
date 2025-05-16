const Marketer = require('../models/marketer');
const jwt       = require('jsonwebtoken');

// MARKETER SIGNUP ▶ creates a pending request
exports.register = async (req, res) => {
  try {
    const { name, email, phoneNumber, role, password } = req.body;
    if (!name || !email || !phoneNumber || !role || !password) {
      return res.status(400).json({
        status:  'error',
        message: 'All fields are required'
      });
    }

    const normalizedEmail = email.toLowerCase();

    // look for existing by email OR phoneNumber
    const existing = await Marketer.findOne({
      $or: [
        { email: normalizedEmail },
        { phoneNumber }
      ]
    });

    if (existing) {
      return res.status(409).json({
        status:  'error',
        message: existing.email === normalizedEmail
          ? 'Email already in use'
          : 'Phone number already in use'
      });
    }

    // create as not verified, including password for hashing
    const newMarketer = await Marketer.create({
      name,
      email:       normalizedEmail,
      phoneNumber,
      role,
      password     
    });

    return res.status(201).json({
      status:  'pending',
      message: 'Signup request submitted; pending admin approval',
      data: {
        marketerId:   newMarketer.marketerId,
        name:         newMarketer.name,
        email:        newMarketer.email,
        phoneNumber:  newMarketer.phoneNumber,
        role:         newMarketer.role
      }
    });
  } catch (err) {
    console.error('Marketer signup error:', err);
    return res.status(500).json({
      status:  'error',
      message: 'Server error'
    });
  }
};

// MARKETER LOGIN ▶ only if verified
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Email and password are required'
      });
    }

    const normalizedEmail = email.toLowerCase();
    const marketer = await Marketer.findOne({ email: normalizedEmail });
    if (!marketer || !(await marketer.matchPassword(password))) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }

    if (!marketer.status) {
      return res.status(403).json({
        status: 'error',
        message: 'Account not verified by admin'
      });
    }

    const payload = {
      _id:         marketer._id,
      marketerId:  marketer.marketerId,
      email:       normalizedEmail,
      role:        marketer.role
    };
    const expiresIn = process.env.JWT_EXPIRES_MARKETER || '90d';
    const token     = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });

    return res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        token,
        marketerId: marketer.marketerId,
        email: normalizedEmail,
        role: marketer.role
      }
    });
  } catch (err) {
    console.error('Marketer login error:', err);
    return res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};


