import Header2 from 'atoms/Header2';
import styled from 'styled-components';
import { colorPalette } from 'stylesheet';

export const LeftAndRightSide = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;
LeftAndRightSide.displayName = 'LeftAndRightSide';

export const LeftSide = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  position: relative;
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

export const StyledHeader = styled(Header2)`
  color: ${colorPalette.purple};
  margin-bottom: 8px;
`;

StyledHeader.displayName = 'StyledHeader';

export const Sentence = styled.strong`
  margin-bottom: 8px;
`;

Sentence.displayName = 'Sentence';
