import 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    telegramId: string;
    firstName: string;
    lastName?: string; // Optional field
    username?: string; // Optional field
  }

  interface Session {
    user: User; // Reference the User interface
  }
}
