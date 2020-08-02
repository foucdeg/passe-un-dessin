import styled from 'styled-components';
import Header2 from 'atoms/Header2';
import { colorPalette } from 'stylesheet';
import Modal from 'components/Modal';

export const WideModal = styled(Modal)`
  width: 768px;
  padding: 24px;
`;

WideModal.displayName = 'WideModal';

export const StyledHeader = styled(Header2)`
  color: ${colorPalette.purple};
`;

StyledHeader.displayName = 'StyledHeader';

export const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 24px;
`;

HeaderSection.displayName = 'HeaderSection';

export const ScoreCardRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 24px 0;
`;

ScoreCardRow.displayName = 'ScoreCardRow';

export const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

ButtonRow.displayName = 'ButtonRow';
