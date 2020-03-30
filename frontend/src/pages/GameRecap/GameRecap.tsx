import React from 'react';
import { RootState } from 'redux/types';
import { useSelector } from 'react-redux';

const GameRecap: React.FunctionComponent = () => {
  const game = useSelector((state: RootState) => state.game.game);

  if (!game) return null;

  return <p>C'est le récap !</p>;
};

export default GameRecap;
