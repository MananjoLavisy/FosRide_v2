const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const driverSchema = new mongoose.Schema({
  username:      { type: String, required: true, unique: true, trim: true },
  email:         { type: String, required: true, unique: true, trim: true, lowercase: true },
  password:      { type: String, required: true },
  mobileNumber:  { type: String, required: true },
  driverLicense: { type: String, required: true },
  nationalID:    { type: String, required: true },
  accountStatus: { type: Boolean, default: false },  // false = pending admin approval
  suspended:     { type: Boolean, default: false },
  favoriteAreas: [{ type: String, trim: true }],
  ratings:       [{ type: Number, min: 1, max: 5 }],
  role:          { type: String, default: 'driver', enum: ['driver'] },
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
