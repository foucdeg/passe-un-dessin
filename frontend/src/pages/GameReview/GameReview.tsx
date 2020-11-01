import HomeButton from 'atoms/HomeButton';
import Loader from 'atoms/Loader';
import GameContainer from 'layout/GameLayout/GameContainer';
import InnerGameContainer from 'layout/GameLayout/InnerGameContainer';
import GameRecap from 'pages/GameRecap';
import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { useFetchGame } from 'redux/Game/hooks';

interface RouteParams {
  gameId: string;
}

const Game: React.FunctionComponent = () => {
  const { gameId } = useParams<RouteParams>();
  const [{ loading }, doFetchGame] = useFetchGame();

  useEffect(() => {
    if (!gameId) return;
    doFetchGame({ gameId, asPublic: true });
  }, [doFetchGame, gameId]);

  if (loading) {
    return (
      <GameContainer>
        <InnerGameContainer>
          <Loader />
        </InnerGameContainer>
      </GameContainer>
    );
  }

  return (
    <GameContainer>
      <HomeButton />
      <InnerGameContainer hasTabs>
        <GameRecap publicMode />
      </InnerGameContainer>
    </GameContainer>
  );
};

export default Game;
