import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      telegramId: string;
      firstName: string;
      lastName: string;
      username: string;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    telegramId: string;
    firstName: string;
    lastName: string;
    username: string;
  }
}
