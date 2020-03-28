import { useAsyncFn } from 'react-use';
import { githubApiClient } from 'services/networking/client';
import { useDispatch } from 'react-redux';
import { updateUser } from './slice';

export const useFetchUser = () => {
  const dispatch = useDispatch();
  /* eslint-disable-next-line @typescript-eslint/ban-ts-ignore */
  // @ts-ignore
  return useAsyncFn(async (username: string) => {
    const user = await githubApiClient.get(`https://api.github.com/users/${username}`);
    dispatch(updateUser(user));
  });
};
