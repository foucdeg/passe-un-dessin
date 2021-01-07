import styled from 'styled-components';
import Header2 from 'atoms/Header2';
import TextInput from 'atoms/TextInput';
import { colorPalette } from 'stylesheet';
import Scoreboard from 'components/Scoreboard';

export const StyledHeader = styled(Header2)`
  color: ${colorPalette.purple};
  margin-bottom: 32px;
  text-align: center;
`;

export const StyledScoreboard = styled(Scoreboard)`
  flex-shrink: 1;
`;

export const ScoreboardWithFilter = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: calc(100% - 60px);
`;

export const FilterInput = styled(TextInput)`
  width: 100%;
  flex-shrink: 0;
  box-shadow: 0 -11px 10px 0 ${colorPalette.white};
`;
