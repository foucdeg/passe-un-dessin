import React from 'react';
import { StyledSentenceRecap } from './SentenceRecap.style';

interface Props {
  sentence: string;
  playerName: string;
  isInitial?: boolean;
}

const SentenceRecap: React.FC<Props> = ({ sentence, playerName, isInitial }) => (
  <StyledSentenceRecap>
    <span>{isInitial ? 'Mot initial' : playerName}</span>
    :&nbsp;
    <span>{sentence} </span>
  </StyledSentenceRecap>
);

export default SentenceRecap;
