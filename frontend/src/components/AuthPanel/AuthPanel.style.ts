import styled from 'styled-components';
import Switch from 'components/Switch';

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
