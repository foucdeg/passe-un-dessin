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
    };
    /** Google login API - may be blocked or fail to load */
    authInstance?: {
      attachClickHandler: (
        elt: HTMLElement,
        config: Record<string, string>,
        callback: (googleUser: GoogleUser) => void,
      ) => void;
    };
    loginLock?: boolean;
  }
}

export {};
