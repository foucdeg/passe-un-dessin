import styled from 'styled-components';

import { ReactComponent as ThumbUpIcon } from 'assets/thumb-up.svg';
import { ReactComponent as ThumbDownIcon } from 'assets/thumb-down.svg';
import { colorPalette } from 'stylesheet';

export const ThumbUpButton = styled(ThumbUpIcon)<{ primary?: boolean }>`
  .main {
    fill: ${({ primary }) => (primary ? colorPalette.orange : colorPalette.purple)};
  }
`;

export const ThumbDownButton = styled(ThumbDownIcon)<{ primary?: boolean }>`
  .main {
    fill: ${({ primary }) => (primary ? colorPalette.orange : colorPalette.purple)};
  }
`;

export const ReactionOverlayContainer = styled.div`
  width: 100%;
  height: 236px;
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

export const ReactionOverlayTouchContainer = styled.div`
  width: calc(100% + 24px);
  height: 24px;
  position: absolute;
  bottom: -8px;
  z-index: 25;
  justify-content: space-between;
  display: flex;
`;

export const LikeClickArea = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  ${ThumbDownButton}, ${ThumbUpButton} {
    transition: transform 0.1s linear;
  }

  :hover ${/* sc-selector */ ThumbDownButton}, :hover ${ThumbUpButton} {
    transform: scale(1.2, 1.2);
  }
`;

export const TouchLikeClickArea = styled(LikeClickArea)`
  flex: 0;

  :active ${/* sc-selector */ ThumbDownButton}, :active ${ThumbUpButton} {
    transform: scale(1.2, 1.2);
  }
`;

export const LikesSection = styled.div`
  display: flex;
  justify-content: flex-end;
  z-index: 20;
  position: absolute;
  bottom: 8px;
  right: 8px;
`;

export const TouchLikesSection = styled(LikesSection)`
  width: calc(100% - 16px);
  justify-content: center;
`;
