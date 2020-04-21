import React, { useState } from 'react';
import { StyledDrawingRecap, LikeEmoji } from './DrawingRecap.style';
import CanvasDraw from 'react-canvas-draw';
import lzString from 'lz-string';
import { CanvasWrapper } from 'components/WordToDrawingStep/WordToDrawingStep.style';
import { SentenceHeader } from 'components/SentenceRecap/SentenceRecap.style';

interface Props {
  playerName: string;
  drawing: string;
}

const DrawingRecap: React.FC<Props> = ({ drawing, playerName }) => {
  const [liked, setLiked] = useState<boolean>(false);
  return (
    <StyledDrawingRecap>
      <SentenceHeader>
        {playerName}{' '}
        <LikeEmoji onClick={() => setLiked(!liked)} liked={liked}>
          &#128525;
        </LikeEmoji>
      </SentenceHeader>
      <CanvasWrapper liked={liked}>
        <CanvasDraw
          disabled
          canvasWidth={236}
          canvasHeight={236}
          hideGrid
          saveData={lzString.decompressFromBase64(drawing)}
        />
      </CanvasWrapper>
    </StyledDrawingRecap>
  );
};

export default DrawingRecap;
