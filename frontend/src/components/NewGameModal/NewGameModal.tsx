import Button from 'components/Button';
import DrawOwnWordSwitch from 'components/DrawOwnWordSwitch';
import Modal from 'components/Modal';
import RoundDurationPicker from 'components/RoundDurationPicker';
import SecondaryButton from 'components/SecondaryButton';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useDrawOwnWordSwitch, useRoundDuration, useStartGame } from 'redux/Game/hooks';
import { selectGame } from 'redux/Game/selectors';
import { selectRoom } from 'redux/Room/selectors';
import { useSelector } from 'redux/useSelector';
import { shouldDisplayDrawOwnWordSwitch } from 'services/game.service';
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

  const doStartGame = useStartGame();

  if (!room || !game) return null;

  const startSameGame = () => {
    doStartGame(
      room.uuid,
      roundDuration,
      drawOwnWord,
      game.players.map(player => player.uuid),
    );
    onClose();
  };

  const startReverseGame = () => {
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
        <FormattedMessage id="newGameModal.title" />
      </StyledHeader>
      <RoundDurationPicker duration={roundDuration} onDurationChange={setRoundDuration} />
      {shouldDisplayDrawOwnWordSwitch(room.players.length) && (
        <DrawOwnWordSwitch drawOwnWord={drawOwnWord} setDrawOwnWord={setDrawOwnWord} />
      )}
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
