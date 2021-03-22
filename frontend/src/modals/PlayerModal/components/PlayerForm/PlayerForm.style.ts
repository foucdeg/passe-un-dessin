import styled from 'styled-components';
import { ReactComponent as EditIcon } from 'assets/edit.svg';
import { ReactComponent as CheckIcon } from 'assets/check.svg';
import TextInput from 'atoms/TextInput';
import { colorPalette } from 'stylesheet';
import { Form } from 'formik';
import Avatar from 'components/Avatar';

export const PLAYER_COLORS = {
  '#9337AE': 'purple',
  '#60DAFF': 'lightBlue',
  '#62FAD3': 'lightGreen',
  '#8A80F1': 'mauve',
  '#FF9314': 'orange',
  '#FF5257': 'bloodOrange',
  '#FDC737': 'yellow',
  '#FF0080': 'fuschia',
};

export const Row = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;

export const Square = styled.div<{ color: string }>`
  width: 48px;
  height: 48px;
  border-radius: 4px;
  flex-shrink: 0;
  background-color: ${(props) => props.color};
`;

export const StyledNonInput = styled.span`
  margin: 0 16px;
  flex-grow: 1;
  padding: 0 26px;
`;

export const StyledForm = styled(Form)`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;

export const StyledTextInput = styled(TextInput)`
  margin: 0 16px;
  flex-grow: 0;
`;

export const StyledEditIcon = styled(EditIcon)`
  cursor: pointer;
`;

export const StyledCheckIcon = styled(CheckIcon)`
  cursor: pointer;

  .main {
    fill: ${colorPalette.purple};
  }
`;

export const AirButton = styled.button`
  outline: none;
  margin: 0;
  padding: 0;
  background: none;
  border: none;
`;

export const StyledAvatar = styled(Avatar)`
  margin-right: 16px;
  flex-shrink: 0;
  cursor: pointer;
`;
