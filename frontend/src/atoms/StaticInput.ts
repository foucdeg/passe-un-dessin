import styled from 'styled-components';
import { colorPalette } from 'stylesheet';

const StaticInput = styled.div`
  height: 54px;
  line-height: 19px;
  border: 2px solid ${colorPalette.orange};
  border-radius: 16px;
  padding: 16px 24px;
  width: 100%;
  margin-bottom: 8px;
  text-align: left;
`;

StaticInput.displayName = 'StaticInput';

export default StaticInput;
