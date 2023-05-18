/// <reference types="user-agent-data-types" />

import { FacebookAuthStatusResponse, GoogleIdConfig } from './window';

declare global {
  interface Window {
    /** Facebook login API - may be blocked or fail to load */
    FB?: {
      login: (
        callback: (response: FacebookAuthStatusResponse) => void,
        config: Record<string, string>,
      ) => void;
      getLoginStatus: (callback: (response: FacebookAuthStatusResponse) => void) => void;
      logout: () => void;
    };
    /** Google login API - may be blocked or fail to load */
    google?: {
      accounts: {
        id: {
          initialize: (config: GoogleIdConfig) => void;
          prompt: () => void;
          cancel: () => void;
          revoke: () => void;
        };
      };
    };
    loginLock?: boolean;
    gtag?: (method: string, name: string, props: Record<string, string>) => void;
  }
}

export {};
