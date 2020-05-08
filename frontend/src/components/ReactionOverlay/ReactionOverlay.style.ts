import styled from 'styled-components';

import thumbUpIcon from 'assets/thumb-up.svg';
import thumbDownIcon from 'assets/thumb-down.svg';

export const ThumbUpIcon = styled.img.attrs({ src: thumbUpIcon })``;

ThumbUpIcon.displayName = 'ThumbUpIcon';

export const ThumbDownIcon = styled.img.attrs({ src: thumbDownIcon })``;

ThumbDownIcon.displayName = 'ThumbDownIcon';

export const ReactionOverlayContainer = styled.div`
  width: 100%;
  height: calc(100% - 24px);
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

ReactionOverlayContainer.displayName = 'ReactionOverlayContainer';

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
