import styled from 'styled-components';
import { colorPalette } from 'stylesheet';
import Button from 'atoms/Button';

const SecondaryButton = styled(Button)`
  border: 2px solid ${colorPalette.orange};
  color: ${colorPalette.orange};
  background: ${colorPalette.white};
`;

export default SecondaryButton;
