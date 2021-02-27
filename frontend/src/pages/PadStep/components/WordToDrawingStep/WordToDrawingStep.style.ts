import styled from 'styled-components';
import Header2 from 'atoms/Header2';
import { colorPalette } from 'stylesheet';
import Header3 from 'atoms/Header3';

export const LeftAndRightSide = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;

export const LeftSide = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  position: relative;
`;

export const RightSide = styled.div`
  flex-grow: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  text-align: center;
`;

export const Gutter = styled.div`
  width: 16px;
  height: 100%;
`;

export const StyledHeader = styled(Header2)`
  color: ${colorPalette.purple};
  margin-bottom: 8px;
`;

export const Sentence = styled(Header3)`
  margin-bottom: 8px;
  text-transform: none;
`;
