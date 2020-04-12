import { TypedUseSelectorHook, useSelector as useSelectorGeneric } from 'react-redux';
import { RootState } from 'redux/types';

export const useSelector: TypedUseSelectorHook<RootState> = useSelectorGeneric;
