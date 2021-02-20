import React from 'react';

import { useDeleteVote, useSaveVote } from 'redux/Game/hooks';
import { selectAvailableVoteCount } from 'redux/Game/selectors';
import { PadStep } from 'redux/Game/types';
import { selectPlayerId } from 'redux/Player/selectors';
import { useSelector } from 'redux/useSelector';
import ReactionOverlay from 'pages/GameRecap/components/ReactionOverlay';
import VotesOverlay from '../VotesOverlay';
import { StyledDrawingRecap, StyledDrawing, DrawingHeader } from './DrawingRecap.style';

interface Props {
  step: PadStep;
  publicMode: boolean;
  canVote: boolean;
}

const DrawingRecap: React.FC<Props> = ({ step, publicMode, canVote }) => {
  const playerId = useSelector(selectPlayerId);
  const availableVoteCount = useSelector(selectAvailableVoteCount);
  const doSaveVote = useSaveVote();
  const doDeleteVote = useDeleteVote();

  if (!publicMode && !playerId) return null;

  const likeCount = step.votes.filter((vote) => playerId && vote.player_id === playerId).length;

  const canLike = canVote && availableVoteCount > 0;
  const canUnlike = canVote && likeCount > 0;

  const doLike = () => doSaveVote(step.uuid);
  const doUnlike = () => doDeleteVote(step.uuid);

  return (
    <StyledDrawingRecap>
      <DrawingHeader>{step.player.name}</DrawingHeader>
      <StyledDrawing src={step.drawing_url} />
      {publicMode ? (
        <VotesOverlay votes={step.votes} />
      ) : (
        (canLike || canUnlike) && (
          <ReactionOverlay
            canLike={canLike}
            canUnlike={canUnlike}
            onLike={doLike}
            onUnlike={doUnlike}
            likeCount={likeCount}
          />
        )
      )}
    </StyledDrawingRecap>
  );
};

export default DrawingRecap;
