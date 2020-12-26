import styled, { css } from 'styled-components';
import { colorPalette } from 'stylesheet';
import { ReactComponent as EyeIcon } from 'assets/eye.svg';

export const PadTabContainer = styled.div<{ isActive: boolean }>`
  position: relative;
  height: 40px;
  padding: 12px 24px;
  font-weight: bold;
  line-height: 19px;
  background: ${colorPalette.backgroundGrey};
  border-radius: 8px 8px 0 0;
  cursor: pointer;
  box-shadow: inset 7px -4px 8px -7px rgba(0, 0, 0, 0.15);
  margin-top: -6px;
  ${(props) =>
    props.isActive &&
    css`
      cursor: default;
      background: ${colorPalette.white};
      color: ${colorPalette.purple};
      box-shadow: none;
    `}
`;

export const ViewersContainer = styled.div`
  position: absolute;
  bottom: 40px;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap-reverse;
  cursor: default;
`;

ViewersContainer.displayName = ViewersContainer;

export const ViewerEye = styled(EyeIcon)<{ color: string }>`
  margin-right: 4px;
  &:last-child {
    margin-right: 0;
  }
  .eye {
    fill: ${(props) => props.color};
  }
`;
