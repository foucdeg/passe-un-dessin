import styled from 'styled-components';

import SecondaryButton from 'atoms/SecondaryButton';

import { fontSize, fontFamily, colorPalette } from 'stylesheet';
import Header4 from 'atoms/Header4';

export const LeftSideTitle = styled.h1`
  font-family: ${fontFamily.titles};
  font-size: ${fontSize.titles};
  color: ${colorPalette.purple};
  text-transform: uppercase;
  margin-bottom: 16px;
`;

export const Subtitle = styled(Header4)`
  color: ${colorPalette.orange};
  margin-bottom: 42px;
`;

export const Donate = styled.p`
  margin-top: 16px;
  font-size: ${fontSize.small};
`;

export const LegalLinks = styled.p`
  text-align: center;
  margin-top: 8px;
  font-size: ${fontSize.small};
  a {
    color: ${colorPalette.textGrey};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const DiscordLogo = styled.img`
  height: 20px;
  width: auto;
  margin-right: 5px;
`;

export const Actions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  & > :not(:last-child) {
    margin-bottom: 20px;
  }
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;

  & > :not(:last-child) {
    margin-right: 20px;
  }
`;

export const StyledSecondaryButton = styled(SecondaryButton)`
  min-width: 200px;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;
