import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';

import HomeLayout from 'layout/HomeLayout';
import { NoProps } from 'services/utils';
import { useLocation } from 'react-router';
import Loader from 'atoms/Loader';
import { PUBLIC_PATHS } from 'routes';
import { Link } from 'react-router-dom';
import { useUnauthenticatedGuard } from 'redux/General/hooks';
import { LeftSideTitle, StyledHeader } from './PasswordReset.style';
import { useCheckToken } from './hooks';
import PasswordResetForm from './components/PasswordResetForm';

const PasswordReset: React.FC<NoProps> = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const token = params.get('token');
  const [{ error: invalidToken, loading: tokenCheckLoading, value }, checkToken] = useCheckToken();

  useUnauthenticatedGuard();

  useEffect(() => {
    checkToken(token);
  }, [token, checkToken]);

  if (!token) return null;

  return (
    <HomeLayout>
      <LeftSideTitle>
        <FormattedMessage id="home.title" />
      </LeftSideTitle>
      <StyledHeader>
        <FormattedMessage id="passwordReset.title" />
      </StyledHeader>
      {tokenCheckLoading && <Loader />}
      {invalidToken ? (
        <p>
          <FormattedMessage id="passwordReset.invalidToken" />{' '}
          <Link to={PUBLIC_PATHS.PASSWORD_RESET_REQUEST}>
            <FormattedMessage id="passwordReset.requestNewToken" />
          </Link>
        </p>
      ) : (
        value && <PasswordResetForm email={value.email} token={token} />
      )}
    </HomeLayout>
  );
};

export default PasswordReset;
