import styled from 'styled-components';
import Header2 from 'atoms/Header2';
import { colorPalette } from 'stylesheet';

export const GameScoreboardContainer = styled.div`
  max-width: 300px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin: 0 auto;
`;

GameScoreboardContainer.displayName = 'GameScoreboardContainer';

export const StyledHeader = styled(Header2)`
  color: ${colorPalette.purple};
  margin-bottom: 32px;
  text-align: center;
`;

StyledHeader.displayName = 'StyledHeader';
