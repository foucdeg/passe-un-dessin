/*  eslint @typescript-eslint/no-explicit-any: off */
import React, { useEffect, useCallback } from 'react';
import { useSocialLogin, AuthProvider } from 'redux/Player/hooks';
import { FormattedMessage } from 'react-intl';
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

interface Props {
  onDone?: () => void;
}

const LoginWithFacebook: React.FC<Props> = ({ onDone }) => {
  const doLogin = useSocialLogin();

  const doFacebookLogin = useCallback(() => {
    const FB = (window as any).FB;

    FB.login(
      async function (response: FacebookAuthStatusResponse) {
        if (isSucessful(response)) {
          await doLogin(response.authResponse.accessToken, AuthProvider.FACEBOOK);
          if (onDone) {
            onDone();
          }
        }
      },
      { scope: 'email' },
    );
  }, [doLogin, onDone]);

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
      <TextContent>
        <FormattedMessage id="auth.facebookLogin" />
      </TextContent>
    </StyledFacebookButton>
  );
};

export default LoginWithFacebook;
