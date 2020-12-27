import styled from 'styled-components';
import { fontSize, colorPalette } from 'stylesheet';
import { Link } from 'react-router-dom';

export const Container = styled.div<{ color?: string }>`
  border: 4px solid ${(props) => props.color || colorPalette.orange};
  padding: 12px;
  color: ${(props) => props.color || colorPalette.orange};
  border-radius: 16px;
  height: 190px;
  width: 190px;
  display: flex;
  flex-direction: column;
  text-align: center;
`;

export const Label = styled.span<{ color?: string }>`
  font-size: ${fontSize.medium};
  font-weight: bold;
`;

export const Value = styled.span<{ color?: string }>`
  font-size: ${fontSize.XXLarge};
  font-weight: bold;
  margin: auto 0;
`;

export const StyledLink = styled(Link)<{ color?: string }>`
  color: ${(props) => props.color || colorPalette.orange};
`;
