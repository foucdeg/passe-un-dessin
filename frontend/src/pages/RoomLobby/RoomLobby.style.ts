import styled from 'styled-components';
import { colorPalette } from 'stylesheet';
import TextInput from 'components/TextInput';

const PLAYER_COLORS = ['#60DAFF', '#9337AE', '#62FAD3', '#8A80F1'];

const randomColor = () => {
  return PLAYER_COLORS[Math.floor(Math.random() * PLAYER_COLORS.length)];
};

export const Info = styled.span`
  color: ${colorPalette.textGrey};
`;

Info.displayName = 'Info';

export const PlayerChips = styled.div`
  display: flex;
  margin-bottom: 32px;
`;

PlayerChips.displayName = 'PlayerChips';

export const StyledField = styled(TextInput)`
  margin-bottom: 16px;
`;

StyledField.displayName = 'StyledField';

export const PlayerChip = styled.div`
  color: ${colorPalette.white};
  height: 36px;
  padding: 8px 16px;
  border-radius: 18px;
  background-color: ${() => randomColor()};
  margin-right: 8px;
`;

PlayerChip.displayName = 'PlayerChip';

export const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

ButtonRow.displayName = 'ButtonRow';

export const HelpText = styled.span`
  font-style: italic;
  margin-right: 16px;
`;

HelpText.displayName = 'HelpText';
