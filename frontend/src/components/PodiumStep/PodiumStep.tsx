import podiumsSteps from 'assets/podium-steps';
import Spacer from 'atoms/Spacer';
import CanvasRecap from 'components/Canvas/CanvasRecap';
import lzString from 'lz-string';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { PadStep } from 'redux/Game/types';
import {
  Container,
  PlayerName,
  PodiumStepImage,
  Sentence,
  VoteCount,
  WinnerSection,
} from './PodiumStep.style';

interface Props {
  winner?: PadStep;
  width: number;
  ranking: number;
}

const PodiumStep: React.FC<Props> = ({ winner, width, ranking }) => {
  const decodedWinnerDrawing =
    winner && winner.drawing ? lzString.decompressFromBase64(winner.drawing) : null;

  return (
    <Container width={width}>
      <Spacer />
      {winner && (
        <WinnerSection width={width} height={width}>
          <Sentence>{winner.sentence}</Sentence>
          <CanvasRecap width={width} height={width} saveData={decodedWinnerDrawing} hideBorder />
          <PlayerName>{winner.player.name}</PlayerName>
          <VoteCount>
            <FormattedMessage
              id="voteResults.voteCount"
              values={{ voteCount: winner.votes.length }}
            />
          </VoteCount>
        </WinnerSection>
      )}
      <PodiumStepImage src={podiumsSteps[ranking - 1]} width={width} />
    </Container>
  );
};

export default PodiumStep;
