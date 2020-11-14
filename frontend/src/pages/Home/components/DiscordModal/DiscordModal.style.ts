import styled from 'styled-components';
import Header3 from 'atoms/Header3';
import { colorPalette } from 'stylesheet';
import { ReactComponent as LaunchIcon } from 'assets/launch.svg';
import discordLogo from 'assets/discord.svg';
import TextInput from 'atoms/TextInput';

export const Header = styled(Header3)`
  color: ${colorPalette.orange};
  margin-bottom: 32px;
  align-self: flex-start;
`;

Header.displayName = 'Header';

export const StyledParagraph = styled.p`
  margin-bottom: 32px;
`;

StyledParagraph.displayName = 'StyledParagraph';

export const DiscordRow = styled.div`
  display: flex;
  width: 100%;
`;
DiscordRow.displayName = 'DiscordRow';

export const DiscordLogo = styled.img.attrs({ src: discordLogo })`
  width: 52px;
  height: 52px;
  margin-right: 16px;
`;
DiscordLogo.displayName = 'DiscordLogo';

export const DiscordLinkAdornment = styled(LaunchIcon)`
  cursor: pointer;
  .main {
    fill: ${colorPalette.discord};
  }
`;

DiscordLinkAdornment.displayName = 'DiscordLinkAdornment';

export const StyledTextInput = styled(TextInput)`
  flex-grow: 1;
  border-color: ${colorPalette.discord};
`;
StyledTextInput.displayName = 'StyledTextInput';
