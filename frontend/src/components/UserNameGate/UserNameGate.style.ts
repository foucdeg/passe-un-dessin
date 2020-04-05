import styled from 'styled-components';
import TextInput from 'components/TextInput';
import Button from 'components/Button';

export const StyledField = styled(TextInput)`
  margin-bottom: 16px;
`;

StyledField.displayName = 'StyledField';

export const StyledButton = styled(Button)`
  align-self: flex-end;
`;

StyledButton.displayName = 'StyledButton';

export const UsernameForm = styled.form`
  display: flex;
  flex-direction: column;
`;

UsernameForm.displayName = 'UsernameForm';
