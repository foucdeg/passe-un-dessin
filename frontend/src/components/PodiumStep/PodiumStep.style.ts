import styled from 'styled-components';
import { colorPalette, fontSize } from 'stylesheet';

export const Container = styled.div<{
  bottom: number;
  left: number;
  width: number;
  height: number;
}>`
  position: absolute;
  bottom: ${({ bottom }) => bottom}px;
  left: ${({ left }) => left}px;
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;
Container.displayName = 'Container';

export const Sentence = styled.div`
  letter-spacing: 0.1em;
  font-weight: bold;
`;
Sentence.displayName = 'Sentence';

export const PlayerName = styled.div`
  color: ${colorPalette.white};
  letter-spacing: 0.1em;
  font-weight: bold;
`;
PlayerName.displayName = 'PlayerName';

export const VoteCount = styled.div`
  color: ${colorPalette.white};
  font-size: ${fontSize.small};
`;
VoteCount.displayName = 'VoteCount';
