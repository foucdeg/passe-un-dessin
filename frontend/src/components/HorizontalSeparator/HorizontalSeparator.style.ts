import styled from 'styled-components';
import { colorPalette } from 'stylesheet';

export const SeparatorRow = styled.div`
  display: flex;
  align-items: center;
`;

SeparatorRow.displayName = 'SeparatorRow';

export const Line = styled.div`
  border-top: 1px solid ${colorPalette.textGrey};
  flex-grow: 1;
  height: 1px;
`;

Line.displayName = 'Line';

export const TextContent = styled.div`
  flex-grow: 0;
  margin: 0 16px;
`;
