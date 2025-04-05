import React from 'react';
import { Vote } from 'redux/Game/types';
import { ThumbUpButton } from '../ReactionOverlay/ReactionOverlay.style';
import { LikesSection } from './VotesOverlay.style';

interface Props {
  votes: Vote[];
}

const VotesOverlay: React.FC<Props> = ({ votes }) =>
  votes.length ? (
    <LikesSection>
      {votes.length} <ThumbUpButton />
    </LikesSection>
  ) : null;

export default VotesOverlay;
