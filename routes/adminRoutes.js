const express = require('express');
const {
  login,
  listMarketerRequests,
  updateMarketerVerification,
  listVerifiedMarketers,
  listMarketersByApproval
} = require('../controller/adminController');
const protect = require('../middleware/auth');   // ← your middleware

const router = express.Router();

// Admin login (no auth)
router.post('/login', login);

// List pending marketer requests (protected)
router.get(
  '/marketer-requests',
  protect,                                // ← use it directly
  listMarketerRequests
);

// Approve/reject marketer (protected)
router.post(
  '/marketers/:marketerId/verify',
  protect,                                // ← again, no parentheses
  updateMarketerVerification
);

router.get('/marketers/getlist', listVerifiedMarketers);
router.post('/marketers/status', listMarketersByApproval);


module.exports = router;
