import React from 'react';
import { FormattedMessage } from 'react-intl';

import HomeLayout from 'layout/HomeLayout';
import { NoProps } from 'services/utils';
import { useUnauthenticatedGuard } from 'redux/General/hooks';
import { LeftSideTitle, StyledHeader } from './PasswordResetRequest.style';
import PasswordResetRequestForm from './components/PasswordResetRequestForm';

const PasswordResetRequest: React.FC<NoProps> = () => {
  useUnauthenticatedGuard();

  return (
    <HomeLayout>
      <LeftSideTitle>
        <FormattedMessage id="home.title" />
      </LeftSideTitle>
      <StyledHeader>
        <FormattedMessage id="passwordReset.title" />
      </StyledHeader>
      <PasswordResetRequestForm />
    </HomeLayout>
  );
};

export default PasswordResetRequest;
