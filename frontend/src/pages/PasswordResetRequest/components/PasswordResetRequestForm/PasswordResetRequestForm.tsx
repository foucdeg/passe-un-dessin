import React from 'react';
import { useRequestToken } from 'pages/PasswordResetRequest/hooks';
import { FormattedMessage } from 'react-intl';
import { NoProps } from 'services/utils';
import InnerPasswordResetRequestForm from './InnerPasswordResetRequestForm';

const PasswordResetRequestForm: React.FC<NoProps> = () => {
  const [{ loading, value }, requestToken] = useRequestToken();

  if (value) {
    return (
      <p>
        <FormattedMessage id="passwordReset.requestSuccess" />
      </p>
    );
  }

  return <InnerPasswordResetRequestForm loading={loading} onSubmit={requestToken} />;
};

export default PasswordResetRequestForm;
