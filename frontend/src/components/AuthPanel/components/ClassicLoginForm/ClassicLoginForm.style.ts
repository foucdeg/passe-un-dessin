import styled from 'styled-components';
import FieldLabel from 'atoms/FieldLabel';
import { Form } from 'formik';
import Button from 'atoms/Button';
import { Link } from 'react-router-dom';
import { colorPalette } from 'stylesheet';

export const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
`;

export const StyledLabel = styled(FieldLabel)`
  margin: 8px 0;
`;

export const StyledButton = styled(Button)`
  margin-top: 24px;
  justify-content: center;
`;

export const StyledLink = styled(Link)`
  margin-top: 8px;
  color: ${colorPalette.black};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;
