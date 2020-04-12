import React, { useState, useEffect } from 'react';
import { RootState } from 'redux/types';
import { useSelector } from 'redux/useSelector';
import PadRecap from 'components/PadRecap';
import {
  OuterRecapContainer,
  GameRecapContainer,
  InnerDoneModal,
  PadTabsRow,
  PadTab,
  TopRightButton,
  ButtonRow,
  StyledHeader,
  TopRightButtons,
} from './GameRecap.style';
import { Pad } from 'redux/Game/types';
import Modal from 'components/Modal';
import { useStartGame } from 'redux/Game/hooks';
import { useHistory } from 'react-router';
import Button from 'components/Button';
import SecondaryButton from 'components/SecondaryButton';
import { HelpParagraph } from '../Home/Home.style';
import { useLeaveRoom } from 'redux/Room/hooks';
import { selectRoom } from 'redux/Room/selectors';
import { selectGame } from 'redux/Game/selectors';

const GameRecap: React.FunctionComponent = () => {
  const room = useSelector(selectRoom);
  const game = useSelector(selectGame);
  const isPlayerAdmin = useSelector(
    (state: RootState) =>
      state.player.player &&
      state.room.room &&
      state.player.player.uuid === state.room.room.admin.uuid,
  );
  const history = useHistory();

  const [displayedPad, setDisplayedPad] = useState<Pad | null>(null);
  const [newGameModalIsOpen, setNewGameModalIsOpen] = useState<boolean>(false);
  const [doneModalIsOpen, setDoneModalIsOpen] = useState<boolean>(true);

  const doStartGame = useStartGame();
  const doLeaveRoom = useLeaveRoom();

  useEffect(() => {
    if (!game) return;
    setDisplayedPad(game.pads[0]);
  }, [setDisplayedPad, game]);

  if (!room || !game) return null;

  const leaveGame = () => {
    doLeaveRoom(room);
    history.push('/');
  };

  const startSameGame = () => {
    doStartGame(
      room.uuid,
      history,
      room.players.map(player => player.uuid),
    );
  };

  const startReverseGame = () => {
    doStartGame(room.uuid, history, room.players.map(player => player.uuid).reverse());
  };

  const startRandomGame = () => {
    doStartGame(room.uuid, history);
  };

  return (
    <>
      <OuterRecapContainer>
        <PadTabsRow>
          {game.pads.map(pad => (
            <PadTab
              key={pad.uuid}
              isActive={displayedPad === pad}
              onClick={() => setDisplayedPad(pad)}
            >
              {pad.initial_player.name}
            </PadTab>
          ))}
        </PadTabsRow>
        <GameRecapContainer>{displayedPad && <PadRecap pad={displayedPad} />}</GameRecapContainer>
      </OuterRecapContainer>
      <Modal isOpen={doneModalIsOpen} onClose={() => setDoneModalIsOpen(false)}>
        <InnerDoneModal>
          <StyledHeader>C'est fini !</StyledHeader>
          <HelpParagraph>
            Vous pouvez désormais voir l'ensemble des carnets pour comprendre tous les dessins que
            vous avez eus à deviner.
          </HelpParagraph>
          <HelpParagraph>Naviguez d'un carnet à l'autre avec les onglets en haut.</HelpParagraph>
          <Button onClick={() => setDoneModalIsOpen(false)}>Voir les résultats</Button>
        </InnerDoneModal>
      </Modal>
      <TopRightButtons>
        <TopRightButton onClick={leaveGame}>Quitter l'équipe</TopRightButton>
        {isPlayerAdmin && (
          <TopRightButton onClick={() => setNewGameModalIsOpen(true)}>
            Nouvelle partie ?
          </TopRightButton>
        )}
      </TopRightButtons>
      {isPlayerAdmin && (
        <>
          <Modal isOpen={newGameModalIsOpen} onClose={() => setNewGameModalIsOpen(false)}>
            <StyledHeader>On prend les mêmes et on recommence ?</StyledHeader>
            <ButtonRow>
              <SecondaryButton onClick={startRandomGame}>Ordre aléatoire</SecondaryButton>
              <SecondaryButton onClick={startSameGame}>Même ordre</SecondaryButton>
            </ButtonRow>
            <ButtonRow>
              <Button onClick={startReverseGame}>Ordre inverse</Button>
            </ButtonRow>
          </Modal>
        </>
      )}
    </>
  );
};

export default GameRecap;
