import React, { useEffect } from 'react';

import { FormikProps, Field } from 'formik';
import { OutsideProps, FormValues } from './ClassicAccountCreationForm.form';
import TextInput from 'components/TextInput';
import { StyledLabel, StyledForm, StyledButton } from './ClassicAccountCreationForm.style';
import { useIntl } from 'react-intl';
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
      setFieldError('email', 'Email already in use');
    }
  }, [outsideError, setFieldError]);

  return (
    <StyledForm>
      <StyledLabel htmlFor="email">Adresse email</StyledLabel>
      <Field
        type="email"
        name="email"
        autoComplete="email"
        as={TextInput}
        hasError={touched.email && errors.email}
        placeholder={intl.formatMessage({ id: 'mobileGate.emailExample' })}
      />
      <StyledLabel htmlFor="password">Choisis un mot de passe</StyledLabel>
      <Field
        type="password"
        name="password"
        autoComplete="new-password"
        as={TextInput}
        hasError={touched.password && errors.password}
      />
      <StyledButton type="submit" disabled={isSubmitting || loading || !isValid}>
        Créer un compte
      </StyledButton>
    </StyledForm>
  );
};

export default ClassicAccountCreationFormView;
