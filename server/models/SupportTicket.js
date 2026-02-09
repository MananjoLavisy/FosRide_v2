const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, refPath: 'messages.senderModel' },
  senderModel: { type: String, enum: ['User', 'Driver', 'Admin'], default: 'User' },
  senderRole: { type: String, enum: ['user', 'driver', 'admin'] },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const supportTicketSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, refPath: 'userModel', required: true },
  userModel: { type: String, enum: ['User', 'Driver'], required: true },
  userRole: { type: String, enum: ['user', 'driver'], required: true },
  subject: { type: String, required: true },
  messages: [messageSchema],
  status: { type: String, enum: ['open', 'in_progress', 'closed'], default: 'open' },
}, { timestamps: true });

module.exports = mongoose.model('SupportTicket', supportTicketSchema);
