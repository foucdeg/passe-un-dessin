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

  return (
    <LeftAndRightSide>
      <LeftSide>
        <CanvasDraw
          canvasWidth={536}
          canvasHeight={536}
          saveStep={saveStep}
          finished={loading || !!padStep.drawing}
          round_duration={game.round_duration}
        />
      </LeftSide>
      <Gutter />
      <RightSide>
        <StyledHeader>
          <FormattedMessage id="wordToDrawing.sentenceToDraw" />
        </StyledHeader>
        <Sentence>{padStep.sentence}</Sentence>
        <em>
          <FormattedMessage
            id="wordToDrawing.previousPlayer"
            values={{ name: previousPlayer.name }}
          />
        </em>
        <Spacer />
        <p>
          <FormattedMessage
            id="wordToDrawing.duration"
            values={{ duration: game.round_duration }}
          />
        </p>
        <Timer duration={game.round_duration} />
      </RightSide>
    </LeftAndRightSide>
  );
};

export default WordToDrawingStep;
