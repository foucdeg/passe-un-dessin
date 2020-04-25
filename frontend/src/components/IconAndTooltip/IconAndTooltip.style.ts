import styled from 'styled-components';
import { colorPalette } from 'stylesheet';

export const IconContainer = styled.span`
  position: relative;
`;

IconContainer.displayName = 'IconContainer';

export const StyledIcon = styled.img`
  cursor: pointer;
`;

StyledIcon.displayName = 'StyledIcon';

export const StyledTooltip = styled.span`
  visibility: hidden;
  position: absolute;
  right: 150%;
  top: 0px;
  text-align: right;
  width: max-content;
  color: white;
  z-index: 30;
  background: ${colorPalette.blackTransparent};
  padding: 4px 12px;
  border-radius: 12px;

  ${IconContainer}:hover & {
    visibility: visible;
  }
`;

StyledTooltip.displayName = 'StyledTooltip';
