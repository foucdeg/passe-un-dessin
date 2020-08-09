import styled from 'styled-components';
import Header2 from 'atoms/Header2';
import { colorPalette } from 'stylesheet';

export const OuterContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
OuterContainer.displayName = 'OuterContainer';

export const StyledHeader = styled(Header2)`
  color: ${colorPalette.purple};
  text-align: center;
`;
StyledHeader.displayName = 'StyledHeader';

export const Container = styled.div`
  display: flex;
  max-height: calc(100% - 28px);
`;
Container.displayName = 'Container';
