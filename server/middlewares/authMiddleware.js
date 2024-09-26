const { validateTelegramData } = require('../utils/telegramAuth');
const UserService = require('../services/authService');

const telegramAuthMiddleware = async (req, res, next) => {
  const initData = req.query.initData || req.headers['x-telegram-initdata'];

  if (!initData) {
    return res.status(401).json({ error: 'Unauthorized: Missing initData' });
  }

  try {
    const isValid = validateTelegramData(initData);

    if (!isValid) {
      return res.status(401).json({ error: 'Unauthorized: Invalid signature' });
    }

    const telegramUser = JSON.parse(decodeURIComponent(initData));
    req.user = await UserService.findOrCreateUser(telegramUser);

    req.session.userId = req.user._id; // Store user ID in session
    next();
  } catch (error) {
    console.error('Telegram Auth Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = telegramAuthMiddleware;
