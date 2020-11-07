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
Container.displayName = 'Container';

export const TopRightButtons = styled.div`
  position: absolute;
  right: 0;
  top: -40px;
  display: flex;
`;

TopRightButtons.displayName = 'TopRightButtons';

export const TopRightButton = styled(SecondaryButton)`
  height: 32px;
  padding: 0 16px;
  margin-left: 8px;
  white-space: nowrap;
`;

TopRightButton.displayName = 'TopRightButton';

export const LeftSide = styled.div`
  display: flex;
  flex-direction: column;
`;
LeftSide.displayName = 'LeftSide';

export const StyledHeader = styled(Header2)`
  color: ${colorPalette.purple};
  text-align: center;
`;
StyledHeader.displayName = 'StyledHeader';

export const StyledLaunchIcon = styled(LaunchIcon)`
  margin-left: 8px;
  .main {
    fill: ${(props) => props.color || colorPalette.orange};
  }
`;

StyledLaunchIcon.displayName = 'StyledLaunchIcon';
