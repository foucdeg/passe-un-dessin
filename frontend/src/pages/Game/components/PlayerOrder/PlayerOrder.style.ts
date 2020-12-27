import styled from 'styled-components';
import PlayerChip from 'atoms/PlayerChip';
import { colorPalette } from 'stylesheet';
import fatArrow from 'assets/fat-arrow.svg';

export enum Variant {
  PAST = 'PAST',
  CURRENT = 'CURRENT',
  FUTURE = 'FUTURE',
}

const colorVariants = {
  [Variant.PAST]: colorPalette.blue,
  [Variant.CURRENT]: colorPalette.amberLight,
  [Variant.FUTURE]: colorPalette.whiteTransparent,
};

export const PlayerOrderContainer = styled.div`
  width: 100%;
  display: flex;
  overflow-x: auto;
  position: absolute;
  top: -45px;
  left: 0;
`;

export const StyledPlayerChip = styled(PlayerChip)<{ variant: Variant }>`
  color: ${colorPalette.black};
  background-color: ${(props) => colorVariants[props.variant]};
  font-weight: bold;
  margin: 0;
  margin-right: 4px;
`;

export const ArrowSpacer = styled.img.attrs({ src: fatArrow })`
  margin-right: 4px;
`;
