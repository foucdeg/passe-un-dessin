import React from 'react';
import { EmptyObject } from 'services/utils';
import { OuterLoader, InnerLoader } from './InputLoader.style';

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
