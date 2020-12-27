import styled from 'styled-components';
import { colorPalette, fontFamily, fontSize, getSpacing, lineHeight } from 'stylesheet';

export const Container = styled.div`
  display: flex;
  justify-content: center;
`;

export const PageContent = styled.div`
  padding: ${getSpacing(8)} ${getSpacing(4)};
  font-family: ${fontFamily.main};
  color: ${colorPalette.black};
`;

export const Title = styled.h1`
  font-size: ${fontSize.titles};
`;

export const HelperList = styled.ul`
  list-style: disc inside;
  margin-top: ${getSpacing(2)};
  line-height: ${lineHeight.medium};
`;
