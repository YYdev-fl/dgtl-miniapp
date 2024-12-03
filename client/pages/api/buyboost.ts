import { getServerSession } from "next-auth/next";
import UserModel from "@/models/User";
import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method Not Allowed" });
    }
  
    try {
      await connectToDatabase();
  
      const session = await getServerSession(req, res, authOptions);
      if (!session?.user?.telegramId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
  
      const { boostType } = req.body;
  
      if (!boostType) {
        return res.status(400).json({ message: "Boost type is required" });
      }
  
      const cost = 100; // Adjust the cost as needed
  
      // Fetch the user from the database
      const user = await UserModel.findOne({ telegramId: session.user.telegramId }).lean();
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      if (user.coins < cost) {
        return res.status(400).json({ message: "Not enough coins" });
      }
  
      // Update user's coins and boosts
      const updatedUser = await UserModel.findOneAndUpdate(
        { telegramId: session.user.telegramId },
        {
          $inc: {
            coins: -cost,
            [`boosts.${boostType}`]: 1,
          },
        },
        { new: true }
      ).lean();
  
      // Check if updatedUser is null
      if (!updatedUser) {
        return res.status(404).json({ message: "User update failed. Please try again later." });
      }
  
      res.status(200).json({
        message: "Boost purchased successfully",
        boosts: updatedUser.boosts,
        coins: updatedUser.coins,
      });
    } catch (error) {
      console.error("Error purchasing boost:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
  