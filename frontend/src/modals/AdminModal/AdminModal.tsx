import React, { useEffect } from 'react';
import PlayerChip from 'atoms/PlayerChip';
import Button from 'atoms/Button';
import DrawOwnWordSwitch from 'pages/RoomLobby/components/DrawOwnWordSwitch';
import Modal from 'components/Modal';
import RoundDurationPicker from 'pages/RoomLobby/components/RoundDurationPicker';
import SecondaryButton from 'atoms/SecondaryButton';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  useDrawOwnWordSwitch,
  useRoundDuration,
  useStartGame,
  useControlledRevealSwitch,
} from 'redux/Game/hooks';
import { selectGame } from 'redux/Game/selectors';
import { Player } from 'redux/Player/types';
import { useRemovePlayer } from 'redux/Room/hooks';
import { selectRoom } from 'redux/Room/selectors';
import { useSelector } from 'redux/useSelector';
import HorizontalSeparator from 'atoms/HorizontalSeparator';
import { enumerate } from 'services/utils';
import ControlledRevealSwitch from 'pages/RoomLobby/components/ControlledRevealSwitch';
import {
  ButtonRow,
  StyledCrossIcon,
  StyledHeader,
  StyledPlayerChips,
  Subtitle,
  Separator,
} from './AdminModal.style';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const AdminModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const room = useSelector(selectRoom);
  const game = useSelector(selectGame);
  const [roundDuration, setRoundDuration] = useRoundDuration(game?.round_duration);
  const [drawOwnWord, setDrawOwnWord] = useDrawOwnWordSwitch(game?.draw_own_word);
  const [controlledReveal, setControlledReveal] = useControlledRevealSwitch(
    game?.controlled_reveal,
  );

  const intl = useIntl();

  const doStartGame = useStartGame();

  const doRemovePlayer = useRemovePlayer();

  useEffect(() => {
    if (game) {
      setRoundDuration(game.round_duration);
    }
  }, [game, setRoundDuration]);

  if (!room) return null;

  const playersInGame = game?.players || [];

  const playersWaiting = room.players.filter(
    (player) => !game || !game.players.find((gamePlayer) => gamePlayer.uuid === player.uuid),
  );

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
      controlledReveal,
      game.players.map((player) => player.uuid),
    );
    onClose();
  };

  const startReverseGame = () => {
    if (!game) return;

    doStartGame(
      room.uuid,
      roundDuration,
      drawOwnWord,
      controlledReveal,
      game.players.map((player) => player.uuid).reverse(),
    );
    onClose();
  };

  const startRandomGame = () => {
    doStartGame(room.uuid, roundDuration, drawOwnWord, controlledReveal);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <StyledHeader>
        <FormattedMessage id="adminModal.removePlayer" />
      </StyledHeader>
      <Subtitle>
        <FormattedMessage id="adminModal.removePlayerInstruction" />
      </Subtitle>
      {!!playersInGame.length && (
        <>
          <HorizontalSeparator>
            <FormattedMessage id="adminModal.inCurrentGame" />
          </HorizontalSeparator>
          <StyledPlayerChips>
            {playersInGame.map((player) => (
              <PlayerChip key={player.uuid} color={player.color}>
                {player.name} <StyledCrossIcon alt="Remove" onClick={() => onPlayerClick(player)} />
              </PlayerChip>
            ))}
          </StyledPlayerChips>
          <HorizontalSeparator>
            <FormattedMessage id="adminModal.inLobby" />
          </HorizontalSeparator>
        </>
      )}
      <StyledPlayerChips>
        {playersWaiting.map((player) => (
          <PlayerChip key={player.uuid} color={player.color}>
            {player.name} <StyledCrossIcon alt="Remove" onClick={() => onPlayerClick(player)} />
          </PlayerChip>
        ))}
        {!playersWaiting.length && (
          <p>
            <FormattedMessage id="adminModal.nobodyWaiting" />
          </p>
        )}
      </StyledPlayerChips>

      {game && (
        <>
          <Separator />
          <StyledHeader>
            <FormattedMessage id="adminModal.restartGame" />
          </StyledHeader>
          <Subtitle>
            {playersWaiting.length ? (
              <FormattedMessage
                id="adminModal.restartGameInstructions"
                values={{
                  names: enumerate(
                    playersWaiting.map((player) => player.name),
                    intl.formatMessage({ id: 'common.and' }),
                  ),
                }}
              />
            ) : (
              <FormattedMessage id="adminModal.samePlayers" />
            )}
          </Subtitle>

          <RoundDurationPicker duration={roundDuration} onDurationChange={setRoundDuration} />
          <DrawOwnWordSwitch
            playerCount={room.players.length}
            drawOwnWord={drawOwnWord}
            setDrawOwnWord={setDrawOwnWord}
          />
          <ControlledRevealSwitch
            controlledReveal={controlledReveal}
            setControlledReveal={setControlledReveal}
          />
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
        </>
      )}
    </Modal>
  );
};

export default AdminModal;
