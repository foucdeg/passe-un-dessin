import styled from 'styled-components';
import { fontSize, colorPalette } from 'stylesheet';

const TextInput = styled.input`
  border: 2px solid ${colorPalette.orange};
  border-radius: 16px;
  padding: 16px 24px;
  font-size: ${fontSize.medium};

  &[readonly] {
    color: ${colorPalette.textGrey};
  }
`;

export default TextInput;
