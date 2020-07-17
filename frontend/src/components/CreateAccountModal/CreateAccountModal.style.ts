import styled from 'styled-components';
import Modal from 'components/Modal';
import Header2 from 'atoms/Header2';
import { colorPalette } from 'stylesheet';
import Header4 from 'atoms/Header4';

export const WideModal = styled(Modal)`
  width: 768px;
  padding: 24px;
`;

WideModal.displayName = 'WideModal';

export const StyledHeader = styled(Header2)`
  color: ${colorPalette.purple};
  margin-bottom: 24px;
  text-align: center;
`;

StyledHeader.displayName = 'StyledHeader';

export const CreateAccountContainer = styled.div`
  display: flex;
`;

CreateAccountContainer.displayName = 'CreateAccountContainer';

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 0;
`;

Column.displayName = 'Column';

export const Gutter = styled.div`
  border: 1px solid ${colorPalette.textGrey};
  margin: 0 24px;
  flex-grow: 0;
`;

Gutter.displayName = 'Gutter';

export const SeparatorText = styled(Header4)`
  color: ${colorPalette.textGrey};
`;

SeparatorText.displayName = 'SeparatorText';

export const StyledParagraph = styled.p`
  margin-bottom: 16px;
`;

StyledParagraph.displayName = 'StyledParagraph';

export const Features = styled.ul`
  margin-bottom: 24px;
`;

Features.displayName = 'Features';

export const Feature = styled.li`
  list-style-type: disc;
  margin-left: 24px;
  letter-spacing: 0.05em;
`;

Feature.displayName = 'Feature';
