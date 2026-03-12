const requiredEnv = ['VITE_APP_ENV', 'VITE_APP_VERSION'];

const readEnv = (key, fallbackValue = '') => {
  const value = import.meta.env[key];
  if (typeof value === 'string' && value.length > 0) {
    return value;
  }
  return fallbackValue;
};

const toNumber = (value, fallbackValue) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallbackValue;
};

const assertRequiredEnv = () => {
  const missing = requiredEnv.filter((key) => !readEnv(key));

  if (missing.length > 0) {
    throw new Error(`Variáveis obrigatórias ausentes: ${missing.join(', ')}`);
  }
};

export const env = {
  appEnv: readEnv('VITE_APP_ENV', 'development'),
  appVersion: readEnv('VITE_APP_VERSION', '0.0.0'),
  apiBaseUrl: readEnv('VITE_API_BASE_URL', ''),
  apiTimeoutMs: toNumber(readEnv('VITE_API_TIMEOUT_MS', '8000'), 8000),
};

export const featureFlags = {
  cloudSync: readEnv('VITE_FF_CLOUD_SYNC', '0') === '1',
  calendarExport: readEnv('VITE_FF_CALENDAR_EXPORT', '0') === '1',
  advancedAnalytics: readEnv('VITE_FF_ADVANCED_ANALYTICS', '0') === '1',
};

export const validateEnv = () => {
  if (import.meta.env.PROD) {
    assertRequiredEnv();
    return;
  }

  const missing = requiredEnv.filter((key) => !readEnv(key));
  if (missing.length > 0) {
    console.warn(`Variáveis recomendadas ausentes em desenvolvimento: ${missing.join(', ')}`);
  }
};
