const User = require('../model/user-data.model.js');

const createUser = async (userData) => {
  const user = new User(userData);
  return await user.save();
};

const findUserByTelegramId = async (telegramId) => {
  return await User.findOne({ telegramId });
};

const updateUserActivity = async (telegramId) => {
  return await User.findOneAndUpdate(
    { telegramId },
    { lastActiveAt: new Date() },
    { new: true }
  );
};

module.exports = {
  createUser,
  findUserByTelegramId,
  updateUserActivity,
};
