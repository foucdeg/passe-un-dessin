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
