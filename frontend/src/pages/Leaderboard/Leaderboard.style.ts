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

export const StyledHeader = styled(Header2)`
  color: ${colorPalette.purple};
  margin-bottom: 32px;
  text-align: center;
`;

export const StyledLink = styled(Link)`
  position: absolute;
  display: block;
  left: 24px;
  top: 24px;
`;

export const HomeButton = styled.img.attrs({ src: homeIcon })``;

export const StyledScoreboard = styled(Scoreboard)`
  width: 500px;
  padding: 0 20px;
`;

export const ScoreboardWithFilter = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: calc(100% - 60px);
`;

export const FilterInput = styled(TextInput)`
  width: 300px;
`;
