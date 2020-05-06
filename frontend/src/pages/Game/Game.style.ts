import styled, { css } from 'styled-components';
import fullBackground from 'assets/full-background.svg';
import homeIcon from 'assets/home.svg';

import { colorPalette } from 'stylesheet';
import { Link } from 'react-router-dom';

export const GameContainer = styled.div`
  width: 100%;
  height: 100%;
  background: url(${fullBackground});
  background-size: cover;
  padding: 64px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;
GameContainer.displayName = 'GameContainer';

export const InnerGameContainer = styled.div<{ hasTabs?: boolean }>`
  width: 100%;
  height: 570px;
  background: ${colorPalette.white};
  border-radius: 16px;
  padding: 16px;
  position: relative;
  ${props =>
    props.hasTabs &&
    css`
      border-radius: 0 16px 16px 16px;
    `}
`;
InnerGameContainer.displayName = 'InnerGameContainer';

export const HomeLink = styled(Link)`
  position: absolute;
  left: 24px;
  top: 24px;
`;
HomeLink.displayName = 'HomeLink';

export const HomeButton = styled.img.attrs({ src: homeIcon })``;
HomeButton.displayName = 'HomeButton';
