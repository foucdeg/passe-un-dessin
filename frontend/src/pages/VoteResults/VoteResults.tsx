import React, { useState, useEffect } from 'react';
import { useSelector } from 'redux/useSelector';
import { useHistory } from 'react-router';
import { useLeaveRoom } from 'redux/Room/hooks';
import { useGetVoteResults } from 'redux/Game/hooks';
import { selectRoom, selectPlayerIsAdmin, selectRanking } from 'redux/Room/selectors';
import { selectGame, selectWinners } from 'redux/Game/selectors';
import NewGameModal from 'components/NewGameModal';
import Podium from 'components/Podium';
import { FormattedMessage } from 'react-intl';
import TopRightButtons from 'atoms/TopRightButtons';
import TopRightButton from 'atoms/TopRightButton';
import { Container } from './VoteResults.style';
import Scoreboard from 'components/Scoreboard';

const VoteResults: React.FunctionComponent = () => {
  const room = useSelector(selectRoom);
  const game = useSelector(selectGame);
  const isPlayerAdmin = useSelector(selectPlayerIsAdmin);
  const winners = useSelector(selectWinners);
  const history = useHistory();
  const ranking = useSelector(selectRanking);

  const [newGameModalIsOpen, setNewGameModalIsOpen] = useState<boolean>(false);

  const doLeaveRoom = useLeaveRoom();
  const doGetVoteResults = useGetVoteResults();

  useEffect(() => {
    if (game && room) {
      doGetVoteResults(game.uuid, room.uuid);
    }
  }, [doGetVoteResults, game, room]);

  if (!room || !game) return null;

  const leaveGame = () => {
    doLeaveRoom(room);
    history.push('/');
  };

  return (
    <Container>
      {winners && (winners.length ? <Podium winners={winners} /> : <div>No votes</div>)}
      {ranking && winners && <Scoreboard ranking={ranking} winners={winners} />}
      <TopRightButtons>
        <TopRightButton onClick={leaveGame}>
          <FormattedMessage id="voteResults.leaveTeam" />
        </TopRightButton>
        {isPlayerAdmin && (
          <TopRightButton onClick={() => setNewGameModalIsOpen(true)}>
            <FormattedMessage id="voteResults.newGame" />
          </TopRightButton>
        )}
      </TopRightButtons>
      <NewGameModal isOpen={newGameModalIsOpen} onClose={() => setNewGameModalIsOpen(false)} />
    </Container>
  );
};

export default VoteResults;
