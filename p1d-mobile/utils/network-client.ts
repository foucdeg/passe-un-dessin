const backendBaseUrl = 'https://passeundessin.com/api';

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
  const url = /^https?:\/\//.test(endpoint)
    ? endpoint
    : `${backendBaseUrl}${endpoint}`;

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

  const response = await fetch(url, config);
  const responseText = await response.text();

  if (!response.ok) {
    throw new HTTPError(response.status, responseText || response.statusText);
  }
  try {
    return JSON.parse(responseText);
  } catch (e) {
    return responseText;
  }
}

async function get(endpoint: string) {
  return request('get', endpoint);
}

async function post(endpoint: string, data?: Record<string, unknown>) {
  return request('post', endpoint, data);
}

async function put(endpoint: string, data?: Record<string, unknown>) {
  return request('put', endpoint, data);
}

async function patch(endpoint: string, data?: Record<string, unknown>) {
  return request('PATCH', endpoint, data);
}

async function doDelete(endpoint: string) {
  return request('delete', endpoint);
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
