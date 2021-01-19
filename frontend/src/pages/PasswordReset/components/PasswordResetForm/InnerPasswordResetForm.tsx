import React from 'react';
import FieldLabel from 'atoms/FieldLabel';
import { Field, FormikProps } from 'formik';
import { FormattedMessage } from 'react-intl';
import FieldError from 'atoms/FieldError';
import TextInput from 'atoms/TextInput';
import withPasswordResetForm, { FormOutsideProps, FormValues } from './PasswordResetForm.form';
import { StyledForm, StyledInput, StyledButton } from './PasswordResetForm.style';

const InnerPasswordResetForm: React.FC<FormOutsideProps & FormikProps<FormValues>> = ({
  email,
  loading,
  isSubmitting,
  isValid,
  touched,
  errors,
}) => (
  <StyledForm>
    <Field type="hidden" name="token" />
    <FieldLabel htmlFor="username">
      <FormattedMessage id="passwordReset.email" />
    </FieldLabel>
    <StyledInput name="username" value={email} readOnly />
    <FieldLabel htmlFor="password">
      <FormattedMessage id="passwordReset.label" />
    </FieldLabel>
    <Field
      type="password"
      as={TextInput}
      autoComplete="new-password"
      autoFocus
      name="password"
      hasError={touched.password && errors.password}
    />
    <FieldError name="password" />
    <StyledButton type="submit" disabled={isSubmitting || loading || !isValid}>
      <FormattedMessage id="passwordReset.submit" />
    </StyledButton>
  </StyledForm>
);

export default withPasswordResetForm(InnerPasswordResetForm);
