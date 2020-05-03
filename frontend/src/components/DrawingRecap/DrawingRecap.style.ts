import styled from 'styled-components';

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

export const ToggleLike = styled.div<{ width: number; height: number }>`
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  background-color: rgb(155, 81, 224, 0.4);
  position: absolute;
  opacity: 0;
  z-index: 25;
  border-radius: 16px;
  bottom: 0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;

  :hover {
    opacity: unset;
  }
`;

ToggleLike.displayName = 'ToggleLike';

export const ToggleLikeThumb = styled.img<{ liked: boolean }>`
  width: 60px;
  ${({ liked }) => liked && `transform: rotate(180deg);`}
`;

ToggleLikeThumb.displayName = 'ToggleLikeThumb';

export const AlreadyLikedThumb = styled.img`
  width: 40px;
  z-index: 20;
  position: absolute;
  bottom: 0;
  right: 0;
`;

AlreadyLikedThumb.displayName = 'AlreadyLikedThumb';
