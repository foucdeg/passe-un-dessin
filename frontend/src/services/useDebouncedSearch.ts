import { useState, useEffect } from 'react';
import useConstant from 'use-constant';
import AwesomeDebouncePromise from 'awesome-debounce-promise';

export const useDebouncedSearch = (searchFunction: (text: string) => void) => {
  const [inputText, setInputText] = useState('');

  const debouncedSearchFunction = useConstant(() => AwesomeDebouncePromise(searchFunction, 200));

  useEffect(() => {
    debouncedSearchFunction(inputText);
  }, [debouncedSearchFunction, inputText]);

  return {
    inputText,
    setInputText,
  };
};
