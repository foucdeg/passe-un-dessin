import React from 'react';
import { StyledDrawingRecap } from './DrawingRecap.style';
import CanvasDraw from 'react-canvas-draw';
import lzString from 'lz-string';

interface Props {
  playerName: string;
  drawing: string;
}

const DrawingRecap: React.FC<Props> = ({ drawing, playerName }) => (
  <StyledDrawingRecap>
    <span>{playerName}</span>
    :&nbsp;
    <CanvasDraw disabled hideGrid saveData={lzString.decompressFromBase64(drawing)} />
  </StyledDrawingRecap>
);

export default DrawingRecap;
