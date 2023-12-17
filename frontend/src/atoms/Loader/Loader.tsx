import React from 'react';
import cn from 'classnames';
import { loaderContainer, loaderWrapper } from './Loader.module.scss';

// Loader from https://loading.io/css/
interface Props {
  className?: string;
}
const Loader: React.FC<Props> = ({ className }) => (
  <div className={cn(loaderWrapper, className)}>
    <div className={loaderContainer}>
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
    </div>
  </div>
);

export default Loader;
