import React from 'react';

import BareAnchor from 'atoms/BareAnchor';
import { NoProps } from 'services/utils';
import IconAndTooltip from 'atoms/IconAndTooltip';
import {
  SocialButtonsContainer,
  DiscordIcon,
  TwitterIcon,
  InstagramIcon,
} from './SocialButtons.style';

const SocialButtons: React.FC<NoProps> = () => (
  <SocialButtonsContainer>
    <IconAndTooltip isRight tooltipText="Discord">
      <BareAnchor target="_blank" href="https://discord.gg/8y9s5yFgYq">
        <DiscordIcon />
      </BareAnchor>
    </IconAndTooltip>
    <IconAndTooltip isRight tooltipText="Twitter">
      <BareAnchor target="_blank" href="https://twitter.com/passeundessin">
        <TwitterIcon />
      </BareAnchor>
    </IconAndTooltip>
    <IconAndTooltip isRight tooltipText="Instagram">
      <BareAnchor target="_blank" href="https://www.instagram.com/passeundessin/">
        <InstagramIcon />
      </BareAnchor>
    </IconAndTooltip>
  </SocialButtonsContainer>
);

export default SocialButtons;
