const APP_NAMESPACE = 'app-study';
/** Incrementar sempre que houver mudança incompatível nas chaves/formato dos dados. */
export const CURRENT_SCHEMA_VERSION = 1;

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

  /**
   * Verifica a versão do schema armazenada e executa migrações necessárias.
   * Deve ser chamado uma vez no boot da aplicação.
   */
  migrate() {
    const stored = this.get('schema:version', 0, (v) => (Number.isInteger(v) && v >= 0 ? v : 0));

    if (stored === CURRENT_SCHEMA_VERSION) return;

    // ─── Migrações por versão ───────────────────────────────────────
    // v0 → v1: nenhuma migração de dados necessária (primeira versão)
    // Futuramente: if (stored < 2) { /* migração v1→v2 */ }

    this.set('schema:version', CURRENT_SCHEMA_VERSION);

    if (import.meta.env.DEV) {
      console.info(`[storage] Schema migrado ${stored} → ${CURRENT_SCHEMA_VERSION}`);
    }
  },

  /**
   * Remove chaves do app que passaram seu TTL (expiryMs).
   * Chaves expiráveis devem ser salvas como { __value, __expiresAt }.
   */
  purgeExpired() {
    const prefix = `${APP_NAMESPACE}:`;
    const now = Date.now();
    const toRemove = [];

    for (let i = 0; i < localStorage.length; i++) {
      const rawKey = localStorage.key(i);
      if (!rawKey.startsWith(prefix)) continue;
      const parsed = safeJsonParse(localStorage.getItem(rawKey), null);
      if (parsed && typeof parsed === 'object' && '__expiresAt' in parsed) {
        if (parsed.__expiresAt < now) toRemove.push(rawKey);
      }
    }

    toRemove.forEach((k) => localStorage.removeItem(k));

    if (import.meta.env.DEV && toRemove.length > 0) {
      console.info(`[storage] ${toRemove.length} chave(s) expirada(s) removida(s).`);
    }
  },

  /** Salva um valor com TTL em milissegundos. */
  setWithTTL(key, value, ttlMs) {
    this.set(key, { __value: value, __expiresAt: Date.now() + ttlMs });
  },

  /** Lê um valor com TTL; retorna fallbackValue se expirado ou ausente. */
  getWithTTL(key, fallbackValue = null) {
    const raw = this.get(key, null, (v) => v);
    if (!raw || typeof raw !== 'object' || !('__value' in raw)) return fallbackValue;
    if (raw.__expiresAt < Date.now()) {
      this.remove(key);
      return fallbackValue;
    }
    return raw.__value;
  },
};
