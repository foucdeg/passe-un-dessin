import styled from 'styled-components';
import Button from 'atoms/Button';

export const StartButton = styled(Button)`
  margin-top: 16px;
`;

StartButton.displayName = 'StartButton';

export const StyledForm = styled.form`
  margin-top: 16px;
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 500px;
`;

StyledForm.displayName = 'StyledForm';
