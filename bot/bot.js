const TelegramBot = require('node-telegram-bot-api');

// Telegram Bot Setup
const token = '7218488171:AAGwjwyeIGUk6NDnMsLcuxEmZudB2pDlOUI';  
const webAppUrl = 'https://dgtl-miniapp.vercel.app';
const bot = new TelegramBot(token, { polling: true });

const inlineKeyboard = {
  inline_keyboard: [
    [{ text: 'Play now!', web_app: {url : webAppUrl} }]
  ]
};

// Example command handler
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Welcome to DGTL P2E game!', { reply_markup: inlineKeyboard });
});

