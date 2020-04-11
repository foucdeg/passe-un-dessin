import React from 'react';
import { StyledSentenceRecap, SentenceHeader, Sentence } from './SentenceRecap.style';

interface Props {
  sentence: string;
  playerName: string;
  color: string;
  isInitial?: boolean;
}

const SentenceRecap: React.FC<Props> = ({ sentence, playerName, isInitial, color }) => (
  <StyledSentenceRecap>
    <SentenceHeader>{isInitial ? 'Mot initial' : playerName}</SentenceHeader>
    <Sentence color={color}>{sentence}</Sentence>
  </StyledSentenceRecap>
);

export default SentenceRecap;
