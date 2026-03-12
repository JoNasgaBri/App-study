const APP_NAMESPACE = 'app-study';

const createKey = (key) => `${APP_NAMESPACE}:${key}`;

const safeJsonParse = (value, fallbackValue) => {
  try {
    return JSON.parse(value);
  } catch {
    return fallbackValue;
  }
};

export const storage = {
  get(key, fallbackValue = null, parser) {
    try {
      const rawValue = localStorage.getItem(createKey(key));
      if (rawValue === null) {
        return fallbackValue;
      }

      const parsedValue = safeJsonParse(rawValue, fallbackValue);
      if (typeof parser === 'function') {
        return parser(parsedValue, fallbackValue);
      }

      return parsedValue;
    } catch {
      return fallbackValue;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(createKey(key), JSON.stringify(value));
    } catch {
      if (import.meta.env.DEV) {
        console.warn('Falha ao persistir dado local.');
      }
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(createKey(key));
    } catch {
      if (import.meta.env.DEV) {
        console.warn('Falha ao remover dado local.');
      }
    }
  },
};
