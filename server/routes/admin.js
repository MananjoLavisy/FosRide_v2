const express = require('express');
const Driver = require('../models/Driver');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

// ─── List pending driver registrations ───
router.get('/pending-drivers', auth, requireRole('admin'), async (req, res) => {
  try {
    const drivers = await Driver.find({ accountStatus: false, suspended: false })
      .select('-password');
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Approve driver registration ───
router.put('/approve-driver/:driverId', auth, requireRole('admin'), async (req, res) => {
  try {
    const driver = await Driver.findByIdAndUpdate(
      req.params.driverId,
      { accountStatus: true },
      { new: true }
    ).select('-password');
    if (!driver) return res.status(404).json({ message: 'Driver not found' });
    res.json({ message: 'Driver approved', driver });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Suspend driver account ───
router.put('/suspend-driver/:driverId', auth, requireRole('admin'), async (req, res) => {
  try {
    const driver = await Driver.findByIdAndUpdate(
      req.params.driverId,
      { accountStatus: false, suspended: true },
      { new: true }
    ).select('-password');
    if (!driver) return res.status(404).json({ message: 'Driver not found' });
    res.json({ message: 'Driver suspended', driver });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Reactivate driver account ───
router.put('/reactivate-driver/:driverId', auth, requireRole('admin'), async (req, res) => {
  try {
    const driver = await Driver.findByIdAndUpdate(
      req.params.driverId,
      { accountStatus: true, suspended: false },
      { new: true }
    ).select('-password');
    if (!driver) return res.status(404).json({ message: 'Driver not found' });
    res.json({ message: 'Driver reactivated', driver });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── List all drivers ───
router.get('/drivers', auth, requireRole('admin'), async (req, res) => {
  try {
    const drivers = await Driver.find().select('-password');
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
