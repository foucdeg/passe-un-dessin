import React from 'react';
import { OuterLoader, InnerLoader } from './InputLoader.style';

const InputLoader: React.FC<{}> = () => (
  <OuterLoader>
    <InnerLoader>
      <div>
        <div></div>
        <div></div>
      </div>
    </InnerLoader>
  </OuterLoader>
);

export default InputLoader;
