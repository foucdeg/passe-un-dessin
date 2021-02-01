import styled from 'styled-components';

import discordLogo from 'assets/discord.svg';
import twitterLogo from 'assets/twitter.svg';
import instagramLogo from 'assets/instagram.svg';

export const SocialButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  left: 24px;
  top: 24px;
  z-index: 35;
  align-items: center;
`;

export const DiscordIcon = styled.img.attrs({ src: discordLogo })`
  width: 24px;
  margin-bottom: 24px;
`;

export const TwitterIcon = styled.img.attrs({ src: twitterLogo })`
  width: 24px;
  margin-bottom: 24px;
`;

export const InstagramIcon = styled.img.attrs({ src: instagramLogo })`
  width: 24px;
  margin-bottom: 24px;
`;
