const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
  question_fr: { type: String, required: true },
  question_en: { type: String, required: true },
  question_mg: { type: String, required: true },
  answer_fr: { type: String, required: true },
  answer_en: { type: String, required: true },
  answer_mg: { type: String, required: true },
  category: { type: String, default: 'general' },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('FAQ', faqSchema);
