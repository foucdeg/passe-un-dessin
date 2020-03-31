import styled from 'styled-components';
import { borderRadius, colorUsage, getSpacing, fontSize, fontFamily } from 'stylesheet';

export const RootContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0 ${getSpacing(26)};
  font-size: ${fontSize.large};
  font-family: ${fontFamily.main};
`;
RootContainer.displayName = 'RootContainer';

export const PageContent = styled.main`
  background-color: ${colorUsage.contentBackground};
  border-radius: ${borderRadius.large};
  padding: ${getSpacing(6)};
  flex-grow: 1;
`;
PageContent.displayName = 'PageContent';
