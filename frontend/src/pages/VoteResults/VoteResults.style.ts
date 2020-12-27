import styled from 'styled-components';

import SecondaryButton from 'atoms/SecondaryButton';
import Header2 from 'atoms/Header2';
import { ReactComponent as LaunchIcon } from 'assets/launch.svg';
import { colorPalette } from 'stylesheet';

export const Container = styled.div`
  display: flex;
  height: 100%;
  justify-content: center;
`;

export const TopRightButtons = styled.div`
  position: absolute;
  right: 0;
  top: -40px;
  display: flex;
`;

export const TopRightButton = styled(SecondaryButton)`
  height: 32px;
  padding: 0 16px;
  margin-left: 8px;
  white-space: nowrap;
`;

export const LeftSide = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StyledHeader = styled(Header2)`
  color: ${colorPalette.purple};
  text-align: center;
`;

export const StyledLaunchIcon = styled(LaunchIcon)`
  margin-left: 8px;
  .main {
    fill: ${(props) => props.color || colorPalette.orange};
  }
`;
