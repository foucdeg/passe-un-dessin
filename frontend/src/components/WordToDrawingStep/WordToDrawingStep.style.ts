import styled from 'styled-components';
import { colorPalette } from 'stylesheet';
import Header2 from 'atoms/Header2';

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

export const CanvasWrapper = styled.div`
  position: relative;

  /* canvas border */
  & > :first-child {
    border: 2px solid ${colorPalette.textGrey};
    border-radius: 16px;
  }
`;
CanvasWrapper.displayName = 'CanvasWrapper';

export const StyledHeader = styled(Header2)`
  margin-bottom: 8px;
`;

StyledHeader.displayName = 'StyledHeader';

export const Sentence = styled.strong`
  margin-bottom: 8px;
`;

Sentence.displayName = 'Sentence';
