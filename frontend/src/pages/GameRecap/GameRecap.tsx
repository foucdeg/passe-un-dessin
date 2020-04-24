import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'redux/useSelector';
import PadRecap from 'components/PadRecap';
import {
  OuterRecapContainer,
  GameRecapContainer,
  InnerDoneModal,
  PadTabsRow,
  PadTab,
  StyledHeader,
} from './GameRecap.style';
import Modal from 'components/Modal';
import Button from 'components/Button';
import { useGoToVoteResults } from 'redux/Game/hooks';
import { selectRoom, selectPlayerIsAdmin } from 'redux/Room/selectors';
import { selectGame } from 'redux/Game/selectors';
import { selectRecapDisplayedTabId } from 'redux/GameRecap/selectors';
import { setDisplayedPadId } from 'redux/GameRecap/slice';
import { FormattedMessage } from 'react-intl';
import TopRightButtons from 'atoms/TopRightButtons';
import TopRightButton from 'atoms/TopRightButton';

const GameRecap: React.FunctionComponent = () => {
  const dispatch = useDispatch();

  const room = useSelector(selectRoom);
  const game = useSelector(selectGame);
  const isPlayerAdmin = useSelector(selectPlayerIsAdmin);
  const displayedPadId = useSelector(selectRecapDisplayedTabId);

  const [doneModalIsOpen, setDoneModalIsOpen] = useState<boolean>(true);

  const doGoToVoteResults = useGoToVoteResults();

  const displayedPad = game?.pads.find(pad => pad.uuid === displayedPadId);

  useEffect(() => {
    if (!game || displayedPad) return;
    dispatch(setDisplayedPadId(game.pads[0].uuid));
  }, [dispatch, game, displayedPad]);

  if (!room || !game) return null;

  const goToVoteResults = () => {
    doGoToVoteResults(room.uuid, game.uuid);
  };

  return (
    <>
      <OuterRecapContainer>
        <PadTabsRow>
          {game.pads.map(pad => (
            <PadTab
              key={pad.uuid}
              isActive={displayedPadId === pad.uuid}
              onClick={() => dispatch(setDisplayedPadId(pad.uuid))}
            >
              {pad.initial_player.name}
            </PadTab>
          ))}
        </PadTabsRow>
        <GameRecapContainer>{displayedPad && <PadRecap pad={displayedPad} />}</GameRecapContainer>
      </OuterRecapContainer>
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
            <FormattedMessage id="recap.goToVoteResults" />
          </TopRightButton>
        </TopRightButtons>
      )}
    </>
  );
};

export default GameRecap;
