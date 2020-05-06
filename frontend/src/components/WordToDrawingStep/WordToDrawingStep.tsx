import Spacer from 'atoms/Spacer';
import CanvasDraw from 'components/Canvas/CanvasDraw';
import Timer from 'components/Timer';
import React from 'react';
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
              <FormattedMessage
                id="wordToDrawing.duration"
                values={{ duration: game.round_duration }}
              />
            </p>
            <Timer duration={game.round_duration} />
          </>
        )}
      </RightSide>
    </LeftAndRightSide>
  );
};

export default WordToDrawingStep;
