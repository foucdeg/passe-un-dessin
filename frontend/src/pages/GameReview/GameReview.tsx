import HomeButton from 'atoms/HomeButton';
import Loader from 'atoms/Loader';
import GameContainer from 'layout/GameLayout/GameContainer';
import InnerGameContainer from 'layout/GameLayout/InnerGameContainer';
import GameRecap from 'pages/GameRecap';
import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { useFetchGame } from 'redux/Game/hooks';
import { selectGame } from 'redux/Game/selectors';
import { useSelector } from 'redux/useSelector';

interface RouteParams {
  gameId: string;
}

const GameReview: React.FunctionComponent = () => {
  const { gameId } = useParams<keyof RouteParams>() as RouteParams;
  const [{ loading }, doFetchGame] = useFetchGame();
  const game = useSelector(selectGame);

  useEffect(() => {
    if (!gameId) return;
    doFetchGame(gameId, false, true);
  }, [doFetchGame, gameId]);

  if (loading || !game) {
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
        <GameRecap publicMode game={game} />
      </InnerGameContainer>
    </GameContainer>
  );
};

export default GameReview;
