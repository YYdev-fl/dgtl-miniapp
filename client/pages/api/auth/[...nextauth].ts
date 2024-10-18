import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectToDatabase } from '../../../lib/mongodb';
import User from '../../../models/User';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Telegram',
      credentials: {
        initData: { label: 'Telegram Init Data', type: 'text' },
      },
      async authorize(credentials) {
        try {
          const initData = credentials?.initData;
          console.log('Received initData:', initData);

          if (!initData) {
            console.log('Missing Telegram Init Data');
            throw new Error('Missing Telegram Init Data');
          }

          // Parse initData as URLSearchParams
          const initDataParams = new URLSearchParams(initData);
          const userRaw = initDataParams.get('user');
          console.log('Parsed userRaw:', userRaw);

          if (!userRaw) {
            console.log('User data is missing in initData');
            throw new Error('User data is missing in initData');
          }

          const telegramUser = JSON.parse(userRaw);
          console.log('Parsed telegramUser:', telegramUser);

          if (!telegramUser) {
            console.log('Parsed user data is missing');
            throw new Error('Parsed user data is missing');
          }

          // Extract Telegram ID
          const telegramId = telegramUser.id;
          if (!telegramId) {
            console.log('Missing Telegram ID');
            throw new Error('Telegram user ID is missing');
          }

          console.log(`User ID: ${telegramId}, Name: ${telegramUser.first_name}`);

          // Connect to the database
          await connectToDatabase();
          let user = await User.findOne({ telegramId });

          // Create a new user if one does not exist
          if (!user) {
            console.log('User not found, creating new user...');
            user = new User({
              telegramId,
              firstName: telegramUser.first_name || '',
              lastName: telegramUser.last_name || '',
              username: telegramUser.username || '',
            });
            await user.save();
          } else {
            console.log('User found in the database');
          }

          // Return the user object for NextAuth
          return {
            id: user._id.toString(),
            telegramId: user.telegramId,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
          };
        } catch (error) {
          console.log('Authorization failed:', error);
          return null; // Return null to indicate failed login
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      // Add additional fields to session.user object
      if (token) {
        session.user = {
          ...session.user,
          id: token.id,
          telegramId: token.telegramId,
          firstName: token.firstName,
          lastName: token.lastName,
          username: token.username,
        };
      }
      return session;
    },
    async jwt({ token, user }) {
      // Persist user data in the JWT token
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
  pages: {
    signIn: '/authpage', // Redirect to your custom auth page
    error: '/auth/error', // Custom error page
  },
});
