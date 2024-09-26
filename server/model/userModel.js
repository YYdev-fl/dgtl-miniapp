const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  telegramId: { type: Number, required: true, unique: true },
  firstName: { type: String },
  lastName: { type: String },
  username: { type: String },
  photoUrl: { type: String },
  authDate: { type: Date },
  referralCode: { type: String, unique: true },
  rewardPoints: { type: Number, default: 0 },
  lastActiveAt: { type: Date, default: Date.now },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;
