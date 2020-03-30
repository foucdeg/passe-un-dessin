import React from 'react';
import { PadStep } from 'redux/Game/types';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/types';
import { getPreviousNextSteps } from 'services/game.service';
import { Link } from 'react-router-dom';

interface Props {
  padStep: PadStep;
}

const DrawingToWordStep: React.FC<Props> = ({ padStep }) => {
  const game = useSelector((state: RootState) => state.game.game);
  if (!game) return null;

  const [previousStep, nextStep] = getPreviousNextSteps(game, padStep);

  return (
    <>
      <p>This is a DrawingToWord step. {padStep.round_number}</p>
      {previousStep && <Link to={`/game/${game.uuid}/step/${previousStep.uuid}`}>Précédente</Link>}
      {nextStep && <Link to={`/game/${game.uuid}/step/${nextStep.uuid}`}>Suivante</Link>}
      {!nextStep && <Link to={`/game/${game.uuid}/recap`}>Récap</Link>}
    </>
  );
};

export default DrawingToWordStep;
