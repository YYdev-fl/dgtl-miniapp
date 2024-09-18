// src/global.d.ts or just global.d.ts

declare global {
    interface Window {
      Telegram: {
        WebApp: {
          hapticFeedback: {
            impactOccurred: (type: string) => void;
          };
        };
      };
    }
  }
  
  export {};
  