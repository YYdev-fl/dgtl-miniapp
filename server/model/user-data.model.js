const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  telegramId: { type: Number, required: true, unique: true },
  firstName: { type: String, required: false },
  lastName: { type: String },
  username: { type: String },
  referralCode: { type: String, unique: true },
  referrerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  referredUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  rewardPoints: { type: Number, default: 0 },
  joinedAt: { type: Date, default: Date.now },
  tasksCompleted: { type: Number, default: 0 },
  lastActiveAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
