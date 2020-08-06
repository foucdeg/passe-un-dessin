import React, { useState } from 'react';
import LoginWithFacebook from 'components/LogInWithFacebook';
import LoginWithGoogle from 'components/LogInWithGoogle';
import HorizontalSeparator from 'components/HorizontalSeparator';
import { InlineSwitch, StyledSwitch } from './AuthPanel.style';
import { FormattedMessage } from 'react-intl';
import ClassicAccountCreationForm from 'components/ClassicAccountCreationForm';
import ClassicLoginForm from 'components/ClassicLoginForm';

interface Props {
  onDone?: () => void;
}

const AuthPanel: React.FC<Props> = ({ onDone }) => {
  const [isCreatingAccount, setIsCreatingAccount] = useState<boolean>(true);

  return (
    <>
      <LoginWithFacebook onDone={onDone} />
      <LoginWithGoogle onDone={onDone} />
      <HorizontalSeparator>
        <FormattedMessage id="auth.oldStyle" />
      </HorizontalSeparator>
      <InlineSwitch>
        <FormattedMessage tagName="span" id="auth.logIn" />
        <StyledSwitch selected={isCreatingAccount} setSelected={setIsCreatingAccount} />
        <FormattedMessage tagName="span" id="auth.createAccount" />
      </InlineSwitch>
      {isCreatingAccount ? (
        <ClassicAccountCreationForm onAccountCreated={onDone} />
      ) : (
        <ClassicLoginForm onLoggedIn={onDone} />
      )}
    </>
  );
};

export default AuthPanel;
