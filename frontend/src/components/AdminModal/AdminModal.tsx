import React, { useEffect } from 'react';
import PlayerChip from 'atoms/PlayerChip';
import Button from 'components/Button';
import DrawOwnWordSwitch from 'components/DrawOwnWordSwitch';
import Modal from 'components/Modal';
import RoundDurationPicker from 'components/RoundDurationPicker';
import SecondaryButton from 'components/SecondaryButton';
import { FormattedMessage } from 'react-intl';
import { useDrawOwnWordSwitch, useRoundDuration, useStartGame } from 'redux/Game/hooks';
import { selectGame } from 'redux/Game/selectors';
import { Player } from 'redux/Player/types';
import { useRemovePlayer } from 'redux/Room/hooks';
import { selectRoom } from 'redux/Room/selectors';
import { useSelector } from 'redux/useSelector';
import { shouldDisplayDrawOwnWordSwitch } from 'services/game.service';
import { ButtonRow, StyledCrossIcon, StyledHeader, StyledPlayerChips } from './AdminModal.style';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const AdminModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const room = useSelector(selectRoom);
  const game = useSelector(selectGame);
  const [roundDuration, setRoundDuration] = useRoundDuration(game?.round_duration);
  const [drawOwnWord, setDrawOwnWord] = useDrawOwnWordSwitch(game?.draw_own_word);

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
    if (!game) return;

    doStartGame(
      room.uuid,
      roundDuration,
      drawOwnWord,
      game.players.map(player => player.uuid),
    );
    onClose();
  };

  const startReverseGame = () => {
    if (!game) return;

    doStartGame(
      room.uuid,
      roundDuration,
      drawOwnWord,
      game.players.map(player => player.uuid).reverse(),
    );
    onClose();
  };

  const startRandomGame = () => {
    doStartGame(room.uuid, roundDuration, drawOwnWord);
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
        {room.players.map(player => (
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
      {shouldDisplayDrawOwnWordSwitch(room.players.length) && (
        <DrawOwnWordSwitch drawOwnWord={drawOwnWord} setDrawOwnWord={setDrawOwnWord} />
      )}
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
