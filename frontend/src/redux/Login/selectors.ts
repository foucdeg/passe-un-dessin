import { RootState } from 'redux/types';

export const getUserToken = (store: RootState) => store.login.token;
