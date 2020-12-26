import styled from 'styled-components';
import Drawing from 'components/Canvas/Drawing';
import { ReactComponent as EditIcon } from 'assets/edit.svg';

const SQUARE_SIDE = 80;

export const StyledEditIcon = styled(EditIcon)`
  position: absolute;
  bottom: 0;
  right: 0;
  display: none;
`;

export const Container = styled.div`
  height: ${SQUARE_SIDE}px;
  width: ${SQUARE_SIDE}px;
  border-radius: 5px;
  position: relative;

  &:hover > ${StyledEditIcon} {
    display: block;
  }
`;

export const StyledDrawing = styled(Drawing)`
  height: 100%;
  width: 100%;
`;
