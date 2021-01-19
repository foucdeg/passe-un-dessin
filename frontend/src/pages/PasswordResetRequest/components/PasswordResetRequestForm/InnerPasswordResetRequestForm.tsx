import React from 'react';
import FieldLabel from 'atoms/FieldLabel';
import { Field, FormikProps } from 'formik';
import { FormattedMessage } from 'react-intl';
import FieldError from 'atoms/FieldError';
import TextInput from 'atoms/TextInput';
import withPasswordResetRequestForm, {
  FormOutsideProps,
  FormValues,
} from './PasswordResetRequestForm.form';
import { StyledForm, StyledButton } from './PasswordResetRequestForm.style';

const InnerPasswordResetForm: React.FC<FormOutsideProps & FormikProps<FormValues>> = ({
  loading,
  isSubmitting,
  isValid,
  touched,
  errors,
}) => (
  <StyledForm>
    <FieldLabel htmlFor="email">
      <FormattedMessage id="passwordReset.email" />
    </FieldLabel>
    <Field
      as={TextInput}
      autoComplete="username"
      autoFocus
      name="email"
      hasError={touched.email && errors.email}
    />
    <FieldError name="email" />
    <StyledButton type="submit" disabled={isSubmitting || loading || !isValid}>
      <FormattedMessage id="passwordReset.submitRequest" />
    </StyledButton>
  </StyledForm>
);

export default withPasswordResetRequestForm(InnerPasswordResetForm);
