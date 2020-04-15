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
import { FormattedMessage } from 'react-intl';

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
      <StyledHeader>
        <FormattedMessage id="adminModal.removePlayer" />
      </StyledHeader>
      <p>
        <FormattedMessage id="adminModal.removePlayerInstruction" />
      </p>

      <StyledPlayerChips>
        {room?.players.map(player => (
          <PlayerChip key={player.uuid} color={player.color}>
            {player.name}{' '}
            <StyledCrossIcon src={crossIcon} alt="Remove" onClick={() => onPlayerClick(player)} />
          </PlayerChip>
        ))}
      </StyledPlayerChips>

      <hr />

      <StyledHeader>
        <FormattedMessage id="adminModal.title" />
      </StyledHeader>
      <ButtonRow>
        <SecondaryButton onClick={startRandomGame}>
          <FormattedMessage id="adminModal.randomOrder" />
        </SecondaryButton>
        <SecondaryButton onClick={startSameGame}>
          <FormattedMessage id="adminModal.sameOrder" />
        </SecondaryButton>
      </ButtonRow>
      <ButtonRow>
        <Button onClick={startReverseGame}>
          <FormattedMessage id="adminModal.reverseOrder" />
        </Button>
      </ButtonRow>
    </Modal>
  );
};

export default AdminModal;
