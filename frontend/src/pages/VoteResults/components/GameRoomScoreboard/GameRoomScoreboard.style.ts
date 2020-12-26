import styled from 'styled-components';
import Header2 from 'atoms/Header2';
import { colorPalette } from 'stylesheet';
import { PODIUM_WIDTH } from '../Podium/Podium';

export const GameScoreboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: calc(100% - ${PODIUM_WIDTH}px);
  padding-left: 16px;
  max-height: 100%;
  overflow-y: auto;
`;

export const InnerScoreboardContainer = styled.div`
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
`;

export const StyledHeader = styled(Header2)`
  color: ${colorPalette.purple};
  margin-bottom: 32px;
  text-align: center;
`;
