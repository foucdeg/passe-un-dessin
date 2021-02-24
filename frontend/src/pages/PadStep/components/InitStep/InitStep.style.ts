import styled from 'styled-components';
import TextInput from 'atoms/TextInput';
import { colorPalette } from 'stylesheet';
import Header2 from 'atoms/Header2';
import Button from 'atoms/Button';

export const InitStepContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
  height: 100%;
`;

export const StyledForm = styled.form`
  width: 400px;
  margin-bottom: 8px;
  display: flex;
`;

export const StyledTextInput = styled(TextInput)`
  border-color: ${colorPalette.orange};
  flex-grow: 1;
  margin-right: 16px;
`;

export const StyledHeader = styled(Header2)`
  color: ${colorPalette.purple};
  margin-bottom: 8px;
`;

export const StyledButton = styled(Button)`
  width: 140px;
  text-align: center;
  align-self: center;
`;
