const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  user:            { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  driver:          { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', default: null },
  source:          { type: String, required: true, trim: true },
  destination:     { type: String, required: true, trim: true },
  passengerCount:  { type: Number, default: 1 },
  price:           { type: Number, default: null },
  status:          { type: String, enum: ['pending', 'offered', 'accepted', 'completed', 'cancelled'], default: 'pending' },
  discount:        { type: Number, default: 0 },  // percentage
  driverOffers:    [{
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
    price:  { type: Number, required: true },
  }],
}, { timestamps: true });

module.exports = mongoose.model('Ride', rideSchema);
