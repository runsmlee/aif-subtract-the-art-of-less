/// <reference types="vite/client" />

declare global {
  interface Window {
    aif?: {
      track: (event: string, props?: Record<string, unknown>) => void;
      mvpId?: string;
      sessionId?: string;
    };
  }
}

export {};
