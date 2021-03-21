import * as Sentry from '@sentry/react';

const backendBaseUrl = (process.env.REACT_APP_BACKEND_HOST || '') + '/api';

type Method = 'get' | 'post' | 'put' | 'PATCH' | 'delete';

class HTTPError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request(
  method: Method,
  endpoint: string,
  data: Record<string, unknown> | null = null,
) {
  const url = /^https?:\/\//.test(endpoint) ? endpoint : `${backendBaseUrl}${endpoint}`;

  const headers = new Headers({
    Accept: 'application/json',
    'Content-Type': 'application/json',
  });

  const config: RequestInit = {
    method,
    headers,
  };

  if (['post', 'put', 'PATCH'].includes(method) && data) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, config);

    if (response.headers.has('X-Request-ID')) {
      Sentry.configureScope((scope) => {
        scope.setTag('request_id', response.headers.get('X-Request-ID'));
      });
    }

    const responseText = await response.text();

    if (!response.ok) {
      throw new HTTPError(response.status, responseText || response.statusText);
    }
    try {
      return JSON.parse(responseText);
    } catch (e) {
      return responseText;
    }
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

async function patch(endpoint: string, data?: Record<string, unknown>) {
  return await request('PATCH', endpoint, data);
}

async function doDelete(endpoint: string) {
  return await request('delete', endpoint);
}

const client = {
  request,
  get,
  post,
  put,
  patch,
  delete: doDelete,
};

export default client;
