import styled from 'styled-components';
import { colorPalette } from 'stylesheet';
import Header2 from 'atoms/Header2';
import timerIcon from 'assets/timer.svg';

export const LeftAndRightSide = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;
LeftAndRightSide.displayName = 'LeftAndRightSide';

export const LeftSide = styled.div`
  width: 538px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;
LeftSide.displayName = 'LeftSide';

export const RightSide = styled.div`
  flex-grow: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  text-align: center;
`;
RightSide.displayName = 'RightSide';

export const Gutter = styled.div`
  width: 16px;
  height: 100%;
`;
RightSide.displayName = 'RightSide';

export const CanvasWrapper = styled.div<{ liked?: boolean | null }>`
  position: relative;

  /* canvas border */
  & > :first-child {
    border: 2px solid ${({ liked }) => (liked ? colorPalette.red : colorPalette.textGrey)};
    border-radius: 16px;
  }
`;
CanvasWrapper.displayName = 'CanvasWrapper';

export const StyledHeader = styled(Header2)`
  color: ${colorPalette.purple};
  margin-bottom: 8px;
`;

StyledHeader.displayName = 'StyledHeader';

export const Sentence = styled.strong`
  margin-bottom: 8px;
`;

Sentence.displayName = 'Sentence';

export const PadStepDone = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: ${colorPalette.redTransparent};
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 16px;
  z-index: 101;
`;

PadStepDone.displayName = 'PadStepDone';

export const StyledTimerIcon = styled.img.attrs({ src: timerIcon })`
  width: 80px;
  height: 80px;
  margin: 180px 0 32px 0;
`;

StyledTimerIcon.displayName = 'StyledTimerIcon';

export const WhiteHeader = styled(Header2)`
  color: ${colorPalette.white};
`;

WhiteHeader.displayName = 'WhiteHeader';
