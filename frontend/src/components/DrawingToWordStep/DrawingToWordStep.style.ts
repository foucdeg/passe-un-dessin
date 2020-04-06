import styled from 'styled-components';
import Button from 'components/Button';

export const StyledForm = styled.form`
  margin-top: 24px;
  display: flex;
  flex-direction: column;
`;

StyledForm.displayName = 'StyledForm';

export const StyledButton = styled(Button)`
  align-self: center;
  margin-top: 16px;
`;

StyledButton.displayName = 'StyledButton';
