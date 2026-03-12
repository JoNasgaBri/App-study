import { env } from '../config/env';
import { logError, logInfo } from '../observability/logger';

const withTimeout = async (promise, timeoutMs) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await promise(controller.signal);
  } finally {
    clearTimeout(timeout);
  }
};

const buildUrl = (path) => {
  if (!env.apiBaseUrl) {
    throw new Error('VITE_API_BASE_URL não configurada.');
  }

  return `${env.apiBaseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
};

export const httpRequest = async (path, options = {}) => {
  const { method = 'GET', headers = {}, body, timeoutMs = env.apiTimeoutMs, retry = 1 } = options;
  const url = buildUrl(path);

  let lastError;

  for (let attempt = 0; attempt <= retry; attempt += 1) {
    try {
      const response = await withTimeout(
        (signal) =>
          fetch(url, {
            method,
            headers: {
              'Content-Type': 'application/json',
              ...headers,
            },
            body: body ? JSON.stringify(body) : undefined,
            signal,
          }),
        timeoutMs,
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const contentType = response.headers.get('content-type') ?? '';
      const result = contentType.includes('application/json') ? await response.json() : await response.text();

      logInfo('api_success', { path, method, attempt });
      return result;
    } catch (error) {
      lastError = error;
      logError('api_error', error, { path, method, attempt });
    }
  }

  throw lastError;
};
