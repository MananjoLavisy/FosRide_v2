const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const vehicleSchema = new mongoose.Schema({
  transportType: { type: String, enum: ['voiture', 'taxi', 'moto', 'bateau', 'lakana'], required: true },
  name:          { type: String, default: '' },
  description:   { type: String, default: '' },
  photos:        [{ type: String }],
  capacity:      { type: Number, default: 4 },
  pricePerKm:    { type: Number, default: null },
  priceRange:    { type: String, default: '' },
  available:     { type: Boolean, default: true },
});

const driverSchema = new mongoose.Schema({
  username:       { type: String, required: true, unique: true, trim: true },
  email:          { type: String, required: true, unique: true, trim: true, lowercase: true },
  password:       { type: String, required: true },
  mobileNumber:   { type: String, required: true },
  driverLicense:  { type: String, required: true },
  nationalID:     { type: String, required: true },
  profilePhoto:   { type: String, default: '' },
  bio:            { type: String, default: '' },
  language:       { type: String, enum: ['fr', 'en', 'mg'], default: 'fr' },
  accountStatus:  { type: Boolean, default: false },
  suspended:      { type: Boolean, default: false },
  favoriteAreas:  [{ type: String, trim: true }],
  transportTypes: [{ type: String, enum: ['voiture', 'taxi', 'moto', 'bateau', 'lakana'] }],
  vehicles:       [vehicleSchema],
  ratings:        [{ type: Number, min: 1, max: 5 }],
  role:           { type: String, default: 'driver', enum: ['driver'] },
}, { timestamps: true });

driverSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

driverSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

driverSchema.virtual('averageRating').get(function () {
  if (this.ratings.length === 0) return 0;
  const sum = this.ratings.reduce((a, b) => a + b, 0);
  return Math.round((sum / this.ratings.length) * 10) / 10;
});

driverSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Driver', driverSchema);
