import React, { useState, useEffect } from 'react';
import { useSelector } from 'redux/useSelector';
import PadRecap from 'components/PadRecap';
import {
  OuterRecapContainer,
  GameRecapContainer,
  InnerDoneModal,
  PadTabsRow,
  TopRightButton,
  StyledHeader,
  TopRightButtons,
} from './GameRecap.style';
import { Pad } from 'redux/Game/types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import { useGoToVoteResults } from 'redux/Game/hooks';
import { selectRoom, selectPlayerIsAdmin } from 'redux/Room/selectors';
import { selectGame } from 'redux/Game/selectors';
import { FormattedMessage } from 'react-intl';
import { useReviewPad } from 'redux/Game/hooks';
import PadTab from 'components/PadTab';

const GameRecap: React.FunctionComponent = () => {
  const room = useSelector(selectRoom);
  const game = useSelector(selectGame);
  const isPlayerAdmin = useSelector(selectPlayerIsAdmin);

  const [displayedPad, setDisplayedPad] = useState<Pad | null>(null);
  const [doneModalIsOpen, setDoneModalIsOpen] = useState<boolean>(true);

  const doReviewPad = useReviewPad();
  const doGoToVoteResults = useGoToVoteResults();

  useEffect(() => {
    if (!game) return;
    setDisplayedPad(game.pads[0]);
  }, [setDisplayedPad, game]);

  if (!room || !game) return null;

  const goToVoteResults = () => {
    doGoToVoteResults(room.uuid, game.uuid);
  };

  const selectPad = (pad: Pad) => {
    doReviewPad(pad);
    setDisplayedPad(pad);
  };

  return (
    <>
      <OuterRecapContainer>
        <PadTabsRow>
          {game.pads.map(pad => (
            <PadTab
              key={pad.uuid}
              isActive={displayedPad === pad}
              onClick={() => selectPad(pad)}
              pad={pad}
            />
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
