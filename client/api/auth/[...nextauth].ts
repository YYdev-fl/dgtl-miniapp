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
          initData: { label: 'Telegram Init Data', type: 'text' },
        },
        async authorize(credentials) {
          try {
            const initData = credentials?.initData;
            if (!initData) {
              alert('Missing Telegram Init Data');
              throw new Error('Missing Telegram Init Data');
            }

            let telegramUser;
            try {
              telegramUser = JSON.parse(initData).user;
              if (!telegramUser) {
                alert('Parsed user data is missing');
                throw new Error('Parsed user data is missing');
              }
            } catch (error) {
              // Cast 'error' to a known type (Error) so TypeScript knows how to handle it
              if (error instanceof Error) {
                alert('Error parsing initData: ' + error.message);
              } else {
                alert('Unknown error occurred while parsing initData');
              }
              throw new Error('Invalid Telegram Init Data format');
            }

            const telegramId = telegramUser?.id;
            if (!telegramId) {
              alert('Missing Telegram ID');
              throw new Error('Telegram user ID is missing');
            }

            alert(`User ID: ${telegramId}, Name: ${telegramUser?.first_name}`);

            await connectToDatabase();
            let user = await User.findOne({ telegramId });

            if (!user) {
              alert('User not found, creating new user...');
              user = new User({
                telegramId,
                firstName: telegramUser?.first_name || '',
                lastName: telegramUser?.last_name || '',
                username: telegramUser?.username || '',
              });
              await user.save();
            } else {
              alert('User found in the database');
            }

            // Return the user object
            return {
              id: user._id.toString(),
              telegramId: user.telegramId,
              firstName: user.firstName,
              lastName: user.lastName,
              username: user.username,
            };
          } catch (error) {
            // Type guard to handle 'unknown' type for error
            if (error instanceof Error) {
              alert('Authorization failed: ' + error.message);
            } else {
              alert('Unknown error occurred during authorization');
            }
            return null; // Return null to indicate failed login
          }
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


