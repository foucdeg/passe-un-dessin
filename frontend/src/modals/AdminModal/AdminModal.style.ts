import styled from 'styled-components';
import Header2 from 'atoms/Header2';
import PlayerChips from 'atoms/PlayerChips';
import crossIcon from 'assets/cross.svg';
import { colorPalette } from 'stylesheet';

export const ButtonRow = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin-top: 16px;
`;

export const StyledHeader = styled(Header2)`
  color: ${colorPalette.purple};
`;

export const Subtitle = styled.p`
  color: ${colorPalette.textGrey};
  margin-bottom: 16px;
`;

export const StyledPlayerChips = styled(PlayerChips)`
  margin: 16px 0;
`;

export const StyledCrossIcon = styled.img.attrs({ src: crossIcon })`
  margin-left: 8px;
  cursor: pointer;
  position: relative;
  top: -1px;
`;

export const Separator = styled.hr`
  border: 1px solid ${colorPalette.purple};
  width: 100%;
  margin-top: 0;
  margin-bottom: 16px;
`;
