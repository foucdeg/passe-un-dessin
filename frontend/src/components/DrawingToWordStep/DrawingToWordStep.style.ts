import styled from 'styled-components';
import Button from 'components/Button';
import PlayerChips from 'atoms/PlayerChips';

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

export const StyledPlayerChips = styled(PlayerChips)`
  margin-top: 8px;
  justify-content: center;
`;

StyledPlayerChips.displayName = 'StyledPlayerChips';

export const Subtext = styled.em`
  margin-bottom: 24px;
`;

Subtext.displayName = 'Subtext';
