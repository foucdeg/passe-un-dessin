/* eslint-disable react/no-array-index-key */
import React from 'react';
import lzString from 'lz-string';

import CanvasRecap from 'components/Canvas/CanvasRecap';
import { SentenceHeader } from 'components/SentenceRecap/SentenceRecap.style';
import { useDeleteVote, useSaveVote } from 'redux/Game/hooks';
import { selectAvailableVoteCount } from 'redux/Game/selectors';
import { PadStep } from 'redux/Game/types';
import { selectPlayer } from 'redux/Player/selectors';
import { useSelector } from 'redux/useSelector';
import {
  ReactionOverlay,
  ThumbUpIcon,
  ThumbDownIcon,
  StyledDrawingRecap,
  LikeClickArea,
  LikesSection,
} from './DrawingRecap.style';

interface Props {
  step: PadStep;
}

const CANVAS_WIDTH = 236;

const DrawingRecap: React.FC<Props> = ({ step }) => {
  const player = useSelector(selectPlayer);
  const availableVoteCount = useSelector(selectAvailableVoteCount);
  const doSaveVote = useSaveVote();
  const doDeleteVote = useDeleteVote();

  if (!player) return null;

  const likedCount = step.votes.filter(vote => vote.player.uuid === player.uuid).length;
  const samePlayer = player.uuid === step.player.uuid;

  const canLike = !samePlayer && availableVoteCount > 0;
  const canUnlike = !samePlayer && likedCount > 0;

  const doLike = () => doSaveVote(step.uuid);
  const doUnlike = () => doDeleteVote(step.uuid);

  const decodedSaveData = step.drawing && lzString.decompressFromBase64(step.drawing);

  return (
    <StyledDrawingRecap>
      <SentenceHeader>{step.player.name}</SentenceHeader>
      <CanvasRecap width={CANVAS_WIDTH} height={CANVAS_WIDTH} saveData={decodedSaveData} />
      {(canLike || canUnlike) && (
        <ReactionOverlay width={CANVAS_WIDTH} height={CANVAS_WIDTH}>
          {canUnlike && (
            <LikeClickArea onClick={doUnlike}>
              <ThumbDownIcon />
            </LikeClickArea>
          )}
          {canLike && (
            <LikeClickArea onClick={doLike}>
              <ThumbUpIcon />
            </LikeClickArea>
          )}
        </ReactionOverlay>
      )}

      <LikesSection>
        {Array(likedCount)
          .fill('')
          .map((_, index) => (
            <ThumbUpIcon key={index} />
          ))}
      </LikesSection>
    </StyledDrawingRecap>
  );
};

export default DrawingRecap;
