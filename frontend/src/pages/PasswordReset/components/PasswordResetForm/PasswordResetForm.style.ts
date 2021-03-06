import styled from 'styled-components';
import TextInput from 'atoms/TextInput';
import Button from 'atoms/Button';
import { Form } from 'formik';

export const StyledForm = styled(Form)`
  width: 300px;
  display: flex;
  flex-direction: column;
`;

export const StyledInput = styled(TextInput)`
  margin-bottom: 16px;
`;

export const StyledButton = styled(Button)`
  margin-top: 16px;
  justify-content: center;
`;
