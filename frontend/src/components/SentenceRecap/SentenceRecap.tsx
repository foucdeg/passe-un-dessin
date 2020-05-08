import React from 'react';
import { StyledSentenceRecap, SentenceHeader, Sentence } from './SentenceRecap.style';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'redux/useSelector';
import { selectPlayer } from 'redux/Player/selectors';
import { useSaveVote, useDeleteVote } from 'redux/Game/hooks';
import { selectAvailableVoteCount } from 'redux/Game/selectors';
import { PadStep } from 'redux/Game/types';
import ReactionOverlay from 'components/ReactionOverlay';

interface Props {
  step: PadStep;
}

const SentenceRecap: React.FC<Props> = ({ step }) => {
  const player = useSelector(selectPlayer);
  const availableVoteCount = useSelector(selectAvailableVoteCount);
  const doSaveVote = useSaveVote();
  const doDeleteVote = useDeleteVote();

  if (!player) return null;

  const likeCount = step.votes.filter(vote => vote.player.uuid === player.uuid).length;
  const samePlayer = player.uuid === step.player.uuid;

  const isInitial = step.round_number === -1;

  const canLike = !isInitial && !samePlayer && availableVoteCount > 0;
  const canUnlike = !isInitial && !samePlayer && likeCount > 0;

  const doLike = () => doSaveVote(step.uuid);
  const doUnlike = () => doDeleteVote(step.uuid);

  return (
    <StyledSentenceRecap>
      <SentenceHeader>
        {isInitial ? <FormattedMessage id="recap.initialWord" /> : step.player.name}
      </SentenceHeader>
      <Sentence color={step.player.color}>{step.sentence}</Sentence>
      <ReactionOverlay
        canLike={canLike}
        canUnlike={canUnlike}
        onLike={doLike}
        onUnlike={doUnlike}
        likeCount={likeCount}
      />
    </StyledSentenceRecap>
  );
};
export default SentenceRecap;
