import NextAuth from 'next-auth';
import { NextApiRequest, NextApiResponse } from 'next';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectToDatabase } from '../../lib/mongodb';
import User from '../../models/User';

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  try {
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
                console.log('Missing Telegram Init Data');
                throw new Error('Missing Telegram Init Data');
              }

              let telegramUser;
              try {
                telegramUser = JSON.parse(initData);
                if (!telegramUser) {
                  console.log('Parsed user data is missing');
                  throw new Error('Parsed user data is missing');
                }
              } catch (error) {
                if (error instanceof Error) {
                  console.log('Error parsing initData:', error.message);
                } else {
                  console.log('Unknown error occurred while parsing initData');
                }
                throw new Error('Invalid Telegram Init Data format');
              }

              const telegramId = telegramUser?.id;
              if (!telegramId) {
                console.log('Missing Telegram ID');
                throw new Error('Telegram user ID is missing');
              }

              console.log(`User ID: ${telegramId}, Name: ${telegramUser?.first_name}`);

              await connectToDatabase();
              let user = await User.findOne({ telegramId });

              if (!user) {
                console.log('User not found, creating new user...');
                user = new User({
                  telegramId,
                  firstName: telegramUser?.first_name || '',
                  lastName: telegramUser?.last_name || '',
                  username: telegramUser?.username || '',
                });
                await user.save();
              } else {
                console.log('User found in the database');
              }

              return {
                id: user._id.toString(),
                telegramId: user.telegramId,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
              };
            } catch (error) {
              if (error instanceof Error) {
                console.log('Authorization failed:', error.message);
              } else {
                console.log('Unknown error occurred during authorization');
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
  } catch (error) {
    if (error instanceof Error) {
      console.error('Auth API error:', error.message);
    } else {
      console.error('Unknown error occurred in the Auth API');
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
}