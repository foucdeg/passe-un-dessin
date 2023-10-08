import styled from 'styled-components';
import BareAnchor from 'atoms/BareAnchor';
import { colorPalette } from 'stylesheet';
import EyeIcon from 'assets/eye.svg?react';

export const IMAGE_HEIGHT = 180; // Should be multiple of 9
export const IMAGE_WIDTH = (IMAGE_HEIGHT * 16) / 9;

export const StreamImage = styled.img`
  width: ${IMAGE_WIDTH}px;
  height: ${IMAGE_HEIGHT}px;
`;

export const StyledBareAnchor = styled(BareAnchor)`
  width: ${IMAGE_WIDTH}px;
  margin: 10px 30px;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const StreamerName = styled.div`
  font-weight: bold;
`;

export const StreamTitle = styled.div`
  font-weight: bold;
`;

export const StyledEye = styled(EyeIcon)`
  .eye {
    fill: ${colorPalette.orange};
  }
`;

export const StreamViewerCount = styled.div`
  display: flex;
  align-items: center;
  color: ${colorPalette.orange};
  font-weight: bold;

  > :first-child {
    margin-right: 5px;
  }
`;
