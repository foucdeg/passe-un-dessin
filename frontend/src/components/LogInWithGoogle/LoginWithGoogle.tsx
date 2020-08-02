/*  eslint @typescript-eslint/no-explicit-any: off */
import React, { useCallback, useEffect, useRef } from 'react';
import { NoProps } from 'services/utils';
import { useSocialLogin, AuthProvider } from 'redux/Player/hooks';
import { GoogleLogo, TextContent, StyledGoogleButton } from './LoginWithGoogle.style';
import { FormattedMessage } from 'react-intl';

interface GoogleUser {
  getAuthResponse: () => { id_token: string };
}

const LoginWithGoogle: React.FC<NoProps> = () => {
  const doLogin = useSocialLogin();
  const buttonRef = useRef(null);

  const onLoginSuccess = useCallback(
    (googleUser: GoogleUser) => {
      const idToken = googleUser.getAuthResponse().id_token;
      doLogin(idToken, AuthProvider.GOOGLE);
    },
    [doLogin],
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
