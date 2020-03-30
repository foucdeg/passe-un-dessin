import React from 'react';
import { RootState } from 'redux/types';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';

const PadInit: React.FunctionComponent = () => {
  const { padId } = useParams();
  const game = useSelector((state: RootState) => state.game.game);

  if (!game) return null;
  const pad = game.pads.find(pad => pad.uuid === padId);
  if (!pad) return null;

  const firstStep = pad.steps[0];

  return (
    <>
      <p>Bienvenue sur le pad {pad.uuid} !</p>
      <p>Etape d'initialisation.</p>
      <Link to={`/game/${game.uuid}/step/${firstStep.uuid}`}>C'est parti</Link>
    </>
  );
};

export default PadInit;
