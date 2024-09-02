const logger = (message) => {
    console.log(`[${new Date().toISOString()}] ${message}`);
  };
  
module.exports = logger;
  