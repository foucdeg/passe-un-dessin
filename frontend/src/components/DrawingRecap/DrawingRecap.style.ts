import styled from 'styled-components';

export const StyledDrawingRecap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 240px;
  height: 260px;
  justify-content: space-between;
  margin-bottom: 8px;
`;

StyledDrawingRecap.displayName = 'StyledSentenceRecap';

export const SentenceHeader = styled.div`
  letter-spacing: 0.1em;
  line-height: 19px;
  text-transform: uppercase;
  font-weight: bold;
`;

SentenceHeader.displayName = 'SentenceHeader';

export const LikeEmoji = styled.span<{ liked: boolean }>`
  opacity: ${({ liked }) => (liked ? 1 : 0.5)};
  cursor: pointer;

  :hover {
    opacity: 1;
  }
`;

LikeEmoji.displayName = 'LikeEmoji';
