import React from 'react';
import FieldLabel from 'atoms/FieldLabel';
import { Field, FormikProps } from 'formik';
import { FormattedMessage } from 'react-intl';
import withPasswordResetRequestForm, {
  FormOutsideProps,
  FormValues,
} from './PasswordResetRequestForm.form';
import { StyledForm, StyledInput, StyledButton } from './PasswordResetRequestForm.style';

const InnerPasswordResetForm: React.FC<FormOutsideProps & FormikProps<FormValues>> = ({
  loading,
  isSubmitting,
  isValid,
}) => (
  <StyledForm>
    <FieldLabel htmlFor="email">
      <FormattedMessage id="passwordReset.email" />
    </FieldLabel>
    <Field as={StyledInput} autoComplete="username" autoFocus name="email" />
    <StyledButton type="submit" disabled={isSubmitting || loading || !isValid}>
      <FormattedMessage id="passwordReset.submitRequest" />
    </StyledButton>
  </StyledForm>
);

export default withPasswordResetRequestForm(InnerPasswordResetForm);
