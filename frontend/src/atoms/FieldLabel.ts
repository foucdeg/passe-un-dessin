import styled from 'styled-components';
import { colorPalette } from 'stylesheet';

const FieldLabel = styled.label`
  color: ${colorPalette.black};
  margin-bottom: 8px;
  letter-spacing: 0.05em;
`;

FieldLabel.displayName = 'FieldLabel';

export default FieldLabel;
