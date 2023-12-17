import { ErrorMessage, ErrorMessageProps } from 'formik';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import cn from 'classnames';
import { errorMessage } from './FieldError.module.scss';

const FieldError: React.FC<ErrorMessageProps> = ({ className, ...props }) => (
  <ErrorMessage {...props}>
    {(msgId: string) => (
      <p className={cn(errorMessage, className)}>
        <FormattedMessage id={msgId} />
      </p>
    )}
  </ErrorMessage>
);

export default FieldError;
