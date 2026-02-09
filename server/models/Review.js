const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  ride:         { type: mongoose.Schema.Types.ObjectId, ref: 'Ride', required: true },
  reviewer:     { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'reviewerModel' },
  reviewerModel: { type: String, enum: ['User', 'Driver'], required: true },
  reviewerRole: { type: String, enum: ['user', 'driver'], required: true },
  reviewee:     { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'revieweeModel' },
  revieweeModel: { type: String, enum: ['User', 'Driver'], required: true },
  revieweeRole: { type: String, enum: ['user', 'driver'], required: true },
  rating:       { type: Number, required: true, min: 1, max: 5 },
  comment:      { type: String, default: '' },
}, { timestamps: true });

// Unique: one review per ride per reviewer
reviewSchema.index({ ride: 1, reviewer: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
