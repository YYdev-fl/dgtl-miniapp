import { getSession } from 'next-auth/react';
import type { NextApiRequest, NextApiResponse } from 'next';
import UserModel from '../../models/User';

interface UpdateCoinsRequest extends NextApiRequest {
  body: {
    totalCollectedValue: number;
  };
}

export default async function handler(req: UpdateCoinsRequest,res: NextApiResponse) {
  const session = await getSession({ req });

  // Check if the user is authenticated
  if (!session || !session.user || !session.user.telegramId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { totalCollectedValue } = req.body;

  // Validate the collected value
  if (typeof totalCollectedValue !== 'number' || totalCollectedValue < 0) {
    return res.status(400).json({ error: 'Invalid collected value' });
  }

  try {
    // Increment user's coins in the database
    const user = await UserModel.findOneAndUpdate(
      { telegramId: session.user.telegramId },
      { $inc: { coins: totalCollectedValue } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({
      message: 'Coins updated successfully',
      coins: user.coins,
    });
  } catch (error) {
    console.error('Error updating coins:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
