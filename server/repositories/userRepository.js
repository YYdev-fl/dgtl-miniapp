const User = require('../models/userModel');

const findByTelegramId = async (telegramId) => {
  return User.findOne({ telegramId });
};

const createUser = async (userData) => {
  const user = new User(userData);
  return await user.save();
};

module.exports = {
  findByTelegramId,
  createUser,
};
