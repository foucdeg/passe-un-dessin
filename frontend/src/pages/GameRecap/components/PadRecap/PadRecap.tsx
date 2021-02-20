import React from 'react';
import { Pad, StepType } from 'redux/Game/types';
import SentenceRecap from 'pages/GameRecap/components/SentenceRecap';
import DrawingRecap from 'pages/GameRecap/components/DrawingRecap';
import RecapRemainingPlayers from 'pages/GameRecap/components/RecapRemainingPlayers';
import { useSelector } from 'redux/useSelector';
import { selectPlayerId } from 'redux/Player/selectors';
import { PadRecapRow, ArrowSpacer } from './PadRecap.style';

interface Props {
  pad: Pad;
  publicMode: boolean;
  isPlayerInGame: boolean;
  isDebriefPhase: boolean;
}

const PadRecap: React.FC<Props> = ({ pad, publicMode, isPlayerInGame, isDebriefPhase }) => {
  const playerId = useSelector(selectPlayerId);

  return (
    <PadRecapRow>
      {pad.steps.map((step, index) => {
        const canVote =
          isPlayerInGame && !!playerId && playerId !== step.player.uuid && isDebriefPhase;

        return (
          <React.Fragment key={step.uuid}>
            {index > 0 && <ArrowSpacer />}
            {step.step_type === StepType.WORD_TO_DRAWING ? (
              <DrawingRecap step={step} publicMode={publicMode} canVote={canVote} />
            ) : (
              <SentenceRecap step={step} publicMode={publicMode} canVote={canVote} />
            )}
          </React.Fragment>
        );
      })}
      {!publicMode && isDebriefPhase && <RecapRemainingPlayers />}
    </PadRecapRow>
  );
};

export default PadRecap;
