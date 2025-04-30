declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: () => void;
      };
    };
    gtag?: (...args: any[]) => void;
  }
}

export {};
