import HomeButton from 'atoms/HomeButton';
import Loader from 'atoms/Loader';
import GameContainer from 'layout/GameLayout/GameContainer';
import InnerGameContainer from 'layout/GameLayout/InnerGameContainer';
import GameRecap from 'pages/GameRecap';
import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { useFetchGame } from 'redux/Game/hooks';
import { NoProps } from 'services/utils';

interface RouteParams {
  gameId: string;
}

const InnerGameReview: React.FC<RouteParams> = ({ gameId }) => {
  const [{ loading, value: game }, doFetchGame] = useFetchGame();

  useEffect(() => {
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

const GameReview: React.FC<NoProps> = () => {
  const { gameId } = useParams<keyof RouteParams>() as RouteParams;

  return <InnerGameReview key={gameId} gameId={gameId} />;
};

export default GameReview;
