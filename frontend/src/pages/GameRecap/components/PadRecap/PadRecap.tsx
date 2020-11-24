import React from 'react';
import { Pad, StepType, PadStep } from 'redux/Game/types';
import SentenceRecap from 'pages/GameRecap/components/SentenceRecap';
import DrawingRecap from 'pages/GameRecap/components/DrawingRecap';
import RecapRemainingPlayers from 'pages/GameRecap/components/RecapRemainingPlayers';
import { useSelector } from 'redux/useSelector';
import { selectPlayer } from 'redux/Player/selectors';
import { PadRecapRow, ArrowSpacer } from './PadRecap.style';

interface Props {
  pad: Pad;
  publicMode: boolean;
  isPlayerInGame: boolean;
}

const PadRecap: React.FC<Props> = ({ pad, publicMode, isPlayerInGame }) => {
  const player = useSelector(selectPlayer);
  const initialStep: PadStep = {
    uuid: pad.uuid,
    sentence: pad.sentence,
    player: pad.initial_player,
    step_type: StepType.DRAWING_TO_WORD,
    votes: [],
    round_number: -1,
    drawing_url: '',
    created_at: '',
  };

  return (
    <PadRecapRow>
      <SentenceRecap step={initialStep} publicMode={publicMode} canVote={false} />
      {pad.steps.map((step) => (
        <React.Fragment key={step.uuid}>
          <ArrowSpacer />
          {step.step_type === StepType.WORD_TO_DRAWING ? (
            <DrawingRecap
              step={step}
              publicMode={publicMode}
              canVote={isPlayerInGame && !!player && player.uuid !== step.player.uuid}
            />
          ) : (
            <SentenceRecap
              step={step}
              publicMode={publicMode}
              canVote={isPlayerInGame && !!player && player.uuid !== step.player.uuid}
            />
          )}
        </React.Fragment>
      ))}
      {!publicMode && <RecapRemainingPlayers />}
    </PadRecapRow>
  );
};

export default PadRecap;
