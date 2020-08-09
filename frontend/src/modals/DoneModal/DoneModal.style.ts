import styled from 'styled-components';
import Modal from 'components/Modal';
import Button from 'atoms/Button';
import Header2 from 'atoms/Header2';
import { colorPalette } from 'stylesheet';

export const StyledModal = styled(Modal)`
  align-items: center;
`;

StyledModal.displayName = 'StyledModal';

export const StyledHeader = styled(Header2)`
  color: ${colorPalette.purple};
  margin-bottom: 16px;
`;

StyledHeader.displayName = 'StyledHeader';

export const StyledButton = styled(Button)`
  margin-top: 20px;
`;

StyledButton.displayName = 'StyledButton';

export const StyledParagraph = styled.p`
  margin-bottom: 16px;
`;

StyledParagraph.displayName = 'StyledParagraph';
