import styled from 'styled-components';
import SecondaryButton from 'components/SecondaryButton';

const TopRightButton = styled(SecondaryButton)`
  height: 32px;
  padding: 0 16px;
  &:not(:last-child) {
    margin-right: 8px;
  }
`;

TopRightButton.displayName = 'TopRightButton';

export default TopRightButton;
