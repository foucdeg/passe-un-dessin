import styled from 'styled-components';
import Modal from 'components/Modal';
import Header2 from 'atoms/Header2';
import { colorPalette } from 'stylesheet';

export const WideModal = styled(Modal)`
  width: 768px;
  padding: 24px;
`;

export const StyledHeader = styled(Header2)`
  color: ${colorPalette.purple};
  margin-bottom: 24px;
  text-align: center;
`;

export const CreateAccountContainer = styled.div`
  display: flex;
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 0;
`;

export const Gutter = styled.div`
  border: 1px solid ${colorPalette.textGrey};
  margin: 0 24px;
  flex-grow: 0;
`;

export const StyledParagraph = styled.p`
  margin-bottom: 16px;
`;

export const Features = styled.ul`
  margin-bottom: 24px;
`;

export const Feature = styled.li`
  list-style-type: disc;
  margin-left: 24px;
  letter-spacing: 0.05em;
`;
