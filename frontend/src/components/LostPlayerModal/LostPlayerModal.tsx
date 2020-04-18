import React from 'react';
import Modal from 'components/Modal';
import { FormattedMessage } from 'react-intl';
import { StyledHeader } from './LostPlayerModal.style';

interface Props {
  playerName: string;
  isAdmin: boolean;
}

const LostPlayerModal: React.FC<Props> = ({ playerName, isAdmin }) => (
  <Modal isOpen>
    <StyledHeader>
      <FormattedMessage id="lostPlayerModal.title" />
    </StyledHeader>
    <p>
      <FormattedMessage id="lostPlayerModal.whoLeft" values={{ name: playerName }} />
    </p>
    <p>
      <FormattedMessage id="lostPlayerModal.startOver" />
    </p>
    {isAdmin ? (
      <p>
        <FormattedMessage id="lostPlayerModal.goToSettings" />
      </p>
    ) : (
      <p>
        <FormattedMessage id="lostPlayerModal.adminRestarts" values={{ name: playerName }} />
      </p>
    )}
  </Modal>
);

export default LostPlayerModal;
