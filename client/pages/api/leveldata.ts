import { NextApiRequest, NextApiResponse } from 'next';
import Level from '../../models/Level';
import '../../lib/mongodb'; // Make sure this file connects to your DB

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ message: 'Method not allowed' });
    }

    const levels = await Level.find({}).sort({ order: 1 }).lean();
    return res.status(200).json(levels);
  } catch (error) {
    console.error('Error fetching levels:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
