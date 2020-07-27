import styled from 'styled-components';
import Header4 from 'atoms/Header4';
import { colorPalette } from 'stylesheet';
import Switch from 'components/Switch';

export const SeparatorText = styled(Header4)`
  color: ${colorPalette.textGrey};
`;

SeparatorText.displayName = 'SeparatorText';

export const InlineSwitch = styled.div`
  display: flex;
  margin: 0 auto;
  align-items: center;
  margin-bottom: 8px;
`;
InlineSwitch.displayName = 'InlineSwitch';

export const StyledSwitch = styled(Switch)`
  margin: 0 16px;
`;
StyledSwitch.displayName = 'StyledSwitch';
