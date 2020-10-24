import React from 'react';
import Modal from 'components/Modal';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'redux/useSelector';
import { selectAdmin, selectPlayerIsAdmin } from 'redux/Room/selectors';
import { Player } from 'redux/Player/types';
import { StyledHeader, StyledParagraph } from './LostPlayerModal.style';

interface Props {
  playerWhoLeft: Player;
  adminChanged: boolean;
}

const LostPlayerModal: React.FC<Props> = ({ playerWhoLeft, adminChanged }) => {
  const admin = useSelector(selectAdmin);
  const isAdmin = useSelector(selectPlayerIsAdmin);

  return (
    <Modal isOpen>
      <StyledHeader>
        <FormattedMessage id="lostPlayerModal.title" />
      </StyledHeader>
      <StyledParagraph>
        <FormattedMessage id="lostPlayerModal.whoLeft" values={{ name: playerWhoLeft.name }} />
      </StyledParagraph>
      {adminChanged ? (
        isAdmin ? (
          <>
            <StyledHeader>
              <FormattedMessage id="lostPlayerModal.newAdminMe" />
            </StyledHeader>
            <StyledParagraph>
              <FormattedMessage id="lostPlayerModal.newAdminGoToSettings" />
            </StyledParagraph>
          </>
        ) : (
          <>
            <StyledHeader>
              <FormattedMessage id="lostPlayerModal.newAdminNotMe" values={{ name: admin?.name }} />
            </StyledHeader>
            <StyledParagraph>
              <FormattedMessage
                id="lostPlayerModal.newAdminRestarts"
                values={{ name: admin?.name }}
              />
            </StyledParagraph>
          </>
        )
      ) : isAdmin ? (
        <StyledParagraph>
          <FormattedMessage id="lostPlayerModal.goToSettings" />
        </StyledParagraph>
      ) : (
        <StyledParagraph>
          <FormattedMessage id="lostPlayerModal.adminRestarts" values={{ name: admin?.name }} />
        </StyledParagraph>
      )}
    </Modal>
  );
};

export default LostPlayerModal;
