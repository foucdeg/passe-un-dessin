import styled from 'styled-components';
import { getSpacing } from 'stylesheet';

export const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${getSpacing(10)};
`;
GameContainer.displayName = 'GameContainer';
