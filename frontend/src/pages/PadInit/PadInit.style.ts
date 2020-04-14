import styled from 'styled-components';
import TextInput from 'components/TextInput';
import { colorPalette } from 'stylesheet';
import Header2 from 'atoms/Header2';

export const PadInitContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
  height: 100%;
`;

export const StyledForm = styled.form`
  width: 400px;
  margin-bottom: 8px;
`;

export const StyledTextInput = styled(TextInput)`
  border-color: ${colorPalette.orange};
`;

export const StyledHeader = styled(Header2)`
  margin-bottom: 8px;
`;

export const Spacer = styled.div`
  flex-grow: 1;
`;

export const InputArrow = styled.img`
  cursor: pointer;
`;
