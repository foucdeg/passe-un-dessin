import React from 'react';
import BareAnchor from 'atoms/BareAnchor';
import Modal from 'components/Modal';
import { FormattedMessage } from 'react-intl';

import {
  Header,
  DiscordLinkAdornment,
  StyledParagraph,
  DiscordLogo,
  DiscordRow,
  StyledTextInput,
} from './DiscordModal.style';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const discordLink = 'https://discord.gg/8y9s5yFgYq';

const DiscordModal: React.FC<Props> = ({ isOpen, onClose }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <Header>
      <FormattedMessage id="home.findPlayers" />
    </Header>
    <StyledParagraph>
      <FormattedMessage id="home.discordText" />
    </StyledParagraph>
    <DiscordRow>
      <BareAnchor href={discordLink} target="_blank" onClick={onClose}>
        <DiscordLogo />
      </BareAnchor>
      <StyledTextInput
        readOnly
        value={discordLink}
        adornment={
          <BareAnchor href={discordLink} target="_blank" onClick={onClose}>
            <DiscordLinkAdornment />
          </BareAnchor>
        }
      />
    </DiscordRow>
  </Modal>
);

export default DiscordModal;
