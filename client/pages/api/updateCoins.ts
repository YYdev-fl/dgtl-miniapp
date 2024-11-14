import { getSession } from 'next-auth/react';
import type { NextApiRequest, NextApiResponse } from 'next';
import UserModel from '../../models/User';
import { connectToDatabase } from '@/lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getSession({ req });
    console.log('Session in /api/updateCoins:', session);

    if (!session || !session.user || !session.user.telegramId) {
      console.log('Failed to retrieve session. Headers:', req.headers);
      console.log('Cookies:', req.cookies);
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { totalCollectedValue } = req.body;

    if (typeof totalCollectedValue !== 'number' || totalCollectedValue < 0) {
      return res.status(400).json({ error: 'Invalid collected value' });
    }
    await connectToDatabase()
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
    console.error('Error in /api/updateCoins:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
