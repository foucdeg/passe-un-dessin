import React from 'react';
import { FormattedMessage } from 'react-intl';
import { StyledModal, StyledHeader, StyledParagraph, StyledButton } from './DoneModal.style';

interface Props {
  onClose: () => void;
}

const DoneModal: React.FC<Props> = ({ onClose }) => (
  <StyledModal isOpen onClose={onClose}>
    <StyledHeader>
      <FormattedMessage id="finishedModal.title" />
    </StyledHeader>
    <StyledParagraph>
      <FormattedMessage id="finishedModal.description" />
    </StyledParagraph>
    <StyledParagraph>
      <FormattedMessage id="finishedModal.navigate" />
    </StyledParagraph>
    <StyledButton onClick={onClose}>
      <FormattedMessage id="finishedModal.seeResults" />
    </StyledButton>
  </StyledModal>
);

export default DoneModal;
