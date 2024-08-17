const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  telegramId: {
    type: Number,
    unique: true, // Ensures each telegramId is unique
    required: true, // telegramId is required
  },
  firstName: {
    type: String,
    required: true, // firstName is required
  },
  lastName: {
    type: String,
    required: true, // lastName is required
  },
  username: {
    type: String,
    unique: true, // Ensures each username is unique
    required: true, // username is required
  },
  referralCode: {
    type: String,
    unique: true, // Ensures each referralCode is unique
    required: true, // referralCode is required
  },
  referrerId: {
    type: Number,
    default: null, // referrerId is optional and defaults to null
  },
  referredUsers: {
    type: [Number], // Array of numbers representing Telegram IDs of referred users
    default: [], // Defaults to an empty array if no users are referred
  },
  rewardPoints: {
    type: Number,
    default: 0, // Defaults to 0 reward points
  },
  joinedAt: {
    type: Date,
    required: true, // joinedAt is required
    default: Date.now, // Defaults to the current date and time if not provided
  },
  tasksCompleted: {
    type: Number,
    default: 0, // Defaults to 0 tasks completed
  },
  lastActiveAt: {
    type: Date,
    required: true, // lastActiveAt is required
    default: Date.now, // Defaults to the current date and time if not provided
  },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;

