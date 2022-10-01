import React, { useCallback, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useSocialLogin, AuthProvider } from 'redux/Player/hooks';
import { GoogleUser } from 'window';
import { GoogleLogo, StyledGoogleButton, TextContent } from './LoginWithGoogle.style';

interface Props {
  onDone?: () => void;
}

const LoginWithGoogle: React.FC<Props> = ({ onDone }) => {
  const doLogin = useSocialLogin();

  const onLoginSuccess = useCallback(
    async (googleUser: GoogleUser) => {
      const idToken = googleUser.credential;
      await doLogin(idToken, AuthProvider.GOOGLE);
      if (onDone) {
        onDone();
      }
    },
    [doLogin, onDone],
  );

  useEffect(() => {
    if (!window.google) return;
    if (!process.env.REACT_APP_GOOGLE_CLIENT_ID) return;

    const google = window.google;
    window.google.accounts.id.initialize({
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      callback: onLoginSuccess,
    });

    return () => {
      google.accounts.id.cancel();
    };
  }, [onLoginSuccess]);

  const openPrompt = () => {
    if (!window.google) return;

    const google = window.google;
    google.accounts.id.prompt();
  };

  return (
    <StyledGoogleButton onClick={openPrompt}>
      <GoogleLogo />
      <TextContent>
        <FormattedMessage id="auth.googleLogin" />
      </TextContent>
    </StyledGoogleButton>
  );
};

export default LoginWithGoogle;
