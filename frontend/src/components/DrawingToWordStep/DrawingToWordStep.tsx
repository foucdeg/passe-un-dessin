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
  Spacer,
} from 'components/WordToDrawingStep/WordToDrawingStep.style';
import { StyledForm, StyledButton, StyledPlayerChips, Subtext } from './DrawingToWordStep.style';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/types';
import PlayerChip from 'atoms/PlayerChip';
import StaticInput from 'atoms/StaticInput';

interface Props {
  padStep: PadStep;
  previousPlayer: Player | null;
  nextPlayer: Player | null;
  saveStep: (values: { sentence?: string; drawing?: string }) => void;
}

const DrawingToWordStep: React.FC<Props> = ({ padStep, saveStep, previousPlayer, nextPlayer }) => {
  const [sentence, setSentence] = useState<string>('');
  const remainingPlayers = useSelector((state: RootState) => state.game.remainingPlayers);

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
        <StyledHeader>Devine ce dessin :</StyledHeader>
        <Subtext>(sorti du cerveau malade de {previousPlayer.name})</Subtext>
        {padStep.sentence ? (
          <StaticInput>{padStep.sentence}</StaticInput>
        ) : (
          <StyledForm
            onSubmit={e => {
              e.preventDefault();
              saveStep({ sentence });
            }}
          >
            <TextInput
              type="text"
              autoFocus
              placeholder="Un mouton ?"
              value={sentence}
              onChange={e => setSentence(e.target.value)}
            />
            <StyledButton type="submit">Valider</StyledButton>
          </StyledForm>
        )}

        <Spacer />
        {nextPlayer && sentence && (
          <p>
            En espérant que {nextPlayer.name} sache mieux dessiner que {previousPlayer.name} ...
          </p>
        )}
        <em>On attend ceux-là pour continuer :</em>
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
