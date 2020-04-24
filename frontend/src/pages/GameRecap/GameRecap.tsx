import React, { useState, useEffect } from 'react';
import { useSelector } from 'redux/useSelector';
import PadRecap from 'components/PadRecap';
import {
  OuterRecapContainer,
  GameRecapContainer,
  InnerDoneModal,
  PadTabsRow,
  StyledHeader,
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
import TopRightButtons from 'atoms/TopRightButtons';
import TopRightButton from 'atoms/TopRightButton';

const GameRecap: React.FunctionComponent = () => {
  const room = useSelector(selectRoom);
  const game = useSelector(selectGame);
  const isPlayerAdmin = useSelector(selectPlayerIsAdmin);

  const [displayedPadId, setDisplayedPadId] = useState<string | null>(null);
  const [doneModalIsOpen, setDoneModalIsOpen] = useState<boolean>(true);

  const doReviewPad = useReviewPad();
  const doGoToVoteResults = useGoToVoteResults();

  const displayedPad = game?.pads.find(pad => pad.uuid === displayedPadId);

  useEffect(() => {
    if (!game || displayedPad) return;
    setDisplayedPadId(game.pads[0].uuid);
  }, [game, displayedPad]);

  if (!room || !game) return null;

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
