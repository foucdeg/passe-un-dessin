import Switch from 'atoms/Switch';
import styled, { css } from 'styled-components';

export const Container = styled.div`
  width: 100%;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Label = styled.strong`
  text-align: justify;
  line-height: 18px;
  white-space: nowrap;
  margin-right: 16px;
`;

export const Value = styled.span<{ selected?: boolean }>`
  ${(props) =>
    props.selected &&
    css`
      font-weight: bold;
    `}
`;

export const StyledSwitch = styled(Switch)`
  margin: 0 16px;
`;
