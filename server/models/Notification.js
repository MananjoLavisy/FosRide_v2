const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient:     { type: mongoose.Schema.Types.ObjectId, required: true },
  recipientRole: { type: String, enum: ['user', 'driver', 'admin'], required: true },
  type:          { type: String, enum: ['ride_offer', 'ride_accepted', 'ride_completed', 'new_message', 'new_review', 'driver_approved'], required: true },
  title:         { type: String, required: true },
  body:          { type: String, default: '' },
  relatedId:     { type: mongoose.Schema.Types.ObjectId, default: null },
  read:          { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
