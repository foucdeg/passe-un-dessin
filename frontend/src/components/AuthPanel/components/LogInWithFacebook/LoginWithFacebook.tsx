import React, { useEffect, useCallback } from 'react';
import { useSocialLogin, AuthProvider } from 'redux/Player/hooks';
import { FormattedMessage } from 'react-intl';
import { FacebookAuthStatusResponse, isSuccessful } from 'window';
import { StyledFacebookButton, FacebookLogo, TextContent } from './LoginWithFacebook.style';

interface Props {
  onDone?: () => void;
}

const LoginWithFacebook: React.FC<Props> = ({ onDone }) => {
  const doLogin = useSocialLogin();

  const doFacebookLogin = useCallback(() => {
    if (!window.FB) return;

    window.FB.login(
      async function (response: FacebookAuthStatusResponse) {
        if (isSuccessful(response)) {
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
    if (!window.FB) return;

    window.FB.getLoginStatus((response: FacebookAuthStatusResponse) => {
      if (isSuccessful(response)) {
        return doLogin(response.authResponse.accessToken, AuthProvider.FACEBOOK);
      }
    });
  }, [doLogin]);

  return (
    <StyledFacebookButton onClick={doFacebookLogin} disabled={!window.FB}>
      <FacebookLogo />
      <TextContent>
        <FormattedMessage id="auth.facebookLogin" />
      </TextContent>
    </StyledFacebookButton>
  );
};

export default LoginWithFacebook;
