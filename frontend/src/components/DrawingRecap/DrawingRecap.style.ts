import styled from 'styled-components';

import thumbUpIcon from 'assets/thumb-up.svg';
import thumbDownIcon from 'assets/thumb-down.svg';

export const StyledDrawingRecap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 240px;
  height: 260px;
  justify-content: space-between;
  margin-bottom: 8px;
  letter-spacing: 0.1em;
  line-height: 19px;
  font-weight: bold;
  position: relative;
`;

StyledDrawingRecap.displayName = 'StyledSentenceRecap';

export const SentenceHeader = styled.div`
  text-transform: uppercase;
`;

SentenceHeader.displayName = 'SentenceHeader';

export const ThumbUpIcon = styled.img.attrs({ src: thumbUpIcon })``;

ThumbUpIcon.displayName = 'ThumbUpIcon';

export const ThumbDownIcon = styled.img.attrs({ src: thumbDownIcon })``;

ThumbDownIcon.displayName = 'ThumbDownIcon';

export const ReactionOverlay = styled.div<{ width: number; height: number }>`
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  position: absolute;
  bottom: 0;
  opacity: 0;
  z-index: 25;
  background-color: rgb(155, 81, 224, 0.4);
  border-radius: 16px;
  display: flex;

  :hover {
    opacity: 1;
  }
`;

ReactionOverlay.displayName = 'ReactionOverlay';

export const LikeClickArea = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  ${ThumbDownIcon}, ${ThumbUpIcon} {
    transition: transform 0.1s linear;
  }

  :hover ${/* sc-selector */ ThumbDownIcon}, :hover ${ThumbUpIcon} {
    transform: scale(1.2, 1.2);
  }
`;

LikeClickArea.displayName = 'LikeClickArea';

export const LikesSection = styled.div`
  display: flex;
  justify-content: flex-end;
  z-index: 20;
  position: absolute;
  bottom: 8px;
  right: 8px;
`;

LikesSection.displayName = 'LikesSection';
