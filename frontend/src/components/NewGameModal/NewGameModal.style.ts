import styled from 'styled-components';
import Header2 from 'atoms/Header2';

export const ButtonRow = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin-top: 16px;
`;

ButtonRow.displayName = 'ButtonRow';

export const StyledHeader = styled(Header2)`
  margin-bottom: 16px;
`;

StyledHeader.displayName = 'StyledHeader';
