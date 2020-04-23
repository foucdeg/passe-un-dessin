import React from 'react';
import { StyledDrawingRecap, LikeEmoji } from './DrawingRecap.style';
import CanvasDraw from 'react-canvas-draw';
import lzString from 'lz-string';
import { CanvasWrapper } from 'components/WordToDrawingStep/WordToDrawingStep.style';
import { SentenceHeader } from 'components/SentenceRecap/SentenceRecap.style';
import { PadStep } from 'redux/Game/types';
import { useSaveVote, useDeleteVote } from 'redux/Game/hooks';
import { selectPlayer } from 'redux/Player/selectors';
import { useSelector } from 'redux/useSelector';

interface Props {
  step: PadStep;
  enableVote?: boolean;
}

const DrawingRecap: React.FC<Props> = ({ step, enableVote }) => {
  const player = useSelector(selectPlayer);
  const liked = !!(player && step.votes.find(vote => vote.player.uuid === player.uuid));

  const doSaveVote = useSaveVote();
  const doDeleteVote = useDeleteVote();

  const onLike = () => {
    if (liked) {
      doDeleteVote(step.uuid);
    } else {
      doSaveVote(step.uuid);
    }
  };

  return (
    <StyledDrawingRecap>
      <SentenceHeader>
        {step.player.name}{' '}
        {enableVote && (
          <LikeEmoji onClick={onLike} liked={liked}>
            &#128525;
          </LikeEmoji>
        )}
      </SentenceHeader>
      <CanvasWrapper liked={enableVote && liked}>
        <CanvasDraw
          disabled
          canvasWidth={236}
          canvasHeight={236}
          hideGrid
          saveData={lzString.decompressFromBase64(step.drawing)}
        />
      </CanvasWrapper>
    </StyledDrawingRecap>
  );
};

export default DrawingRecap;
