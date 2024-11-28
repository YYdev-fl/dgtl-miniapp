import 'next-auth';

declare module 'next-auth' {
    interface User {
      id: string;
      telegramId: string;
      firstName: string;
      lastName?: string;
      username?: string;
    }
  
    interface Session {
      user: User;
    }
  }