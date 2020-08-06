import React, { useEffect } from 'react';

import { FormikProps, Field } from 'formik';
import { FormValues, FormOutsideProps } from './ClassicLoginForm.form';
import TextInput from 'components/TextInput';
import { StyledLabel, StyledForm, StyledButton } from './ClassicLoginForm.style';
import { useIntl, FormattedMessage } from 'react-intl';
import { AUTH_ERROR_INVALID_USERNAME_PASSWORD } from 'redux/Player/hooks';

const ClassicLoginFormView: React.FC<FormOutsideProps & FormikProps<FormValues>> = ({
  touched,
  errors,
  isValid,
  isSubmitting,
  setErrors,
  login,
}) => {
  const intl = useIntl();
  const [{ loading, error: outsideError }] = login;

  useEffect(() => {
    if (outsideError && outsideError.message === AUTH_ERROR_INVALID_USERNAME_PASSWORD) {
      setErrors({
        email: 'auth.errors.incorrectEmailPassword',
        password: 'auth.errors.incorrectEmailPassword',
      });
    }
  }, [outsideError, setErrors]);

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
        placeholder={intl.formatMessage({ id: 'auth.emailExample' })}
      />
      <StyledLabel htmlFor="password">
        <FormattedMessage id="auth.password" />
      </StyledLabel>
      <Field
        type="password"
        name="password"
        autoComplete="current-password"
        as={TextInput}
        hasError={touched.password && errors.password}
      />
      <StyledButton type="submit" disabled={isSubmitting || loading || !isValid}>
        <FormattedMessage id="auth.logIn" />
      </StyledButton>
    </StyledForm>
  );
};

export default ClassicLoginFormView;
