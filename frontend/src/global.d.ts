import { FacebookAuthStatusResponse, GoogleUser } from './window';

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
    authInstance?: {
      attachClickHandler: (
        elt: HTMLElement,
        config: Record<string, string>,
        callback: (googleUser: GoogleUser) => void,
      ) => void;
      signOut: () => void;
    };
    loginLock?: boolean;
    gtag?: (method: string, name: string, props: Record<string, string>) => void;
  }
}

export {};
