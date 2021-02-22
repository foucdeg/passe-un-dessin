/* eslint-disable react/no-array-index-key */
import React from 'react';
import {
  ReactionOverlayContainer,
  ReactionOverlayTouchContainer,
  LikeClickArea,
  TouchLikeClickArea,
  ThumbDownButton,
  ThumbUpButton,
  LikesSection,
  TouchLikesSection,
} from './ReactionOverlay.style';

interface Props {
  className?: string;
  canLike: boolean;
  canUnlike: boolean;
  onLike: () => void;
  onUnlike: () => void;
  likeCount: number;
}

const ReactionOverlay: React.FC<Props> = ({
  className,
  canLike,
  canUnlike,
  onLike,
  onUnlike,
  likeCount,
}) => {
  if (!(canLike || canUnlike)) return null;

  const isTouchScreen = window.matchMedia('(pointer: coarse)').matches;

  if (isTouchScreen) {
    return (
      <>
        <ReactionOverlayTouchContainer className={className}>
          <TouchLikeClickArea>
            {canUnlike && <ThumbDownButton primary onClick={onUnlike} />}
          </TouchLikeClickArea>
          <TouchLikeClickArea>
            {canLike && <ThumbUpButton primary onClick={onLike} />}
          </TouchLikeClickArea>
        </ReactionOverlayTouchContainer>

        <TouchLikesSection>
          {Array(likeCount)
            .fill('')
            .map((_, index) => (
              <ThumbUpButton key={index} />
            ))}
        </TouchLikesSection>
      </>
    );
  }

  return (
    <>
      <ReactionOverlayContainer className={className}>
        {canUnlike && (
          <LikeClickArea onClick={onUnlike} data-test="downvote">
            <ThumbDownButton primary />
          </LikeClickArea>
        )}
        {canLike && (
          <LikeClickArea onClick={onLike} data-test="upvote">
            <ThumbUpButton primary />
          </LikeClickArea>
        )}
      </ReactionOverlayContainer>

      <LikesSection>
        {Array(likeCount)
          .fill('')
          .map((_, index) => (
            <ThumbUpButton key={index} />
          ))}
      </LikesSection>
    </>
  );
};

export default ReactionOverlay;
