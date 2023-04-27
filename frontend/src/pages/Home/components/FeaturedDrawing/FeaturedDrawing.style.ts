import styled from 'styled-components';
import { fontSize } from 'stylesheet';

export const FeaturedDrawingContainer = styled.div`
  position: relative;
  width: 192px;
  height: 192px;
`;

export const StyledPic = styled.div`
  height: 192px;
  width: 192px;
  position: relative;
  max-width: 100%;
  float: left;
  border-radius: 16px;

  & > img {
    border-radius: 16px;
    width: 100%;
    height: 100%;
  }

  &::after {
    content: '';
    position: absolute;
    border-radius: 16px;
    inset: 0; /* top, right, bottom, left */
    width: 100%;
    height: 100%;
    box-shadow: 0 0 20px 0 rgba(0 0 0 / 50%) inset;
  }
`;

export const Caption = styled.div`
  position: absolute;
  top: calc(50% - 26px);
  left: 150px;
  font-size: ${fontSize.small};
  padding: 8px;
  border-radius: 4px;
  background-color: rgba(255 255 255 / 90%);
  white-space: nowrap;
  line-height: 18px;
`;
