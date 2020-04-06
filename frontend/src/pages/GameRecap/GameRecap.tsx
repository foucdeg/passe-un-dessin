import React, { useState, useEffect } from 'react';
import { RootState } from 'redux/types';
import { useSelector } from 'react-redux';
import PadRecap from 'components/PadRecap';
import { OuterRecapContainer, GameRecapContainer, TitleRow, ControlsRow } from './GameRecap.style';
import { Pad } from 'redux/Game/types';
import Modal from 'components/Modal';
import { useStartGame } from 'redux/Game/hooks';
import { useHistory } from 'react-router';
import Header2 from 'atoms/Header2';

const GameRecap: React.FunctionComponent = () => {
  const game = useSelector((state: RootState) => state.game.game);
  const player = useSelector((state: RootState) => state.player.player);
  const room = useSelector((state: RootState) => state.room.room);
  const isPlayerAdmin = player && room && player.uuid === room.admin.uuid;
  const history = useHistory();

  const [displayedPad, setDisplayedPad] = useState<Pad | null>(null);
  const [newGameModalIsOpen, setNewGameModalIsOpen] = useState<boolean>(false);

  const [, doStartGame] = useStartGame();

  const goToPreviousPad = () => {
    if (!game || !displayedPad) return;
    const padIndex = game.pads.findIndex(pad => pad.uuid === displayedPad.uuid);

    setDisplayedPad(game.pads[(padIndex + game.pads.length - 1) % game.pads.length]);
  };

  const goToNextPad = () => {
    if (!game || !displayedPad) return;
    const padIndex = game.pads.findIndex(pad => pad.uuid === displayedPad.uuid);

    setDisplayedPad(game.pads[(padIndex + 1) % game.pads.length]);
  };

  useEffect(() => {
    if (!game) return;
    setDisplayedPad(game.pads[0]);
  }, [setDisplayedPad, game]);

  if (!room || !game) return null;

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
    <OuterRecapContainer>
      <TitleRow>
        <Header2>Alors ça donne quoi ?</Header2>
        {isPlayerAdmin && (
          <>
            <button onClick={() => setNewGameModalIsOpen(true)}>Nouvelle partie ?</button>
            <Modal isOpen={newGameModalIsOpen}>
              <h2>On prend les mêmes et on recommence ?</h2>
              <ul>
                <button onClick={startSameGame}>Tel quel</button>
                <button onClick={startReverseGame}>En inversant l'ordre</button>
                <button onClick={startRandomGame}>Ordre aléatoire</button>
              </ul>
            </Modal>
          </>
        )}
      </TitleRow>
      <ControlsRow>
        <button onClick={goToPreviousPad}>Précédent</button>
        <button onClick={goToNextPad}>Suivant</button>
      </ControlsRow>
      <GameRecapContainer>{displayedPad && <PadRecap pad={displayedPad} />}</GameRecapContainer>
    </OuterRecapContainer>
  );
};

export default GameRecap;
