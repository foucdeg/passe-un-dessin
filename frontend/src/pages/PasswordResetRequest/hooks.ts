import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAsyncFn } from 'react-use';
import client from 'services/networking/client';

export const useRequestToken = () => {
  return useAsyncFn(async ({ email }: { email: string }) => {
    return await client.post(`/auth/password-reset/`, { email });
  }, []);
};

export const useUnauthenticatedGuard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    async function checkMe() {
      const me = await client.get(`/player/me`);
      if (me && me.user) {
        console.warn(
          'Redirecting to homepage as this page should not be accessed by an authenticated user',
        );
        navigate('/');
      }
    }
    checkMe();
  }, [navigate]);
};
