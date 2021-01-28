import * as Sentry from '@sentry/react';

const backendBaseUrl = (process.env.REACT_APP_BACKEND_HOST || '') + '/api';

type Method = 'get' | 'post' | 'put' | 'patch' | 'delete';

async function request(
  method: Method,
  endpoint: string,
  data: Record<string, unknown> | null = null,
) {
  const url = /^https?:\/\//.test(endpoint) ? endpoint : `${backendBaseUrl}${endpoint}`;

  // generate unique transactionId and set as Sentry tag
  const requestId = Math.random().toString(36).substr(2, 9);
  Sentry.configureScope((scope) => {
    scope.setTag('request_id', requestId);
  });
  const headers = new Headers({
    'X-Request-Id': requestId,
    Accept: 'application/json',
  });

  const config: RequestInit = {
    method,
    headers,
  };

  if (['post', 'put', 'patch'].includes(method) && data) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, { method, headers });

    if (!response.ok) {
      return response
        .json()
        .catch(() => {
          throw new Error(response.statusText);
        })
        .then(({ message }) => {
          throw new Error(message || response.statusText);
        });
    }

    return await response.json();
  } catch (err) {
    Sentry.captureException(err);
    throw err;
  }
}

async function get(endpoint: string) {
  return await request('get', endpoint);
}

async function post(endpoint: string, data?: Record<string, unknown>) {
  return await request('post', endpoint, data);
}

async function put(endpoint: string, data?: Record<string, unknown>) {
  return await request('put', endpoint, data);
}

const client = {
  request,
  get,
  post,
  put,
  delete: async (endpoint: string) => await request('delete', endpoint),
};

export default client;
