import styled from 'styled-components';
import { colorPalette, fontSize } from 'stylesheet';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
`;
Container.displayName = 'Container';

export const Sentence = styled.div`
  letter-spacing: 0.1em;
  font-weight: bold;
`;
Sentence.displayName = 'Sentence';

export const PlayerName = styled.div`
  position: absolute;
  bottom: -46px;
  color: ${colorPalette.white};
  letter-spacing: 0.1em;
  line-height: 19px;
  font-weight: bold;
`;
PlayerName.displayName = 'PlayerName';

export const VoteCount = styled.div`
  color: ${colorPalette.white};
  font-size: ${fontSize.small};
  line-height: 16px;
  position: absolute;
  bottom: -66px;
`;

VoteCount.displayName = 'VoteCount';

export const WinnerSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
  align-items: center;
`;

WinnerSection.displayName = 'WinnerSection';

export const PodiumStepImage = styled.img.attrs({ alt: 'podium' })<{ width: number }>`
  width: ${props => props.width};
`;
PodiumStepImage.displayName = 'PodiumStepImage';
