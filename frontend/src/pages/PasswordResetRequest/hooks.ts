import { useAsyncFn } from 'react-use';
import client from 'services/networking/client';

export const useRequestToken = () => {
  return useAsyncFn(async ({ email }: { email: string }) => {
    return await client.post(`/auth/password-reset/`, { email });
  }, []);
};
