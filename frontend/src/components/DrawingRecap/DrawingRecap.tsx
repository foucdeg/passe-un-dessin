import React from 'react';
import thumb from 'assets/thumb.png';
import CanvasRecap from 'components/Canvas/CanvasRecap';
import { SentenceHeader } from 'components/SentenceRecap/SentenceRecap.style';
import lzString from 'lz-string';
import { useDeleteVote, useSaveVote } from 'redux/Game/hooks';
import { selectAvailableVoteCount } from 'redux/Game/selectors';
import { PadStep } from 'redux/Game/types';
import { selectPlayer } from 'redux/Player/selectors';
import { useSelector } from 'redux/useSelector';
import {
  AlreadyLikedThumb,
  StyledDrawingRecap,
  ToggleLike,
  ToggleLikeThumb,
} from './DrawingRecap.style';

interface Props {
  step: PadStep;
}

const CANVAS_WIDTH = 236;

const DrawingRecap: React.FC<Props> = ({ step }) => {
  const player = useSelector(selectPlayer);
  const availableVoteCount = useSelector(selectAvailableVoteCount);

  const liked = !!(player && step.votes.find(vote => vote.player.uuid === player.uuid));
  const displayToggleVote =
    !!player &&
    player.uuid !== step.player.uuid &&
    (availableVoteCount > 0 || liked) &&
    !!step.drawing;

  const doSaveVote = useSaveVote();
  const doDeleteVote = useDeleteVote();

  const onLike = () => {
    if (liked) {
      doDeleteVote(step.uuid);
    } else {
      doSaveVote(step.uuid);
    }
  };

  const decodedSaveData = step.drawing && lzString.decompressFromBase64(step.drawing);

  return (
    <StyledDrawingRecap>
      <SentenceHeader>{step.player.name}</SentenceHeader>
      <CanvasRecap width={CANVAS_WIDTH} height={CANVAS_WIDTH} saveData={decodedSaveData} />
      {displayToggleVote && (
        <ToggleLike onClick={onLike} width={CANVAS_WIDTH} height={CANVAS_WIDTH}>
          <ToggleLikeThumb src={thumb} liked={liked} />
        </ToggleLike>
      )}
      {liked && <AlreadyLikedThumb src={thumb} />}
    </StyledDrawingRecap>
  );
};

export default DrawingRecap;
