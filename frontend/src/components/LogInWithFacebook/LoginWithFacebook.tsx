/*  eslint @typescript-eslint/no-explicit-any: off */
import React, { useEffect, useCallback } from 'react';
import { EmptyObject as NoProps } from 'services/utils';
import { useSocialLogin, AuthProvider } from 'redux/Player/hooks';
import { StyledFacebookButton, FacebookLogo, TextContent } from './LoginWithFacebook.style';

enum FacebookAuthStatus {
  CONNECTED = 'connected',
  NOT_AUTHORIZED = 'not_authorized',
  UNKNOWN = 'unknown',
}

interface FacebookAuthResponse {
  accessToken: string;
  expiresIn: string;
  signedRequest: string;
  userID: string;
}

interface FacebookAuthStatusResponse {
  status: FacebookAuthStatus;
}

type SuccessfulFacebookAuthStatusResponse = FacebookAuthStatusResponse & {
  authResponse: FacebookAuthResponse;
};

const isSucessful = (
  response: FacebookAuthStatusResponse,
): response is SuccessfulFacebookAuthStatusResponse =>
  response.status === FacebookAuthStatus.CONNECTED;

const LoginWithFacebook: React.FC<NoProps> = () => {
  const doLogin = useSocialLogin();

  const doFacebookLogin = useCallback(() => {
    const FB = (window as any).FB;

    FB.login(
      function (response: FacebookAuthStatusResponse) {
        if (isSucessful(response)) {
          return doLogin(response.authResponse.accessToken, AuthProvider.FACEBOOK);
        }
      },
      { scope: 'email' },
    );
  }, [doLogin]);

  useEffect(() => {
    const FB = (window as any).FB;

    FB.getLoginStatus((response: FacebookAuthStatusResponse) => {
      if (isSucessful(response)) {
        return doLogin(response.authResponse.accessToken, AuthProvider.FACEBOOK);
      }
    });
  }, [doLogin]);

  return (
    <StyledFacebookButton onClick={doFacebookLogin}>
      <FacebookLogo />
      <TextContent>Login with Facebook</TextContent>
    </StyledFacebookButton>
  );
};

export default LoginWithFacebook;
