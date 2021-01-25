import styled from 'styled-components';
import { colorPalette } from 'stylesheet';

export const OuterTimerBar = styled.div`
  height: 16px;
  border-radius: 8px;
  padding: 4px 8px;
  width: 100%;
  background: ${colorPalette.blueLight};
  justify-self: flex-end;
`;

export const InnerTimerBar = styled.div<{ duration: number }>`
  height: 8px;
  border-radius: 4px;
  padding: 4px;
  width: 100%;
  background: ${colorPalette.red};

  /* Added for performance reasons, see MDN article : https://developer.mozilla.org/en-US/docs/Web/CSS/will-change */
  will-change: transform;
  transition: width ${(props) => props.duration}s linear;

  &.started {
    width: 0%;
  }
`;
