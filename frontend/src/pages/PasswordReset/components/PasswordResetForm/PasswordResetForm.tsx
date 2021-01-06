import React from 'react';
import { useSubmitNewPassword } from 'pages/PasswordReset/hooks';
import { FormattedMessage } from 'react-intl';
import Loader from 'atoms/Loader';
import InnerPasswordResetForm from './InnerPasswordResetForm';

interface Props {
  token: string;
  email: string;
}

const PasswordResetForm: React.FC<Props> = ({ token, email }) => {
  const [{ loading, value }, submitNewPassword] = useSubmitNewPassword();

  if (value) {
    return (
      <>
        <p>
          <FormattedMessage id="passwordReset.success" />
        </p>
        <Loader />
      </>
    );
  }

  return (
    <InnerPasswordResetForm
      token={token}
      email={email}
      loading={loading}
      onSubmit={submitNewPassword}
    />
  );
};

export default PasswordResetForm;
