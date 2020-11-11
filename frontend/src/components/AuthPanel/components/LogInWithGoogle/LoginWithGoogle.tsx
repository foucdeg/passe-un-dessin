import React, { useCallback, useEffect, useRef } from 'react';
import { useSocialLogin, AuthProvider } from 'redux/Player/hooks';
import { FormattedMessage } from 'react-intl';
import { GoogleUser } from 'window';
import { GoogleLogo, TextContent, StyledGoogleButton } from './LoginWithGoogle.style';

interface Props {
  onDone?: () => void;
}

const LoginWithGoogle: React.FC<Props> = ({ onDone }) => {
  const doLogin = useSocialLogin();
  const buttonRef = useRef<HTMLButtonElement | null>(null);

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
    if (!window.authInstance) return;
    if (!buttonRef.current) return;

    window.authInstance.attachClickHandler(buttonRef.current, {}, onLoginSuccess);
  }, [buttonRef, onLoginSuccess]);

  return (
    <StyledGoogleButton ref={buttonRef} disabled={!window.authInstance}>
      <GoogleLogo />
      <TextContent>
        <FormattedMessage id="auth.googleLogin" />
      </TextContent>
    </StyledGoogleButton>
  );
};

export default LoginWithGoogle;
