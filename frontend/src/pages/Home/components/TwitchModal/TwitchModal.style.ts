import styled from 'styled-components';
import { Header3 } from 'atoms/Headers';
import { colorPalette } from 'stylesheet';
import Modal from 'components/Modal';

export const Header = styled(Header3)`
  color: ${colorPalette.purple};
  margin-bottom: 20px;
  align-self: flex-start;
  font-weight: bold;
`;
Header.displayName = 'Header';

export const Content = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
Content.displayName = 'Content';

export const StyledModal = styled(Modal)`
  width: 800px;
  padding: 20px;
`;
StyledModal.displayName = 'StyledModal';
