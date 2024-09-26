const authController = async (req, res) => {
    try {
      const user = req.user;
      res.json({ success: true, data: user });
    } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  module.exports = { authController };
  