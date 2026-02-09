const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  user:            { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  driver:          { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', default: null },
  source:          { type: String, required: true, trim: true },
  destination:     { type: String, required: true, trim: true },
  sourceCoords:    {
    lat: { type: Number, default: null },
    lng: { type: Number, default: null },
  },
  destCoords:      {
    lat: { type: Number, default: null },
    lng: { type: Number, default: null },
  },
  transportType:   { type: String, enum: ['voiture', 'taxi', 'moto', 'bateau', 'lakana'], required: true, default: 'voiture' },
  passengerCount:  { type: Number, default: 1 },
  price:           { type: Number, default: null },
  status:          { type: String, enum: ['pending', 'offered', 'accepted', 'completed', 'cancelled'], default: 'pending' },
  discount:        { type: Number, default: 0 },
  scheduledAt:     { type: Date, default: null },
  scheduledEnd:    { type: Date, default: null },
  isLongTrip:      { type: Boolean, default: false },
  paymentMethod:   { type: String, enum: ['cash', 'mvola', 'orange_money', 'airtel_money'], default: 'cash' },
  paymentStatus:   { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' },
  completedAt:     { type: Date, default: null },
  cancelledAt:     { type: Date, default: null },
  cancelReason:    { type: String, default: '' },
  driverOffers:    [{
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
    price:  { type: Number, required: true },
  }],
}, { timestamps: true });

module.exports = mongoose.model('Ride', rideSchema);
