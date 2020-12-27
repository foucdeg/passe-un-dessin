import styled from 'styled-components';
import { colorPalette } from 'stylesheet';
import Header4 from 'atoms/Header4';

export const SeparatorRow = styled.div`
  display: flex;
  align-items: center;
`;

export const Line = styled.div`
  border-top: 1px solid ${colorPalette.textGrey};
  flex-grow: 1;
  height: 1px;
`;

export const SeparatorText = styled(Header4)`
  color: ${colorPalette.textGrey};
  flex-grow: 0;
  margin: 0 16px;
`;
