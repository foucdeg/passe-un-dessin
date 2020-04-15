import React from 'react';
import { useSelector } from 'redux/useSelector';
import { selectRoom } from 'redux/Room/selectors';
import Modal from 'components/Modal';
import { useStartGame } from 'redux/Game/hooks';
import SecondaryButton from 'components/SecondaryButton';
import { StyledHeader, ButtonRow } from './NewGameModal.style';
import Button from 'components/Button';
import { FormattedMessage } from 'react-intl';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const NewGameModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const room = useSelector(selectRoom);

  const doStartGame = useStartGame();

  if (!room) return null;

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
        <FormattedMessage id="newGameModal.title" />
      </StyledHeader>
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
