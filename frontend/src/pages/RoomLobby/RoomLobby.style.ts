import styled from 'styled-components';
import { colorPalette } from 'stylesheet';
import TextInput from 'components/TextInput';
import Header2 from 'atoms/Header2';

import crossIcon from 'assets/big-cross.svg';
import linkIcon from 'assets/link.svg';

export const Info = styled.span`
  color: ${colorPalette.textGrey};
`;

Info.displayName = 'Info';

export const StyledField = styled(TextInput)`
  margin-bottom: 16px;
`;

StyledField.displayName = 'StyledField';

export const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

ButtonRow.displayName = 'ButtonRow';

export const HelpText = styled.span`
  font-style: italic;
  margin-right: 16px;
`;

HelpText.displayName = 'HelpText';

export const StyledHeader = styled(Header2)`
  text-align: center;
  margin-bottom: 18px;
`;

export const CopyLinkAdornment = styled.img.attrs({ src: linkIcon })`
  cursor: pointer;
`;

CopyLinkAdornment.displayName = 'CopyLinkAdornment';

export const CloseButton = styled.img.attrs({ src: crossIcon })`
  cursor: pointer;
  position: absolute;
  right: 24px;
  top: 24px;
`;

CloseButton.displayName = 'CloseButton';
