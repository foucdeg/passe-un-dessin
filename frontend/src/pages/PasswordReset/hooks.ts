import { useHistory } from 'react-router';
import { useAsyncFn } from 'react-use';
import client from 'services/networking/client';

export const useCheckToken = () => {
  return useAsyncFn(async (token: string | null) => {
    return await client.post(`/auth/password-reset/validate_token/`, { token });
  }, []);
};

export const useSubmitNewPassword = () => {
  const { push } = useHistory();
  return useAsyncFn(async ({ token, password }: { token: string; password: string }) => {
    const data = await client.post(`/auth/password-reset/confirm/`, { token, password });

    setTimeout(() => push('/'), 3000);
    return data;
  }, []);
};
