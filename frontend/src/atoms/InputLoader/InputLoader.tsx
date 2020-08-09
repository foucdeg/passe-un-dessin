import React from 'react';
import { OuterLoader, InnerLoader } from './InputLoader.style';
import { EmptyObject } from 'services/utils';

const InputLoader: React.FC<EmptyObject> = () => (
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
