import { parseDate } from './date';

const datePattern = /^\d{4}-\d{2}-\d{2}$/;

export function isValidInputDate(value: string) {
  if (!datePattern.test(value)) {
    return false;
  }

  const date = parseDate(value);
  return value === date.toISOString().slice(0, 10);
}

export function isFutureDate(value: string) {
  const date = parseDate(value);
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return date.getTime() > today.getTime();
}

export function isPositiveNumberText(value: string) {
  if (!value.trim()) {
    return true;
  }

  const normalized = Number(value.replace(',', '.'));
  return Number.isFinite(normalized) && normalized > 0;
}
