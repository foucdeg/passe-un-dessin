import styled from 'styled-components';
import Button from 'components/Button';

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

export const Subtext = styled.em`
  margin-bottom: 24px;
`;

Subtext.displayName = 'Subtext';
