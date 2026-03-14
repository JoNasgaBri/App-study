/**
 * Backup — export / import do estado local completo do app.
 * Serializa todas as chaves do namespace 'app-study:*' em JSON assinado.
 */

const APP_NAMESPACE = 'app-study';
export const BACKUP_SCHEMA_VERSION = 1;

/** Coleta todos os dados do app e devolve uma string JSON pronta para download. */
export function exportData() {
  const data = {};

  for (let i = 0; i < localStorage.length; i++) {
    const rawKey = localStorage.key(i);
    if (!rawKey.startsWith(APP_NAMESPACE + ':')) continue;
    const shortKey = rawKey.slice(APP_NAMESPACE.length + 1);
    try {
      data[shortKey] = JSON.parse(localStorage.getItem(rawKey));
    } catch {
      data[shortKey] = localStorage.getItem(rawKey);
    }
  }

  const backup = {
    __version: BACKUP_SCHEMA_VERSION,
    __exported: new Date().toISOString(),
    __app: 'app-study',
    data,
  };

  return JSON.stringify(backup, null, 2);
}

/**
 * Valida e importa um JSON de backup.
 * Sobrescreve todas as chaves existentes do app.
 * @returns {number} quantidade de chaves restauradas.
 * @throws {Error} se o arquivo for inválido.
 */
export function importData(jsonString) {
  let parsed;
  try {
    parsed = JSON.parse(jsonString);
  } catch {
    throw new Error('Arquivo inválido: não é um JSON legível.');
  }

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Formato de backup inválido.');
  }
  if (parsed.__app !== 'app-study') {
    throw new Error('Backup de um app diferente — importação bloqueada.');
  }
  if (!parsed.data || typeof parsed.data !== 'object') {
    throw new Error('Campo "data" ausente ou inválido no backup.');
  }

  // Limpar chaves existentes do app
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith(APP_NAMESPACE + ':')) keysToRemove.push(key);
  }
  keysToRemove.forEach((k) => localStorage.removeItem(k));

  // Escrever dados importados
  for (const [shortKey, value] of Object.entries(parsed.data)) {
    try {
      localStorage.setItem(`${APP_NAMESPACE}:${shortKey}`, JSON.stringify(value));
    } catch {
      // ignora chave inválida
    }
  }

  return Object.keys(parsed.data).length;
}

/** Inicia download de arquivo .json no browser. */
export function triggerDownload(jsonString, filename = 'app-study-backup.json') {
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
