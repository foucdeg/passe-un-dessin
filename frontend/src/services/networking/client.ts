import request from 'superagent';
import * as Sentry from '@sentry/react';

const backendBaseUrl = (process.env.REACT_APP_BACKEND_HOST || '') + '/api';

type Method = 'get' | 'post' | 'put' | 'patch' | 'delete';

class Client {
  baseUrl: string;
  agent: request.SuperAgentStatic & request.Request;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.agent = request.agent();
    this.agent.accept('application/json');
  }

  async request(method: Method, endpoint: string, data: Record<string, unknown> | null = null) {
    const url = /^https?:\/\//.test(endpoint) ? endpoint : `${this.baseUrl}${endpoint}`;
    // generate unique transactionId and set as Sentry tag
    const requestId = Math.random().toString(36).substr(2, 9);
    Sentry.configureScope((scope) => {
      scope.setTag('transaction_id', requestId);
    });

    let promise = this.agent[method](url).set('X-Request-Id', requestId);

    if (['post', 'put', 'patch'].includes(method) && data) {
      promise = promise.send(data);
    }

    try {
      const { body } = await promise;
      return body;
    } catch (err) {
      Sentry.captureException(err);
      throw err;
    }
  }

  get(endpoint: string) {
    return this.request('get', endpoint);
  }

  post(endpoint: string, data?: Record<string, unknown>) {
    return this.request('post', endpoint, data);
  }

  put(endpoint: string, data?: Record<string, unknown>) {
    return this.request('put', endpoint, data);
  }

  delete(endpoint: string) {
    return this.request('delete', endpoint);
  }
}

const client = new Client(backendBaseUrl);

export default client;
