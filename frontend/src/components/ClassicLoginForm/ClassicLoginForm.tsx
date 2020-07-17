import React from 'react';

import { FormikProps, Field } from 'formik';
import { FormValues } from './ClassicLoginForm.form';
import TextInput from 'components/TextInput';
import { StyledLabel, StyledForm, StyledButton } from './ClassicLoginForm.style';
import { useIntl } from 'react-intl';

const ClassicLoginForm: React.FC<FormikProps<FormValues>> = ({ touched, errors }) => {
  const intl = useIntl();

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
      <StyledButton type="submit">Créer un compte</StyledButton>
    </StyledForm>
  );
};

export default ClassicLoginForm;
