import { ErrorMessage, ErrorMessageProps } from 'formik';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { StyledErrorMessage } from './FieldError.style';

const FieldError: React.FC<ErrorMessageProps> = (props) => (
  <ErrorMessage {...props}>
    {(msgId: string) => (
      <StyledErrorMessage className={props.className}>
        <FormattedMessage id={msgId} />
      </StyledErrorMessage>
    )}
  </ErrorMessage>
);

export default FieldError;
