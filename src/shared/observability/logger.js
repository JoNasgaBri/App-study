import { env } from '../config/env';

const isDev = import.meta.env.DEV;

const formatContext = (context = {}) => ({
  env: env.appEnv,
  version: env.appVersion,
  ...context,
});

export const logInfo = (event, context = {}) => {
  if (isDev) {
    console.info(`[info] ${event}`, formatContext(context));
  }
};

export const logError = (event, error, context = {}) => {
  const payload = {
    ...formatContext(context),
    message: error instanceof Error ? error.message : String(error),
  };

  console.error(`[error] ${event}`, payload);
};

export const initializeGlobalErrorHandlers = () => {
  window.addEventListener('error', (event) => {
    logError('window_error', event.error ?? event.message, {
      source: event.filename,
      line: event.lineno,
      column: event.colno,
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    logError('unhandled_rejection', event.reason, {});
  });
};
