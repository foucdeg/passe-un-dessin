import styled from 'styled-components';
import { colorPalette } from 'stylesheet';

const PlayerChip = styled.div<{ color?: string }>`
  color: ${colorPalette.white};
  height: 36px;
  padding: 8px 16px;
  border-radius: 18px;
  background-color: ${(props) => props.color || colorPalette.orange};
  margin-right: 8px;
  margin-bottom: 8px;
  line-height: 19px;
  display: flex;
  align-items: flex-end;

  &:last-child {
    margin-right: 0;
  }
`;

PlayerChip.displayName = 'PlayerChip';

export default PlayerChip;
