import styled from 'styled-components';
import SecondaryButton from 'components/SecondaryButton';
import Header2 from 'atoms/Header2';

export const TopRightButtons = styled.div`
  position: absolute;
  right: 0;
  top: -40px;
`;

TopRightButtons.displayName = 'TopRightButtons';

export const TopRightButton = styled(SecondaryButton)`
  height: 32px;
  padding: 0 16px;
  &:not(:last-child) {
    margin-right: 8px;
  }
`;

TopRightButton.displayName = 'TopRightButton';

export const StyledHeader = styled(Header2)`
  margin-bottom: 16px;
`;

StyledHeader.displayName = 'StyledHeader';
