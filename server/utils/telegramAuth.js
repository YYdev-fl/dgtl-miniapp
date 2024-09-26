const crypto = require('crypto');

const validateTelegramData = (initData) => {
  const dataCheckString = Object.keys(initData)
    .filter(key => key !== 'hash')
    .sort()
    .map(key => `${key}=${initData[key]}`)
    .join('\n');

  const secretKey = crypto.createHash('sha256')
    .update(process.env.TELEGRAM_BOT_TOKEN)
    .digest();

  const hmac = crypto.createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');

  return hmac === initData.hash;
};

module.exports = { validateTelegramData };
