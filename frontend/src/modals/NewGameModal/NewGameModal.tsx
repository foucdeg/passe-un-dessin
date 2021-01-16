import React from 'react';
import Button from 'atoms/Button';
import DrawOwnWordSwitch from 'pages/RoomLobby/components/DrawOwnWordSwitch';
import Modal from 'components/Modal';
import RoundDurationPicker from 'pages/RoomLobby/components/RoundDurationPicker';
import SecondaryButton from 'atoms/SecondaryButton';
import { FormattedMessage } from 'react-intl';
import {
  useControlledRevealSwitch,
  useDrawOwnWordSwitch,
  useRoundDuration,
  useStartGame,
} from 'redux/Game/hooks';
import { selectGame } from 'redux/Game/selectors';
import { selectRoom } from 'redux/Room/selectors';
import { useSelector } from 'redux/useSelector';
import ControlledRevealSwitch from 'pages/RoomLobby/components/ControlledRevealSwitch';
import { ButtonRow, StyledHeader } from './NewGameModal.style';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const NewGameModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const room = useSelector(selectRoom);
  const game = useSelector(selectGame);
  const [roundDuration, setRoundDuration] = useRoundDuration(game?.round_duration);
  const [drawOwnWord, setDrawOwnWord] = useDrawOwnWordSwitch(game?.draw_own_word);
  const [controlledReveal, setControlledReveal] = useControlledRevealSwitch(
    game?.controlled_reveal,
  );

  const doStartGame = useStartGame();

  if (!room || !game) return null;

  const startSameGame = () => {
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
        <FormattedMessage id="newGameModal.title" />
      </StyledHeader>
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
          <FormattedMessage id="newGameModal.randomOrder" />
        </SecondaryButton>
        <SecondaryButton onClick={startSameGame}>
          <FormattedMessage id="newGameModal.sameOrder" />
        </SecondaryButton>
      </ButtonRow>
      <ButtonRow>
        <Button onClick={startReverseGame}>
          <FormattedMessage id="newGameModal.reverseOrder" />
        </Button>
      </ButtonRow>
    </Modal>
  );
};

export default NewGameModal;
