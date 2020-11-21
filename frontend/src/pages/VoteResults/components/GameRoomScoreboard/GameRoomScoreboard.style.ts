import styled from 'styled-components';
import Header2 from 'atoms/Header2';
import { colorPalette } from 'stylesheet';

const PODIUM_WIDTH = 534;

export const GameScoreboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: calc(100% - ${PODIUM_WIDTH}px);
  padding-left: 16px;
`;

GameScoreboardContainer.displayName = 'GameScoreboardContainer';

export const StyledHeader = styled(Header2)`
  color: ${colorPalette.purple};
  margin-bottom: 32px;
  text-align: center;
`;

StyledHeader.displayName = 'StyledHeader';
