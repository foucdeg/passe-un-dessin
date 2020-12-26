import styled from 'styled-components';
import Header2 from 'atoms/Header2';
import { colorPalette, fontWeight } from 'stylesheet';
import Modal from 'components/Modal';
import trophy from 'assets/trophy.svg';

export const StyledHeader = styled(Header2)`
  color: ${colorPalette.purple};
  margin-bottom: 32px;
`;

export const PlayerScore = styled.div<{ backgroundColor: string }>`
  padding: 6px 15px;
  margin-bottom: 8px;
  color: ${colorPalette.white};
  border-radius: 20px;
  display: flex;
  font-weight: ${fontWeight.bold};
  position: relative;
  background-color: ${({ backgroundColor }) => backgroundColor};
`;

export const StyledModal = styled(Modal)`
  align-items: center;
`;

export const VoteCount = styled.div`
  margin-left: 10px;
`;

export const Trophy = styled.img.attrs({ src: trophy })`
  position: absolute;
  left: -40px;
  top: 1px;
`;
