import styled from 'styled-components';
import Drawing from 'components/Canvas/Drawing';
import editIcon from 'assets/edit.svg';

const SQUARE_SIDE = 80;

export const Container = styled.div`
  height: ${SQUARE_SIDE}px;
  width: ${SQUARE_SIDE}px;
  border-radius: 5px;
  margin: auto;
  margin-bottom: 16px;
  cursor: url(${editIcon}) 2 20, auto;
`;
Container.displayName = 'Container';

export const StyledDrawing = styled(Drawing)`
  height: ${SQUARE_SIDE}px;
  width: ${SQUARE_SIDE}px;
`;
StyledDrawing.displayName = 'StyledDrawing';
