import React, { useState, useEffect } from 'react';
import Spacer from 'atoms/Spacer';
import CanvasDraw from 'components/Canvas/CanvasDraw';
import Timer from 'components/Timer';
import { FormattedMessage } from 'react-intl';
import { selectGame } from 'redux/Game/selectors';
import { PadStep } from 'redux/Game/types';
import { Player } from 'redux/Player/types';
import { useSelector } from 'redux/useSelector';
import {
  Gutter,
  LeftAndRightSide,
  LeftSide,
  RightSide,
  Sentence,
  StyledHeader,
} from './WordToDrawingStep.style';
import RemainingPlayers from 'components/RemainingPlayers';

interface Props {
  padStep: PadStep;
  previousPlayer: Player | null;
  nextPlayer: Player | null;
  saveStep: (values: { sentence?: string; drawing?: string }) => void;
  loading: boolean;
}

const WordToDrawingStep: React.FC<Props> = ({ padStep, previousPlayer, saveStep, loading }) => {
  const game = useSelector(selectGame);
  const [remainingTime, setRemainingTime] = useState<number | undefined>(game?.round_duration);

  useEffect(() => {
    let interval: number | undefined = undefined;
    if (remainingTime) {
      interval = setInterval(() => {
        setRemainingTime(remainingTime - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [remainingTime, setRemainingTime]);

  if (!game) return null;
  if (!previousPlayer) return null;

  const finished = loading || !!padStep.drawing;

  return (
    <LeftAndRightSide>
      <LeftSide>
        <CanvasDraw
          canvasWidth={538}
          canvasHeight={538}
          saveStep={saveStep}
          finished={finished}
          round_duration={game.round_duration}
        />
      </LeftSide>
      <Gutter />
      <RightSide>
        <StyledHeader>
          <FormattedMessage id="wordToDrawing.sentenceToDraw" />
        </StyledHeader>
        <Sentence>
          {padStep.sentence || <FormattedMessage id="wordToDrawing.noSentence" />}
        </Sentence>
        <em>
          <FormattedMessage
            id="wordToDrawing.previousPlayer"
            values={{ name: previousPlayer.name }}
          />
        </em>
        <Spacer />
        {finished ? (
          <RemainingPlayers />
        ) : (
          <>
            <p>
              <FormattedMessage id="wordToDrawing.duration" values={{ duration: remainingTime }} />
            </p>
            <Timer duration={game.round_duration} />
          </>
        )}
      </RightSide>
    </LeftAndRightSide>
  );
};

export default WordToDrawingStep;
