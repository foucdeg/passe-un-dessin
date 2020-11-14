import Drawing from 'components/Canvas/Drawing';
import styled from 'styled-components';
import { fontSize } from 'stylesheet';

export const StyledDrawing = styled(Drawing)`
  width: 250px;
  height: 250px;
`;
StyledDrawing.displayName = 'StyledDrawing';

export const Frame = styled.div`
  position: relative;
  width: 250px;
  height: 250px;
  background: #611a13;
  box-shadow: 0 10px 7px -5px rgba(0, 0, 0, 0.3);
`;

export const Mat = styled.div`
  position: absolute;
  background: white;
  top: 3%;
  bottom: 3%;
  left: 3%;
  right: 3%;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.5) inset;
`;

export const InnerPic = styled.div`
  position: absolute;
  top: 16%;
  bottom: 16%;
  left: 16%;
  right: 16%;

  & img {
    width: 100%;
  }

  &::after {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.5) inset;
  }
`;
export const Caption = styled.p`
  text-align: center;
  font-size: ${fontSize.small};
  margin-top: 8px;
`;
Caption.displayName = 'Caption';
