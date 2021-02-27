import styled, { css } from 'styled-components';

import { colorPalette } from 'stylesheet';

const InnerGameContainer = styled.div<{ hasTabs?: boolean }>`
  width: 100%;
  height: 640px;
  background: ${colorPalette.white};
  border-radius: 16px;
  padding: 16px;
  position: relative;
  ${(props) =>
    props.hasTabs &&
    css`
      border-radius: 0 16px 16px 16px;
    `}
`;

export default InnerGameContainer;
