/*  eslint @typescript-eslint/no-explicit-any: off */
import React, { useCallback, useEffect, useRef } from 'react';
import { useSocialLogin, AuthProvider } from 'redux/Player/hooks';
import { FormattedMessage } from 'react-intl';
import { GoogleLogo, TextContent, StyledGoogleButton } from './LoginWithGoogle.style';

interface GoogleUser {
  getAuthResponse: () => { id_token: string };
}

interface Props {
  onDone?: () => void;
}

const LoginWithGoogle: React.FC<Props> = ({ onDone }) => {
  const doLogin = useSocialLogin();
  const buttonRef = useRef(null);

  const onLoginSuccess = useCallback(
    async (googleUser: GoogleUser) => {
      const idToken = googleUser.getAuthResponse().id_token;
      await doLogin(idToken, AuthProvider.GOOGLE);
      if (onDone) {
        onDone();
      }
    },
    [doLogin, onDone],
  );

  useEffect(() => {
    const authInstance = (window as any).authInstance;
    if (!authInstance) return;
    if (!buttonRef.current) return;

    authInstance.attachClickHandler(buttonRef.current, {}, onLoginSuccess);
  }, [buttonRef, onLoginSuccess]);

  return (
    <StyledGoogleButton ref={buttonRef}>
      <GoogleLogo />
      <TextContent>
        <FormattedMessage id="auth.googleLogin" />
      </TextContent>
    </StyledGoogleButton>
  );
};

export default LoginWithGoogle;
