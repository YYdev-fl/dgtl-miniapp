const TelegramBot = require('node-telegram-bot-api');

// Telegram Bot Setup
const token = '7218488171:AAGwjwyeIGUk6NDnMsLcuxEmZudB2pDlOUI';  
const bot = new TelegramBot(token, { polling: true });

// Example command handler
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Welcome to our service!');
});

// Example message handler
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const receivedText = msg.text;

  // Example: Echo back the received text
  bot.sendMessage(chatId, `You said: ${receivedText}`);
});
