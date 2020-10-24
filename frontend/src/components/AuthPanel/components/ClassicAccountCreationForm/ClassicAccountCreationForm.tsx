import React, { useEffect } from 'react';

import { FormikProps, Field } from 'formik';
import TextInput from 'atoms/TextInput';
import { useIntl, FormattedMessage } from 'react-intl';
import { AUTH_ERROR_EMAIL_IN_USE } from 'redux/Player/hooks';
import { StyledLabel, StyledForm, StyledButton } from './ClassicAccountCreationForm.style';
import { FormValues, FormOutsideProps } from './ClassicAccountCreationForm.form';

const ClassicAccountCreationFormView: React.FC<FormOutsideProps & FormikProps<FormValues>> = ({
  touched,
  errors,
  isValid,
  isSubmitting,
  setFieldError,
  createAccount,
}) => {
  const intl = useIntl();
  const [{ loading, error: outsideError }] = createAccount;

  useEffect(() => {
    if (outsideError && outsideError.message === AUTH_ERROR_EMAIL_IN_USE) {
      setFieldError('email', 'auth.errors.emailInUse');
    }
  }, [outsideError, setFieldError]);

  return (
    <StyledForm>
      <StyledLabel htmlFor="email">
        <FormattedMessage id="auth.email" />
      </StyledLabel>
      <Field
        type="email"
        name="email"
        autoComplete="email"
        as={TextInput}
        hasError={touched.email && errors.email}
        placeholder={intl.formatMessage({ id: 'mobileGate.emailExample' })}
      />
      <StyledLabel htmlFor="password">
        <FormattedMessage id="auth.pickPassword" />
      </StyledLabel>
      <Field
        type="password"
        name="password"
        autoComplete="new-password"
        as={TextInput}
        hasError={touched.password && errors.password}
      />
      <StyledButton type="submit" disabled={isSubmitting || loading || !isValid}>
        <FormattedMessage id="auth.createAccount" />
      </StyledButton>
    </StyledForm>
  );
};

export default ClassicAccountCreationFormView;
