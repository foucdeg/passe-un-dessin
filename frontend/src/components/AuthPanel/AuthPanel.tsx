import React, { useState } from 'react';
import { NoProps } from 'services/utils';
import LoginWithFacebook from 'components/LogInWithFacebook';
import LoginWithGoogle from 'components/LogInWithGoogle';
import HorizontalSeparator from 'components/HorizontalSeparator';
import { SeparatorText, InlineSwitch, StyledSwitch } from './AuthPanel.style';
import { FormattedMessage } from 'react-intl';
import ClassicAccountCreationForm from 'components/ClassicAccountCreationForm';
import { useCreateAccount, useLogin } from 'redux/Player/hooks';
import ClassicLoginForm from 'components/ClassicLoginForm';

const AuthPanel: React.FC<NoProps> = () => {
  const createAccount = useCreateAccount();
  const login = useLogin();

  const [isCreatingAccount, setIsCreatingAccount] = useState<boolean>(true);

  return (
    <>
      <LoginWithFacebook />
      <LoginWithGoogle />
      <HorizontalSeparator>
        <SeparatorText>
          <FormattedMessage id="auth.oldStyle" />
        </SeparatorText>
      </HorizontalSeparator>
      <InlineSwitch>
        <FormattedMessage tagName="span" id="auth.logIn" />
        <StyledSwitch selected={isCreatingAccount} setSelected={setIsCreatingAccount} />
        <FormattedMessage tagName="span" id="auth.createAccount" />
      </InlineSwitch>
      {isCreatingAccount ? (
        <ClassicAccountCreationForm createAccount={createAccount} />
      ) : (
        <ClassicLoginForm login={login} />
      )}
    </>
  );
};

export default AuthPanel;
