import React from 'react';
import { useSelector } from 'redux/useSelector';
import { selectPlayerId } from 'redux/Player/selectors';
import { useSaveVote, useDeleteVote } from 'redux/Game/hooks';
import { selectAvailableVoteCount } from 'redux/Game/selectors';
import { PadStep } from 'redux/Game/types';
import ReactionOverlay from 'pages/GameRecap/components/ReactionOverlay';
import VotesOverlay from '../VotesOverlay';
import { StyledSentenceRecap, SentenceHeader, Sentence } from './SentenceRecap.style';

interface Props {
  step: PadStep;
  publicMode: boolean;
  canVote: boolean;
}

const SentenceRecap: React.FC<Props> = ({ step, publicMode, canVote }) => {
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
    <StyledSentenceRecap>
      <SentenceHeader>{step.player.name}</SentenceHeader>
      <Sentence color={step.player.color}>{step.sentence}</Sentence>
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
    </StyledSentenceRecap>
  );
};
export default SentenceRecap;
