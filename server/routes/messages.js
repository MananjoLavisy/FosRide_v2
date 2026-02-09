const express = require('express');
const Message = require('../models/Message');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get conversations list for current user
router.get('/conversations', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    // Find all unique conversations where user is a participant
    const messages = await Message.aggregate([
      { $match: { conversation: { $regex: userId } } },
      { $sort: { createdAt: -1 } },
      { $group: {
        _id: '$conversation',
        lastMessage: { $first: '$content' },
        lastDate: { $first: '$createdAt' },
        unread: { $sum: { $cond: [{ $and: [{ $ne: ['$sender', new (require('mongoose').Types.ObjectId)(userId)] }, { $eq: ['$read', false] }] }, 1, 0] } },
      }},
      { $sort: { lastDate: -1 } },
    ]);

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get messages for a conversation
router.get('/:conversationId', auth, async (req, res) => {
  try {
    const messages = await Message.find({ conversation: req.params.conversationId })
      .sort('createdAt')
      .limit(100);

    // Mark as read
    await Message.updateMany(
      { conversation: req.params.conversationId, sender: { $ne: req.user.id }, read: false },
      { read: true }
    );

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Send a message
router.post('/', auth, async (req, res) => {
  try {
    const { conversationId, recipientId, content, rideId } = req.body;
    // Conversation ID format: sorted "userId1_userId2"
    const convId = conversationId || [req.user.id, recipientId].sort().join('_');

    const message = await Message.create({
      conversation: convId,
      ride: rideId || null,
      sender: req.user.id,
      senderRole: req.user.role,
      content,
    });

    // Emit via Socket.IO
    const io = req.app.get('io');
    if (io) {
      const recipientSocketId = recipientId || convId.split('_').find(id => id !== req.user.id);
      io.to(`user_${recipientSocketId}`).to(`driver_${recipientSocketId}`).emit('new_message', {
        message,
        conversationId: convId,
      });
    }

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
