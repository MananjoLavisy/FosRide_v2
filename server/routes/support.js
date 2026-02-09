const express = require('express');
const FAQ = require('../models/FAQ');
const SupportTicket = require('../models/SupportTicket');
const { auth } = require('../middleware/auth');

const router = express.Router();

// ─── FAQ (public) ───
router.get('/faq', async (req, res) => {
  try {
    const faqs = await FAQ.find().sort('order');
    res.json(faqs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Create a support ticket ───
router.post('/tickets', auth, async (req, res) => {
  try {
    const { subject, message } = req.body;
    if (!subject || !message) {
      return res.status(400).json({ message: 'Subject and message are required' });
    }

    const userModel = req.user.role === 'user' ? 'User' : 'Driver';

    const ticket = await SupportTicket.create({
      user: req.user.id,
      userModel,
      userRole: req.user.role,
      subject,
      messages: [{
        sender: req.user.id,
        senderModel: userModel,
        senderRole: req.user.role,
        content: message,
      }],
    });

    res.status(201).json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Get my tickets ───
router.get('/tickets', auth, async (req, res) => {
  try {
    const tickets = await SupportTicket.find({ user: req.user.id })
      .sort('-createdAt');
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Reply to a ticket ───
router.post('/tickets/:id/reply', auth, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: 'Message is required' });

    const ticket = await SupportTicket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    const isOwner = ticket.user.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const senderModel = req.user.role === 'admin' ? 'Admin' : (req.user.role === 'user' ? 'User' : 'Driver');

    ticket.messages.push({
      sender: req.user.id,
      senderModel,
      senderRole: req.user.role,
      content: message,
    });

    if (isAdmin && ticket.status === 'open') {
      ticket.status = 'in_progress';
    }

    await ticket.save();
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Update ticket status (admin) ───
router.put('/tickets/:id/status', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin only' });
    }

    const { status } = req.body;
    if (!['open', 'in_progress', 'closed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

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

module.exports = router;
