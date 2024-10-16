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

          const { user: telegramUser } = JSON.parse(initData); 

          const telegramId = telegramUser.id;
          const firstName = telegramUser.first_name;
          const lastName = telegramUser.last_name || '';
          const username = telegramUser.username || '';

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
            id: user._id,
            telegramId: user.telegramId,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
          };
        },
      }),
    ],
    callbacks: {
      async session({ session, user }) {
        // Attach user object to session
        session.user = {
          ...session.user,
          id: user.id,
          telegramId: user.telegramId,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
        };
        return session;
      },
      async jwt({ token, user }) {
        // Attach user object to token for persistence
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
