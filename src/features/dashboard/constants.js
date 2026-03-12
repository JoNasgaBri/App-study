export const CARD_TYPES = {
  TEXT: 'text',
  CHECKLIST: 'checklist',
  LINK: 'link',
};

export const CARD_LABELS = {
  [CARD_TYPES.TEXT]: 'Nota',
  [CARD_TYPES.CHECKLIST]: 'Checklist',
  [CARD_TYPES.LINK]: 'Link',
};

export const CANVAS_STORAGE_KEY = 'dashboard:canvas';
export const ONBOARDING_PROFILE_KEY = 'onboarding:profile';

export const SUBJECT_LABELS = {
  matematica: 'Matemática',
  portugues: 'Português',
  fisica: 'Física',
  quimica: 'Química',
  biologia: 'Biologia',
  historia: 'História',
  geografia: 'Geografia',
  filosofia: 'Filosofia',
  sociologia: 'Sociologia',
  ingles: 'Inglês',
  literatura: 'Literatura',
  artes: 'Artes',
};

/**
 * Build a fresh card skeleton for a given type.
 * @param {string} type - one of CARD_TYPES
 * @returns {object}
 */
export const buildCard = (type) => {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const base = { id, type, title: '', createdAt: new Date().toISOString() };

  if (type === CARD_TYPES.TEXT) return { ...base, body: '' };
  if (type === CARD_TYPES.CHECKLIST) return { ...base, items: [] };
  if (type === CARD_TYPES.LINK) return { ...base, url: '', label: '', description: '' };
  return base;
};
