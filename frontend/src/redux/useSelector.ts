import { TypedUseSelectorHook, useSelector as useSelectorGeneric } from 'react-redux';
import { RootState } from 'redux/types';

const useSelector: TypedUseSelectorHook<RootState> = useSelectorGeneric;

export default useSelector;
