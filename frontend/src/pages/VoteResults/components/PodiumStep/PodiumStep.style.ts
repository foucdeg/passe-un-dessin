import styled, { css } from 'styled-components';
import { colorPalette, fontSize } from 'stylesheet';
import { ReactComponent as FatArrowDown } from 'assets/fat-arrow-down.svg';
import Drawing from 'components/Canvas/Drawing';

export const Container = styled.div<{ width: number }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: ${(props) => props.width}px;
  justify-content: flex-end;
`;

export const StyledDrawing = styled(Drawing)`
  border: 0;
  max-width: 100%;
`;

export const Sentence = styled.div<{ highlighted?: boolean }>`
  letter-spacing: 0.1em;
  font-weight: bold;
  text-align: center;
  line-height: 24px;
  color: ${colorPalette.textGrey};
  ${(props) =>
    props.highlighted &&
    css`
      color: ${colorPalette.orange};
    `};
`;

export const PlayerName = styled.div`
  position: absolute;
  bottom: -46px;
  color: ${colorPalette.white};
  letter-spacing: 0.1em;
  line-height: 19px;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
  padding: 0 16px;
`;

export const VoteCount = styled.div`
  color: ${colorPalette.white};
  font-size: ${fontSize.small};
  line-height: 16px;
  position: absolute;
  bottom: -66px;
`;

export const WinnerSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
  align-items: center;
`;

export const PodiumStepImage = styled.img.attrs({ alt: 'podium' })<{ width: number }>`
  width: ${(props) => props.width}px;
`;

export const ArrowSpacer = styled(FatArrowDown)`
  .main {
    fill: ${colorPalette.textGrey};
  }
`;

export const HighlightedArrowSpacer = styled(ArrowSpacer)`
  .main {
    fill: ${colorPalette.orange};
  }
`;

export const LightBulb = styled.span`
  font-size: ${fontSize.XXLarge};
`;
