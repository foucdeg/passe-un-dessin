import React from 'react';
import { StyledSentenceRecap, SentenceHeader, Sentence } from './SentenceRecap.style';
import { useIntl } from 'react-intl';

interface Props {
  sentence: string | null;
  playerName: string;
  color: string;
  isInitial?: boolean;
}

const SentenceRecap: React.FC<Props> = ({ sentence, playerName, isInitial, color }) => {
  const intl = useIntl();

  return (
    <StyledSentenceRecap>
      <SentenceHeader>
        {isInitial ? intl.formatMessage({ id: 'recap.initialWord' }) : playerName}
      </SentenceHeader>
      <Sentence color={color}>{sentence}</Sentence>
    </StyledSentenceRecap>
  );
};
export default SentenceRecap;
