import styled from 'styled-components';

export const OuterRecapContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 100%;
  overflow-y: scroll;
  width: 100%;
`;

OuterRecapContainer.displayName = 'OuterRecapContainer';

export const GameRecapContainer = styled.div`
  display: flex;
`;

GameRecapContainer.displayName = 'GameRecapContainer';

export const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

TitleRow.displayName = 'TitleRow';

export const ControlsRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 16px 0;
`;

ControlsRow.displayName = 'ControlsRow';
