import { Link } from 'react-router-dom';
import styled from 'styled-components';

const BareLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: block;
`;
BareLink.displayName = 'BareLink';

export default BareLink;
