import React, { useEffect } from 'react';
import { useSelector } from 'redux/useSelector';
import { selectRoom } from 'redux/Room/selectors';
import PlayerChip from 'atoms/PlayerChip';

import { Player } from 'redux/Player/types';
import Modal from 'components/Modal';
import { useRemovePlayer } from 'redux/Room/hooks';
import { useStartGame, useRoundDuration } from 'redux/Game/hooks';
import SecondaryButton from 'components/SecondaryButton';
import { StyledHeader, ButtonRow, StyledPlayerChips, StyledCrossIcon } from './AdminModal.style';
import Button from 'components/Button';
import { FormattedMessage } from 'react-intl';
import { selectGame } from 'redux/Game/selectors';
import RoundDurationPicker from 'components/RoundDurationPicker';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const AdminModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const room = useSelector(selectRoom);
  const game = useSelector(selectGame);
  const [roundDuration, setRoundDuration] = useRoundDuration(game?.round_duration);

  const doStartGame = useStartGame();

  const doRemovePlayer = useRemovePlayer();

  useEffect(() => {
    if (game) {
      setRoundDuration(game.round_duration);
    }
  }, [game, setRoundDuration]);

  if (!room) return null;

  const onPlayerClick = (player: Player) => {
    doRemovePlayer(room, player);
    onClose();
  };

  const startSameGame = () => {
    doStartGame(
      room.uuid,
      roundDuration,
      room.players.map(player => player.uuid),
    );
    onClose();
  };

  const startReverseGame = () => {
    doStartGame(room.uuid, roundDuration, room.players.map(player => player.uuid).reverse());
    onClose();
  };

  const startRandomGame = () => {
    doStartGame(room.uuid, roundDuration);
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
            {player.name} <StyledCrossIcon alt="Remove" onClick={() => onPlayerClick(player)} />
          </PlayerChip>
        ))}
      </StyledPlayerChips>

      <hr />

      <StyledHeader>
        <FormattedMessage id="adminModal.title" />
      </StyledHeader>
      <RoundDurationPicker duration={roundDuration} onDurationChange={setRoundDuration} />
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
