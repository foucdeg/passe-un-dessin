import styled from 'styled-components';

export const StyledForm = styled.form`
  display: flex;
  flex-direction: row;

  & > :not(:last-child) {
    margin-right: 20px;
  }
`;
