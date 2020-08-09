import styled from 'styled-components';
import TextInput from 'atoms/TextInput';
import { colorPalette } from 'stylesheet';
import Header2 from 'atoms/Header2';

export const StyledHeader = styled(Header2)`
  color: ${colorPalette.purple};
  margin-bottom: 24px;
`;

StyledHeader.displayName = 'StyledHeader';

export const StyledField = styled(TextInput)`
  margin-bottom: 16px;
`;

StyledField.displayName = 'StyledField';

export const UsernameForm = styled.form`
  display: flex;
  flex-direction: column;
  margin-bottom: 32px;
`;

UsernameForm.displayName = 'UsernameForm';

export const VirtualButton = styled.button`
  margin: 0;
  padding: 0;
  border: 0;
  background: none;
  outline: none;
  font-size: inherit;
  color: inherit;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

VirtualButton.displayName = 'VirtualButton';
