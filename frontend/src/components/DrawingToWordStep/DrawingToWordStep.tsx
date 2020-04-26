import React, { useState } from 'react';
import { PadStep } from 'redux/Game/types';
import CanvasDraw from 'react-canvas-draw';
import TextInput from 'components/TextInput';
import lzString from 'lz-string';
import { Player } from 'redux/Player/types';
import {
  LeftAndRightSide,
  LeftSide,
  CanvasWrapper,
  Gutter,
  RightSide,
  StyledHeader,
} from 'components/WordToDrawingStep/WordToDrawingStep.style';
import { StyledForm, StyledButton, StyledPlayerChips, Subtext } from './DrawingToWordStep.style';
import { useSelector } from 'redux/useSelector';
import PlayerChip from 'atoms/PlayerChip';
import { selectRemainingPlayers } from 'redux/Game/selectors';
import { useIntl, FormattedMessage } from 'react-intl';
import Spacer from 'atoms/Spacer';
import StaticInput from 'components/StaticInput';
import InputLoader from 'components/InputLoader';
import { InputArrow } from 'components/PlayerModal/PlayerModal.style';

interface Props {
  padStep: PadStep;
  previousPlayer: Player | null;
  nextPlayer: Player | null;
  saveStep: (values: { sentence?: string; drawing?: string }) => void;
  loading: boolean;
}

const DrawingToWordStep: React.FC<Props> = ({
  padStep,
  saveStep,
  previousPlayer,
  nextPlayer,
  loading,
}) => {
  const [sentence, setSentence] = useState<string>('');
  const remainingPlayers = useSelector(selectRemainingPlayers);
  const intl = useIntl();

  const onSubmit = (event: React.MouseEvent | React.FormEvent) => {
    event.preventDefault();
    if (sentence !== '') {
      saveStep({ sentence });
    }
  };

  if (!previousPlayer) return null;

  return (
    <LeftAndRightSide>
      <LeftSide>
        <CanvasWrapper>
          <CanvasDraw
            disabled
            hideGrid
            hideInterface
            canvasWidth={538}
            canvasHeight={538}
            saveData={lzString.decompressFromBase64(padStep.drawing)}
          />
        </CanvasWrapper>
      </LeftSide>
      <Gutter />
      <RightSide>
        <StyledHeader>
          <FormattedMessage id="drawingToWord.drawingToGuess" />
        </StyledHeader>
        <Subtext>
          <FormattedMessage
            id="drawingToWord.previousPlayer"
            values={{ name: previousPlayer.name }}
          />
        </Subtext>
        {padStep.sentence ? (
          <StaticInput>{padStep.sentence}</StaticInput>
        ) : (
          <StyledForm onSubmit={onSubmit}>
            <TextInput
              type="text"
              autoFocus
              placeholder={intl.formatMessage({ id: 'drawingToWord.placeholder' })}
              value={sentence}
              onChange={e => setSentence(e.target.value)}
              adornment={
                loading ? <InputLoader /> : <InputArrow alt="Valider" onClick={onSubmit} />
              }
            />
            <StyledButton type="submit">
              <FormattedMessage id="drawingToWord.submit" />
            </StyledButton>
          </StyledForm>
        )}

        <Spacer />
        {nextPlayer && sentence && (
          <p>
            <FormattedMessage
              id="drawingToWord.nextPlayer"
              values={{ previous: previousPlayer.name, next: nextPlayer.name }}
            />
          </p>
        )}
        <em>
          <FormattedMessage id="drawingToWord.waitingFor" />
        </em>
        <StyledPlayerChips>
          {remainingPlayers.map(player => (
            <PlayerChip key={player.uuid} color={player.color}>
              {player.name}
            </PlayerChip>
          ))}
        </StyledPlayerChips>
      </RightSide>
    </LeftAndRightSide>
  );
};

export default DrawingToWordStep;
