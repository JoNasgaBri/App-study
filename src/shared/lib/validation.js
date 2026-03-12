export const clampNumber = (value, min, max, fallback = min) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, parsed));
};

export const sanitizeText = (value, maxLength = 140) => {
  if (typeof value !== 'string') {
    return '';
  }

  const withoutControlChars = Array.from(value)
    .filter((char) => {
      const charCode = char.charCodeAt(0);
      return charCode >= 32 && charCode !== 127;
    })
    .join('');

  return withoutControlChars.replace(/\s+/g, ' ').trim().slice(0, maxLength);
};

export const sanitizeNumberInput = (value, min, max, fallback = min) => {
  const sanitized = clampNumber(value, min, max, fallback);
  return Number.isInteger(sanitized) ? sanitized : Math.round(sanitized);
};
