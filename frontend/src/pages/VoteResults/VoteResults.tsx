import React, { useState, useEffect } from 'react';
import { useSelector } from 'redux/useSelector';
import { useHistory } from 'react-router';
import { useLeaveRoom } from 'redux/Room/hooks';
import { useGetVoteResults } from 'redux/Game/hooks';
import { selectRoom, selectPlayerIsAdmin } from 'redux/Room/selectors';
import { selectGame, selectWinners } from 'redux/Game/selectors';
import NewGameModal from 'components/NewGameModal';
import DrawingRecap from 'components/DrawingRecap';
import { FormattedMessage } from 'react-intl';
import TopRightButtons from 'atoms/TopRightButtons';
import TopRightButton from 'atoms/TopRightButton';

const VoteResults: React.FunctionComponent = () => {
  const room = useSelector(selectRoom);
  const game = useSelector(selectGame);
  const isPlayerAdmin = useSelector(selectPlayerIsAdmin);
  const winners = useSelector(selectWinners);
  const history = useHistory();

  const [newGameModalIsOpen, setNewGameModalIsOpen] = useState<boolean>(false);

  const doLeaveRoom = useLeaveRoom();
  const doGetVoteResults = useGetVoteResults();

  useEffect(() => {
    if (game) {
      doGetVoteResults(game.uuid);
    }
  }, [doGetVoteResults, game]);

  if (!room || !game) return null;

  const leaveGame = () => {
    doLeaveRoom(room);
    history.push('/');
  };

  return (
    <>
      {winners &&
        (winners.length ? (
          winners.map((winner, index) => (
            <div key={winner.uuid}>
              <div>{index + 1}</div>
              <DrawingRecap step={winner} />
            </div>
          ))
        ) : (
          <div>No votes</div>
        ))}
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
    </>
  );
};

export default VoteResults;
