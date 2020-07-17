/*  eslint @typescript-eslint/no-explicit-any: off */
import React, { useLayoutEffect, useCallback } from 'react';
import { EmptyObject as NoProps } from 'services/utils';
import { useSocialLogin, AuthProvider } from 'redux/Player/hooks';
import { Container } from './LoginWithGoogle.style';

interface GoogleUser {
  getAuthResponse: () => { id_token: string };
}

const LoginWithGoogle: React.FC<NoProps> = () => {
  const doLogin = useSocialLogin();

  const onLoginSuccess = useCallback(
    (googleUser: GoogleUser) => {
      const idToken = googleUser.getAuthResponse().id_token;
      doLogin(idToken, AuthProvider.GOOGLE);
    },
    [doLogin],
  );

  useLayoutEffect(() => {
    const gapi = (window as any).gapi;
    if (!gapi) return;

    gapi.signin2.render('gSignIn', {
      width: 335,
      height: 48,
      longtitle: true,
      onsuccess: onLoginSuccess,
      onerror: function (err: string) {
        console.log('Google signIn2.render button err: ' + err);
      },
    });
  }, [onLoginSuccess]);

  return (
    <Container>
      <div id="gSignIn"></div>
    </Container>
  );
};

export default LoginWithGoogle;
