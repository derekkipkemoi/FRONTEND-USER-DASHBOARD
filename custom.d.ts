declare module 'intasend-inlinejs-sdk';

declare global {
    interface Window {
      IntaSend: any; // You can replace `any` with a more specific type if available
    }
  }