import styled from 'styled-components';
import SecondaryButton from 'components/SecondaryButton';

const TopRightButton = styled(SecondaryButton)`
  height: 32px;
  padding: 0 16px;
  margin-left: 8px;
  white-space: nowrap;
`;

TopRightButton.displayName = 'TopRightButton';

export default TopRightButton;
