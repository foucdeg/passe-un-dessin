import styled from 'styled-components';
import { colorPalette, fontSize } from 'stylesheet';
import TextInput from 'atoms/TextInput';
import Header2 from 'atoms/Header2';

import crossIcon from 'assets/big-cross.svg';
import linkIcon from 'assets/link.svg';
import Header4 from 'atoms/Header4';

export const Info = styled.span`
  color: ${colorPalette.textGrey};
`;

export const StyledField = styled(TextInput)`
  margin-bottom: 16px;
`;

export const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

export const HelpText = styled.span`
  font-style: italic;
  margin-right: 16px;
`;

export const StyledHeader = styled(Header2)`
  color: ${colorPalette.purple};
  text-align: center;
  margin-bottom: 6px;
`;

export const CopyLinkAdornment = styled.img.attrs({ src: linkIcon })`
  cursor: pointer;
`;

export const CloseButton = styled.img.attrs({ src: crossIcon })`
  cursor: pointer;
  position: absolute;
  right: 24px;
  top: 24px;
`;

export const StyledRoomName = styled(Header4)`
  color: ${colorPalette.textGrey};
  text-align: center;
  margin-bottom: 18px;
`;

export const PlayerName = styled.div`
  font-size: ${fontSize.medium};
  text-align: center;
`;

export const PlayerList = styled.div`
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
`;

export const AvatarWithName = styled.div`
  margin: 0 16px 5px 0;
`;
