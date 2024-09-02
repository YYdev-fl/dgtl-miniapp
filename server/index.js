require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectToDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);

// Connect to the database and start the server
connectToDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
}).catch((error) => {
  console.error('Failed to connect to the database:', error);
});
