import styled from 'styled-components';
import { colorPalette } from 'stylesheet';

export const PlayerChip = styled.div<{ color: string }>`
  color: ${colorPalette.white};
  height: 36px;
  padding: 8px 16px;
  border-radius: 18px;
  background-color: ${props => props.color};
  margin-right: 8px;
  margin-bottom: 8px;
  line-height: 19px;
`;

PlayerChip.displayName = 'PlayerChip';

export default PlayerChip;
