import React, { useState } from 'react';
import LoginWithFacebook from 'components/AuthPanel/components/LogInWithFacebook';
import LoginWithGoogle from 'components/AuthPanel/components/LogInWithGoogle';
import HorizontalSeparator from 'atoms/HorizontalSeparator';
import { FormattedMessage } from 'react-intl';
import { LegalLinks } from 'pages/Home/Home.style';
import { Link } from 'react-router-dom';
import { InlineSwitch, StyledSwitch } from './AuthPanel.style';
import ClassicAccountCreationForm from './components/ClassicAccountCreationForm';
import ClassicLoginForm from './components/ClassicLoginForm';

interface Props {
  onDone?: () => void;
  defaultLogIn?: boolean;
}

const AuthPanel: React.FC<Props> = ({ onDone, defaultLogIn }) => {
  const [isCreatingAccount, setIsCreatingAccount] = useState<boolean>(
    defaultLogIn === undefined ? true : !defaultLogIn,
  );

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
      <LegalLinks>
        <Link to="/legal#terms-and-conditions">
          <FormattedMessage id="home.termsAndConditions" />
        </Link>
        &nbsp;&middot;&nbsp;
        <Link to="/legal#privacy-policy">
          <FormattedMessage id="home.privacyPolicy" />
        </Link>
      </LegalLinks>
    </>
  );
};

export default AuthPanel;
