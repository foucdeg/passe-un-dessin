import React, { useState, useEffect } from 'react';
import { useSelector } from 'redux/useSelector';
import PadRecap from 'components/PadRecap';
import {
  OuterRecapContainer,
  GameRecapContainer,
  InnerDoneModal,
  PadTabsRow,
  StyledHeader,
  VoteReminder,
} from './GameRecap.style';
import { Pad } from 'redux/Game/types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import { useGoToVoteResults } from 'redux/Game/hooks';
import { selectRoom, selectPlayerIsAdmin } from 'redux/Room/selectors';
import { selectGame, selectAllVoteCount } from 'redux/Game/selectors';
import { FormattedMessage } from 'react-intl';
import { useReviewPad } from 'redux/Game/hooks';
import PadTab from 'components/PadTab';
import TopRightButtons from 'atoms/TopRightButtons';
import TopRightButton from 'atoms/TopRightButton';
import { getAvailableVoteCount } from 'services/game.service';
import { selectAvailableVoteCount } from 'redux/Game/selectors';
import NewGameModal from 'components/NewGameModal';

const GameRecap: React.FunctionComponent = () => {
  const room = useSelector(selectRoom);
  const game = useSelector(selectGame);
  const isPlayerAdmin = useSelector(selectPlayerIsAdmin);
  const allVoteCount = useSelector(selectAllVoteCount);
  const availableVoteCount = useSelector(selectAvailableVoteCount);

  const [displayedPadId, setDisplayedPadId] = useState<string | null>(null);
  const [doneModalIsOpen, setDoneModalIsOpen] = useState<boolean>(true);
  const [newGameModalIsOpen, setNewGameModalIsOpen] = useState<boolean>(false);

  const doReviewPad = useReviewPad();
  const doGoToVoteResults = useGoToVoteResults();

  const displayedPad = game?.pads.find(pad => pad.uuid === displayedPadId);

  useEffect(() => {
    if (!game || displayedPad) return;
    setDisplayedPadId(game.pads[0].uuid);
  }, [game, displayedPad]);

  if (!room || !game) return null;

  const maxVoteCount = game.players.length * getAvailableVoteCount(game);

  const goToVoteResults = () => {
    doGoToVoteResults(room.uuid, game.uuid);
  };

  const selectPad = (pad: Pad) => {
    doReviewPad(pad);
    setDisplayedPadId(pad.uuid);
  };

  return (
    <>
      <OuterRecapContainer>
        <PadTabsRow>
          {game.pads.map(pad => (
            <PadTab
              key={pad.uuid}
              isActive={displayedPadId === pad.uuid}
              onClick={() => selectPad(pad)}
              pad={pad}
            />
          ))}
        </PadTabsRow>
        <GameRecapContainer>{displayedPad && <PadRecap pad={displayedPad} />}</GameRecapContainer>
      </OuterRecapContainer>
      <VoteReminder>
        <FormattedMessage id="recap.availableVotes" values={{ availableVoteCount }} />
      </VoteReminder>
      <Modal isOpen={doneModalIsOpen} onClose={() => setDoneModalIsOpen(false)}>
        <InnerDoneModal>
          <StyledHeader>
            <FormattedMessage id="finishedModal.title" />
          </StyledHeader>
          <p>
            <FormattedMessage id="finishedModal.description" />
          </p>
          <p>
            <FormattedMessage id="finishedModal.navigate" />
          </p>
          <Button onClick={() => setDoneModalIsOpen(false)}>
            <FormattedMessage id="finishedModal.seeResults" />
          </Button>
        </InnerDoneModal>
      </Modal>
      {isPlayerAdmin && (
        <TopRightButtons>
          <TopRightButton onClick={goToVoteResults}>
            <FormattedMessage id="recap.goToVoteResults" values={{ allVoteCount, maxVoteCount }} />
          </TopRightButton>
          <TopRightButton onClick={() => setNewGameModalIsOpen(true)}>
            <FormattedMessage id="voteResults.newGame" />
          </TopRightButton>
        </TopRightButtons>
      )}
      <NewGameModal isOpen={newGameModalIsOpen} onClose={() => setNewGameModalIsOpen(false)} />
    </>
  );
};

export default GameRecap;
