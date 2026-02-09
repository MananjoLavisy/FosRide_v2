const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  conversation: { type: String, required: true, index: true },
  ride:         { type: mongoose.Schema.Types.ObjectId, ref: 'Ride', default: null },
  sender:       { type: mongoose.Schema.Types.ObjectId, required: true },
  senderRole:   { type: String, enum: ['user', 'driver', 'admin'], required: true },
  content:      { type: String, required: true },
  read:         { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
