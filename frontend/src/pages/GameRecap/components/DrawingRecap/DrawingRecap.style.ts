import styled from 'styled-components';
import Drawing from 'components/Canvas/Drawing';

export const StyledDrawingRecap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 236px;
  height: 260px;
  justify-content: space-between;
  margin-bottom: 8px;
  letter-spacing: 0.1em;
  line-height: 19px;
  font-weight: bold;
  position: relative;
`;

export const StyledDrawing = styled(Drawing)`
  width: 100%;
`;

export const DrawingHeader = styled.div`
  text-transform: uppercase;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
  overflow: hidden;
`;
