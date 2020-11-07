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

export const StyledTooltip = styled.span<{ isRight: boolean | undefined }>`
  visibility: hidden;
  position: absolute;
  ${({ isRight }) => (isRight ? 'left: 160%' : 'right: 150%')};
  top: 0;
  text-align: right;
  width: max-content;
  color: ${colorPalette.white};
  z-index: 29;
  background: ${colorPalette.blackTransparent};
  padding: 4px 12px;
  border-radius: 12px;

  ${IconContainer}:hover & {
    visibility: visible;
  }
`;

StyledTooltip.displayName = 'StyledTooltip';
