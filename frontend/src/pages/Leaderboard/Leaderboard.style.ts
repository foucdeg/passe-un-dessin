import styled from 'styled-components';
import Header2 from 'atoms/Header2';
import TextInput from 'atoms/TextInput';
import { colorPalette } from 'stylesheet';
import homeIcon from 'assets/home.svg';
import { Link } from 'react-router-dom';
import Scoreboard from 'components/Scoreboard';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  align-items: center;
`;
Container.displayName = 'Container';

export const StyledHeader = styled(Header2)`
  color: ${colorPalette.purple};
  margin-bottom: 32px;
  text-align: center;
`;

StyledHeader.displayName = 'StyledHeader';

export const StyledLink = styled(Link)`
  position: absolute;
  display: block;
  left: 24px;
  top: 24px;
`;
StyledLink.displayName = 'StyledLink';

export const HomeButton = styled.img.attrs({ src: homeIcon })``;
HomeButton.displayName = 'HomeButton';

export const StyledScoreboard = styled(Scoreboard)`
  width: 500px;
  padding: 0 20px;
`;
StyledScoreboard.displayName = 'StyledScoreboard';

export const ScoreboardWithFilter = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: calc(100% - 60px);
`;
ScoreboardWithFilter.displayName = 'ScoreboardWithFilter';

export const FilterInput = styled(TextInput)`
  width: 300px;
`;
FilterInput.displayName = 'FilterInput';
