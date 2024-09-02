const User = require('../model/user-data.model.js');

const syncUserData = async (req, res) => {
  const { telegramId, firstName, lastName, username } = req.body;

  try {
    let user = await User.findOne({ telegramId });
    if (user === null) {
      user = new User({
        telegramId,
        firstName,
        lastName,
        username,
        referralCode: '', 
        referrerId: null, 
        referredUsers: [],
        rewardPoints: 0,
        joinedAt: new Date(),
        tasksCompleted: 0,
        lastActiveAt: new Date()
      });

      await user.save();
    } else {
      user.lastActiveAt = new Date();
      await user.save();
    }

    res.send({ success: true, message: 'User data synced successfully', data: user });
  } catch (error) {
    console.error('Error syncing user data:', error);
    res.status(500).send({ success: false, message: 'Failed to sync user data' });
  }
};

module.exports = { syncUserData };
