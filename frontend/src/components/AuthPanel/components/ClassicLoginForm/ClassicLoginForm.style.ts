import styled from 'styled-components';
import FieldLabel from 'atoms/FieldLabel';
import { Form } from 'formik';
import Button from 'atoms/Button';

export const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
`;

export const StyledLabel = styled(FieldLabel)`
  margin-top: 8px;
  margin-bottom: 0;
`;

export const StyledButton = styled(Button)`
  margin-top: 24px;
`;
