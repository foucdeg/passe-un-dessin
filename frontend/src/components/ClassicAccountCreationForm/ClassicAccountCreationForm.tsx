import React, { useEffect } from 'react';

import { FormikProps, Field } from 'formik';
import { OutsideProps, FormValues } from './ClassicAccountCreationForm.form';
import TextInput from 'components/TextInput';
import { StyledLabel, StyledForm, StyledButton } from './ClassicAccountCreationForm.style';
import { useIntl, FormattedMessage } from 'react-intl';
import { AUTH_ERROR_EMAIL_IN_USE } from 'redux/Player/hooks';

const ClassicAccountCreationFormView: React.FC<OutsideProps & FormikProps<FormValues>> = ({
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
