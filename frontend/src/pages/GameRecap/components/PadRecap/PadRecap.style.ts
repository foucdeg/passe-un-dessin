import styled from 'styled-components';

import fatArrow from 'assets/fat-arrow.svg';

export const PadRecapRow = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

PadRecapRow.displayName = 'PadRecapRow';

export const ArrowSpacer = styled.img.attrs({ src: fatArrow })`
  height: 240px;
  margin-top: 20px;
  width: 28px;
`;

ArrowSpacer.displayName = 'ArrowSpacer';
