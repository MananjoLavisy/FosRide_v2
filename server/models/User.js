const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username:     { type: String, required: true, unique: true, trim: true },
  email:        { type: String, required: true, unique: true, trim: true, lowercase: true },
  password:     { type: String, required: true },
  mobileNumber: { type: String, required: true },
  profilePhoto: { type: String, default: '' },
  bio:          { type: String, default: '' },
  language:     { type: String, enum: ['fr', 'en', 'mg'], default: 'fr' },
  rideCount:    { type: Number, default: 0 },
  ratings:      [{ type: Number, min: 1, max: 5 }],
  role:         { type: String, default: 'user', enum: ['user'] },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.virtual('averageRating').get(function () {
  if (!this.ratings || this.ratings.length === 0) return 0;
  const sum = this.ratings.reduce((a, b) => a + b, 0);
  return Math.round((sum / this.ratings.length) * 10) / 10;
});

userSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', userSchema);
