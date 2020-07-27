import styled from 'styled-components';
import Header2 from 'atoms/Header2';
import { colorPalette } from 'stylesheet';
import arrowRight from 'assets/arrow-right.svg';
import Modal from 'components/Modal';

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

export const PlayerModalContainer = styled.div`
  display: flex;
`;

PlayerModalContainer.displayName = 'PlayerModalContainer';

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

export const InputArrow = styled.img.attrs({ src: arrowRight })`
  cursor: pointer;
`;

InputArrow.displayName = 'InputArrow';
