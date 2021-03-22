import React from 'react';
import { LoaderContainer, LoaderWrapper } from './Loader.style';

// Loader from https://loading.io/css/
interface Props {
  className?: string;
}
const Loader: React.FC<Props> = ({ className }) => (
  <LoaderWrapper className={className}>
    <LoaderContainer>
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
    </LoaderContainer>
  </LoaderWrapper>
);

export default Loader;
