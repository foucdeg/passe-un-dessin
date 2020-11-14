import React, { useCallback } from 'react';
import Spacer from 'atoms/Spacer';
import CanvasDraw from 'components/Canvas/CanvasDraw';
import Timer from 'pages/PadStep/components/Timer';
import { FormattedMessage } from 'react-intl';
import { selectGame } from 'redux/Game/selectors';
import { PadStep } from 'redux/Game/types';
import { useSelector } from 'redux/useSelector';
import RemainingPlayers from 'components/RemainingPlayers';
import { useBoolean } from 'services/utils';
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
  saveStep: (values: { sentence?: string; drawing?: string }) => void;
  loading: boolean;
}

const WordToDrawingStep: React.FC<Props> = ({ padStep, saveStep, loading }) => {
  const game = useSelector(selectGame);
  const [finished, setFinished] = useBoolean(false);

  const doSaveStep = useCallback(
    async (values: { sentence?: string; drawing?: string }) => {
      await saveStep(values);
      setFinished();
    },
    [setFinished, saveStep],
  );

  if (!game) return null;

  return (
    <LeftAndRightSide>
      <LeftSide>
        <CanvasDraw
          canvasWidth={538}
          canvasHeight={538}
          saveStep={doSaveStep}
          finished={loading || finished}
          roundDuration={game.round_duration}
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
        <Spacer />
        {loading || finished ? (
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
