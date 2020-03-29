import * as React from 'react';
import { HomeContainer } from './Home.style';
import { RootState } from 'redux/types';
import { useSelector } from 'react-redux';
import { useCreateRoom } from 'redux/Room/hooks';

const Home: React.FunctionComponent = () => {
  const [, doCreateRoom] = useCreateRoom();
  const player = useSelector((state: RootState) => state.player.player);
  if (!player) return null;

  return (
    <HomeContainer>
      <p>Bienvenue, {player.name} !</p>
      <p>
        Tu peux <strong>créer une room</strong> ou en rejoindre une par le lien qu'on t'a donné.
      </p>
      <button onClick={doCreateRoom}>Créer une room</button>
    </HomeContainer>
  );
};

export default Home;
