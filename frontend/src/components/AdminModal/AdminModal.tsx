import React from 'react';
import { useSelector } from 'redux/useSelector';
import { selectRoom } from 'redux/Room/selectors';
import PlayerChip from 'atoms/PlayerChip';

import crossIcon from 'assets/cross.svg';
import { Player } from 'redux/Player/types';
import Modal from 'components/Modal';
import { useRemovePlayer } from 'redux/Room/hooks';
import { useStartGame } from 'redux/Game/hooks';
import SecondaryButton from 'components/SecondaryButton';
import { StyledHeader, ButtonRow, StyledPlayerChips, StyledCrossIcon } from './AdminModal.style';
import Button from 'components/Button';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const AdminModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const room = useSelector(selectRoom);

  const doStartGame = useStartGame();

  const doRemovePlayer = useRemovePlayer();

  if (!room) return null;

  const onPlayerClick = (player: Player) => {
    doRemovePlayer(room, player);
    onClose();
  };

  const startSameGame = () => {
    doStartGame(
      room.uuid,
      room.players.map(player => player.uuid),
    );
    onClose();
  };

  const startReverseGame = () => {
    doStartGame(room.uuid, room.players.map(player => player.uuid).reverse());
    onClose();
  };

  const startRandomGame = () => {
    doStartGame(room.uuid);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <StyledHeader>Supprimer un joueur</StyledHeader>
      <p>Clique sur la croix du joueur à supprimer de la partie :</p>

      <StyledPlayerChips>
        {room?.players.map(player => (
          <PlayerChip key={player.uuid} color={player.color}>
            {player.name}{' '}
            <StyledCrossIcon src={crossIcon} alt="Remove" onClick={() => onPlayerClick(player)} />
          </PlayerChip>
        ))}
      </StyledPlayerChips>

      <hr />

      <StyledHeader>Relancer une partie</StyledHeader>
      <ButtonRow>
        <SecondaryButton onClick={startRandomGame}>Ordre aléatoire</SecondaryButton>
        <SecondaryButton onClick={startSameGame}>Même ordre</SecondaryButton>
      </ButtonRow>
      <ButtonRow>
        <Button onClick={startReverseGame}>Ordre inverse</Button>
      </ButtonRow>
    </Modal>
  );
};

export default AdminModal;
