import { getServerSession } from 'next-auth';
import UserModel from '../../models/User';
import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/mongodb';
import authOptions from '@/pages/api/auth/[...nextauth]';
import { Session } from 'next-auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Request Headers:', req.headers);

  // Use getServerSession to retrieve session on the server-side
  const session: Session | null = await getServerSession(req, res, authOptions);
  console.log('Request session:', session);

  // Check if the session exists (i.e., user is authenticated)
  if (!session?.user?.telegramId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }

  const { amount } = req.body;

  if (typeof amount !== 'number' || amount <= 0) {
    res.status(400).json({ message: 'Invalid amount' });
    return;
  }

  try {
    // Connect to MongoDB
    await connectToDatabase();

    // Update user's coins in the database
    const updatedUser = await UserModel.findOneAndUpdate(
      { telegramId: session.user.telegramId },
      { $inc: { coins: amount } },
      { new: true }
    ).lean();

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({ message: 'Coins updated successfully', coins: updatedUser.coins });
  } catch (error) {
    console.error('Error updating coins:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
