import React from 'react';
import lzString from 'lz-string';

import { useDeleteVote, useSaveVote } from 'redux/Game/hooks';
import { selectAvailableVoteCount } from 'redux/Game/selectors';
import { PadStep } from 'redux/Game/types';
import { selectPlayer } from 'redux/Player/selectors';
import { useSelector } from 'redux/useSelector';
import { StyledDrawingRecap, StyledDrawing, DrawingHeader } from './DrawingRecap.style';
import ReactionOverlay from 'components/ReactionOverlay';

interface Props {
  step: PadStep;
}

const DrawingRecap: React.FC<Props> = ({ step }) => {
  const player = useSelector(selectPlayer);
  const availableVoteCount = useSelector(selectAvailableVoteCount);
  const doSaveVote = useSaveVote();
  const doDeleteVote = useDeleteVote();

  if (!player) return null;

  const likeCount = step.votes.filter(vote => vote.player.uuid === player.uuid).length;
  const samePlayer = player.uuid === step.player.uuid;

  const canLike = !samePlayer && availableVoteCount > 0;
  const canUnlike = !samePlayer && likeCount > 0;

  const doLike = () => doSaveVote(step.uuid);
  const doUnlike = () => doDeleteVote(step.uuid);

  const decodedSaveData = step.drawing && lzString.decompressFromBase64(step.drawing);

  return (
    <StyledDrawingRecap>
      <DrawingHeader>{step.player.name}</DrawingHeader>
      <StyledDrawing data={decodedSaveData} />
      <ReactionOverlay
        canLike={canLike}
        canUnlike={canUnlike}
        onLike={doLike}
        onUnlike={doUnlike}
        likeCount={likeCount}
      />
    </StyledDrawingRecap>
  );
};

export default DrawingRecap;
