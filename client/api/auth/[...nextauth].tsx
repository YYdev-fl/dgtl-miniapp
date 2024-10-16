import NextAuth from 'next-auth';
import { NextApiRequest, NextApiResponse } from 'next';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectToDatabase } from '../../lib/mongodb';
import User from '../../models/User';
import { IUser } from '../../models/User';

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  return NextAuth(req, res, {
    providers: [
      CredentialsProvider({
        name: 'Telegram',
        credentials: {
          initData: { label: 'Telegram Init Data', type: 'text' }
        },
        async authorize(credentials) {
          const initData = credentials?.initData;
          if (!initData) {
            throw new Error('Missing Telegram Init Data');
          }

          let telegramUser;
          try {
            telegramUser = JSON.parse(initData).user;
          } catch (error) {
            throw new Error('Invalid Telegram Init Data format');
          }

          const telegramId = telegramUser?.id;
          const firstName = telegramUser?.first_name || '';
          const lastName = telegramUser?.last_name || '';
          const username = telegramUser?.username || '';

          if (!telegramId) {
            throw new Error('Telegram user ID is missing');
          }

          await connectToDatabase();

          let user = await User.findOne({ telegramId });

          if (!user) {
            user = new User({
              telegramId,
              firstName,
              lastName,
              username,
            }) as IUser;
            await user.save();
          }

          // Return the user object
          return {
            id: user._id.toString(), // Ensure the MongoDB _id is converted to a string
            telegramId: user.telegramId,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
          };
        },
      }),
    ],
    callbacks: {
      async session({ session, token }) {
        session.user = {
          ...session.user,
          id: token.id,
          telegramId: token.telegramId,
          firstName: token.firstName,
          lastName: token.lastName,
          username: token.username,
        };
        return session;
      },
      async jwt({ token, user }) {
        if (user) {
          token.id = user.id;
          token.telegramId = user.telegramId;
          token.firstName = user.firstName;
          token.lastName = user.lastName;
          token.username = user.username;
        }
        return token;
      },
    },
  });
}
