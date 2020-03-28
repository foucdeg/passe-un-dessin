import styled from 'styled-components';
import { borderRadius, colorUsage, fontFamily, fontSize, getSpacing } from 'stylesheet';
import Link from 'components/Link';

export const Container = styled.div`
  display: flex;
  justify-content: center;
`;

export const Content = styled.form`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: ${getSpacing(80)};
`;

export const ErrorMessage = styled.div`
  color: ${colorUsage.error};
  font-family: ${fontFamily.main};
  font-size: ${fontSize.small};
  margin-bottom: ${getSpacing(1)};
`;

export const HomeLink = styled(Link)`
  margin-bottom: ${getSpacing(1)};
`;

export const InputLabel = styled.label`
  font-family: ${fontFamily.main};
  font-size: ${fontSize.small};
  margin-bottom: ${getSpacing(1)};
`;

export const Input = styled.input`
  font-family: ${fontFamily.main};
  font-size: ${fontSize.medium};
  height: ${getSpacing(8)};
  background-color: ${colorUsage.inputBackground};
  padding: 0 ${getSpacing(3)};
  border-radius: ${borderRadius.medium};
  border: 1px solid;
  margin-bottom: ${getSpacing(2)};
  border-color: ${colorUsage.inputBorderColor};

  :hover {
    border-color: ${colorUsage.primaryTextColor};
  }

  :focus {
    border-color: ${colorUsage.primary};
  }

  ::placeholder {
    color: ${colorUsage.inputPlaceholderColor};
  }
`;

export const Message = styled.div`
  font-family: ${fontFamily.main};
  font-size: ${fontSize.medium};
  margin-bottom: ${getSpacing(1)};
`;
