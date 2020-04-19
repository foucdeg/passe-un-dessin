import styled from 'styled-components';
import TextInput from 'components/TextInput';
import { colorPalette } from 'stylesheet';
import Header2 from 'atoms/Header2';
import arrowRight from 'assets/arrow-right.svg';

export const PadInitContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
  height: 100%;
`;

PadInitContainer.displayName = 'PadInitContainer';

export const StyledForm = styled.form`
  width: 400px;
  margin-bottom: 8px;
`;

StyledForm.displayName = 'StyledForm';

export const StyledTextInput = styled(TextInput)`
  border-color: ${colorPalette.orange};
`;

StyledTextInput.displayName = 'StyledTextInput';

export const StyledHeader = styled(Header2)`
  color: ${colorPalette.purple};
  margin-bottom: 8px;
`;

StyledHeader.displayName = 'StyledHeader';

export const InputArrow = styled.img.attrs({ src: arrowRight })`
  cursor: pointer;
`;

InputArrow.displayName = 'InputArrow';
