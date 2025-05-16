const Admin = require('../models/admin');
const jwt = require('jsonwebtoken');
const Marketer = require('../models/marketer');

// Admin login unchanged
exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Both fields are required' });
  }
  const admin = await Admin.findOne({ email: email.toLowerCase() });
  if (!admin || !(await admin.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign(
    { _id: admin._id, adminId: admin.adminId, email: admin.email },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
  return res.json({ token, adminId: admin.adminId });
};

// List pending marketer signup requests (status = 0)
exports.listMarketerRequests = async (req, res) => {
  try {
    const requests = await Marketer
      .find({ status: 0 })
      .sort({ createdAt: -1 })
      .select('-password -__v -_id');

    return res.json({
      status: 'success',
      message: 'Pending marketer signup requests',
      data: requests
    });
  } catch (err) {
    console.error('Error listing marketer requests:', err);
    return res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

// controllers/adminController.js

exports.updateMarketerVerification = async (req, res) => {
  try {
    const { marketerId } = req.params;
    const { action } = req.body;

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({
        status: 'error',
        message: '`action` must be either "approve" or "reject"',
      });
    }

    const status = action === 'approve' ? 1 : 2;

    const marketer = await Marketer.findOneAndUpdate(
      { marketerId },
      { status },
      { new: true }
    );

    if (!marketer) {
      return res.status(404).json({
        status: 'error',
        message: 'Marketer not found',
      });
    }

    return res.json({
      status: 'success',
      message: `Marketer ${action}d`,
      data: {
        marketerId,
        status,
      },
    });

  } catch (err) {
    console.error('Error updating marketer verification:', err);
    return res.status(500).json({
      status: 'error',
      message: 'Server error',
    });
  }
};

// List approved marketers (status = 1)
exports.listVerifiedMarketers = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, parseInt(req.query.limit, 10) || 10);
    const skip = (page - 1) * limit;

    const total = await Marketer.countDocuments({ status: 1 });
    const totalPages = Math.ceil(total / limit);

    const marketers = await Marketer
      .find({ status: 1 })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      status: 'success',
      message: 'List of approved marketers',
      data: marketers.map(m => ({
        marketerId: m.marketerId,
        name: m.name,
        email: m.email,
        phoneNumber: m.phoneNumber,
        role: m.role,
        verifiedAt: m.updatedAt
      })),
      meta: { total, page, limit, totalPages }
    });
  } catch (err) {
    console.error('Error listing verified marketers:', err);
    return res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

exports.listMarketersByApproval = async (req, res) => {
  try {
    const { isApproved } = req.body;

    if (![0, 1].includes(isApproved)) {
      return res.status(400).json({
        status: 'error',
        message: '`isApproved` must be 1 (approved) or 0 (rejected)'
      });
    }

    // Mapping isApproved to status:
    const statusValue = isApproved === 1 ? 1 : 2;

    const marketers = await Marketer
      .find({ status: statusValue })
      .sort({ updatedAt: -1 })
      .select('marketerId name email phoneNumber role updatedAt');

    return res.status(200).json({
      status: 'success',
      message: isApproved === 1 ? 'Approved marketers list' : 'Rejected marketers list',
      data: marketers.map(m => ({
        marketerId: m.marketerId,
        name: m.name,
        email: m.email,
        phoneNumber: m.phoneNumber,
        role: m.role,
        updatedAt: m.updatedAt
      }))
    });
  } catch (err) {
    console.error('Error listing marketers by approval status:', err);
    return res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};
