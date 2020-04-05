import styled from 'styled-components';
import { fontSize } from 'stylesheet';

const TextInput = styled.input`
  border: 2px solid linear-gradient(90deg, #ff9314 0%, #ff0080 100%);
  border-radius: 16px;
  padding: 16px 24px;
  font-size: ${fontSize.medium};
`;

export default TextInput;
