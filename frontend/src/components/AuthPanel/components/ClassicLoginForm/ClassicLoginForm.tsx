import React, { useEffect } from 'react';

import { FormikProps, Field } from 'formik';
import TextInput from 'atoms/TextInput';
import { useIntl, FormattedMessage } from 'react-intl';
import { AUTH_ERROR_INVALID_USERNAME_PASSWORD } from 'redux/Player/hooks';
import { PUBLIC_PATHS } from 'routes';
import FieldError from 'atoms/FieldError';
import { StyledLabel, StyledForm, StyledButton, StyledLink } from './ClassicLoginForm.style';
import { FormValues, FormOutsideProps } from './ClassicLoginForm.form';

const ClassicLoginFormView: React.FC<FormOutsideProps & FormikProps<FormValues>> = ({
  touched,
  errors,
  isValid,
  isSubmitting,
  setErrors,
  login,
  onLoggedIn,
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
        maxLength={254}
        hasError={touched.email && errors.email}
        placeholder={intl.formatMessage({ id: 'auth.emailExample' })}
      />
      <FieldError name="email" />
      <StyledLabel htmlFor="password">
        <FormattedMessage id="auth.password" />
      </StyledLabel>
      <Field
        type="password"
        name="password"
        autoComplete="current-password"
        as={TextInput}
        maxLength={254}
        hasError={touched.password && errors.password}
      />
      <FieldError name="password" />
      <StyledLink to={PUBLIC_PATHS.PASSWORD_RESET_REQUEST} onClick={onLoggedIn}>
        <FormattedMessage id="auth.forgotPassword" />
      </StyledLink>
      <StyledButton type="submit" disabled={isSubmitting || loading || !isValid}>
        <FormattedMessage id="auth.logIn" />
      </StyledButton>
    </StyledForm>
  );
};

export default ClassicLoginFormView;
