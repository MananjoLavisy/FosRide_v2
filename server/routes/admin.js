const express = require('express');
const Driver = require('../models/Driver');
const User = require('../models/User');
const FAQ = require('../models/FAQ');
const SupportTicket = require('../models/SupportTicket');
const Ride = require('../models/Ride');
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

// ─── List all users ───
router.get('/users', auth, requireRole('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── FAQ CRUD ───
router.get('/faq', auth, requireRole('admin'), async (req, res) => {
  try {
    const faqs = await FAQ.find().sort('order');
    res.json(faqs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/faq', auth, requireRole('admin'), async (req, res) => {
  try {
    const faq = await FAQ.create(req.body);
    res.status(201).json(faq);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/faq/:id', auth, requireRole('admin'), async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!faq) return res.status(404).json({ message: 'FAQ not found' });
    res.json(faq);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/faq/:id', auth, requireRole('admin'), async (req, res) => {
  try {
    await FAQ.findByIdAndDelete(req.params.id);
    res.json({ message: 'FAQ deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Support tickets (admin) ───
router.get('/tickets', auth, requireRole('admin'), async (req, res) => {
  try {
    const tickets = await SupportTicket.find().sort('-createdAt');
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/tickets/:id/status', auth, requireRole('admin'), async (req, res) => {
  try {
    const { status } = req.body;
    const ticket = await SupportTicket.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/tickets/:id/reply', auth, requireRole('admin'), async (req, res) => {
  try {
    const { message } = req.body;
    const ticket = await SupportTicket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    ticket.messages.push({
      sender: req.user.id,
      senderModel: 'Admin',
      senderRole: 'admin',
      content: message,
    });

    if (ticket.status === 'open') ticket.status = 'in_progress';
    await ticket.save();
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Statistics ───
router.get('/stats', auth, requireRole('admin'), async (req, res) => {
  try {
    const [totalUsers, totalDrivers, totalRides, pendingRides, completedRides, openTickets] = await Promise.all([
      User.countDocuments(),
      Driver.countDocuments(),
      Ride.countDocuments(),
      Ride.countDocuments({ status: 'pending' }),
      Ride.countDocuments({ status: 'completed' }),
      SupportTicket.countDocuments({ status: { $ne: 'closed' } }),
    ]);
    res.json({ totalUsers, totalDrivers, totalRides, pendingRides, completedRides, openTickets });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
