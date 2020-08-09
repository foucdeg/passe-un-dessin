import styled from 'styled-components';
import Button from 'atoms/Button';

export const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
`;

StyledForm.displayName = 'StyledForm';

export const StyledButton = styled(Button)`
  align-self: center;
  margin-top: 16px;
`;

StyledButton.displayName = 'StyledButton';
