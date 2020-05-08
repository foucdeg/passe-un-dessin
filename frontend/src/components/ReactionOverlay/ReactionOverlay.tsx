/* eslint-disable react/no-array-index-key */
import React from 'react';
import {
  ReactionOverlayContainer,
  LikeClickArea,
  ThumbDownIcon,
  ThumbUpIcon,
  LikesSection,
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

  return (
    <>
      <ReactionOverlayContainer className={className}>
        {canUnlike && (
          <LikeClickArea onClick={onUnlike}>
            <ThumbDownIcon />
          </LikeClickArea>
        )}
        {canLike && (
          <LikeClickArea onClick={onLike}>
            <ThumbUpIcon />
          </LikeClickArea>
        )}
      </ReactionOverlayContainer>

      <LikesSection>
        {Array(likeCount)
          .fill('')
          .map((_, index) => (
            <ThumbUpIcon key={index} />
          ))}
      </LikesSection>
    </>
  );
};

export default ReactionOverlay;
