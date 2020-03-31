import styled from 'styled-components';
import { fontSize } from 'stylesheet';

const TextInput = styled.input`
  border: 1px solid #333;
  border-radius: 4px;
  padding: 12px;
  font-size: ${fontSize.medium};
`;

export default TextInput;
