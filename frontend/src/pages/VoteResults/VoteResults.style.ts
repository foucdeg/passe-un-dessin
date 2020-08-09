import styled from 'styled-components';

import SecondaryButton from 'atoms/SecondaryButton';

export const Container = styled.div`
  display: flex;
  height: 100%;
  justify-content: center;
`;
Container.displayName = 'Container';

export const TopRightButtons = styled.div`
  position: absolute;
  right: 0;
  top: -40px;
`;

TopRightButtons.displayName = 'TopRightButtons';

export const TopRightButton = styled(SecondaryButton)`
  height: 32px;
  padding: 0 16px;
  margin-left: 8px;
  white-space: nowrap;
`;

TopRightButton.displayName = 'TopRightButton';
