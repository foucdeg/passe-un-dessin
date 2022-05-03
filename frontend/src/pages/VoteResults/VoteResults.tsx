import React, { useEffect } from 'react';
import { useSelector } from 'redux/useSelector';
import { useGetVoteResults } from 'redux/Game/hooks';
import { selectPlayerIsAdmin } from 'redux/Room/selectors';
import { selectWinners } from 'redux/Game/selectors';
import NewGameModal from 'modals/NewGameModal';
import { FormattedMessage } from 'react-intl';
import Spacer from 'atoms/Spacer';
import BareLink from 'atoms/BareLink';
import { useBoolean } from 'services/utils';
import Loader from 'atoms/Loader';
import { Room } from 'redux/Room/types';
import { Game } from 'redux/Game/types';
import Podium from './components/Podium';
import {
  Container,
  TopRightButtons,
  TopRightButton,
  LeftSide,
  StyledHeader,
  StyledLaunchIcon,
  RightSide,
  Donate,
} from './VoteResults.style';
import GameRoomScoreboard from './components/GameRoomScoreboard';

interface Props {
  room: Room;
  game: Game;
}

const VoteResults: React.FunctionComponent<Props> = ({ room, game }) => {
  const isPlayerAdmin = useSelector(selectPlayerIsAdmin);
  const winners = useSelector(selectWinners);

  const [modalIsOpen, openModal, closeModal] = useBoolean(false);

  const doGetVoteResults = useGetVoteResults();

  useEffect(() => {
    if (game && room) {
      doGetVoteResults(game.uuid, room.uuid);
    }
  }, [doGetVoteResults, game, room]);

  if (!room || !game) {
    return (
      <Container>
        <Loader />
      </Container>
    );
  }

  return (
    <Container>
      <LeftSide>
        <StyledHeader>
          <FormattedMessage id="voteResults.bestMoments" />
        </StyledHeader>
        <Spacer />
        {winners ? winners.length ? <Podium winners={winners} /> : <div>No votes</div> : <Loader />}
      </LeftSide>
      <RightSide>
        <GameRoomScoreboard />
        <Donate>
          <FormattedMessage
            id="voteResults.donate"
            values={{
              // @ts-expect-error https://github.com/formatjs/formatjs/issues/3550
              a: (...chunks: string[]) => (
                <a href="https://utip.io/passeundessin" target="_blank" rel="noreferrer">
                  {chunks}
                </a>
              ),
            }}
          />
        </Donate>
      </RightSide>
      <TopRightButtons>
        <BareLink to={`/game/${game.uuid}`} target="_blank" rel="noreferrer">
          <TopRightButton>
            <FormattedMessage id="voteResults.reviewGame" />
            <StyledLaunchIcon />
          </TopRightButton>
        </BareLink>
        {isPlayerAdmin && (
          <TopRightButton onClick={openModal} data-test="new-game">
            <FormattedMessage id="voteResults.newGame" />
          </TopRightButton>
        )}
      </TopRightButtons>
      <NewGameModal isOpen={modalIsOpen} onClose={closeModal} />
    </Container>
  );
};

export default VoteResults;
