const DAY_MS = 1000 * 60 * 60 * 24;

export function parseDate(value: string) {
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

export function differenceInDays(fromIso: string, toDate = new Date()) {
  const from = parseDate(fromIso);
  return Math.max(0, Math.floor((toDate.getTime() - from.getTime()) / DAY_MS));
}

export function differenceInWeeks(fromIso: string, toDate = new Date()) {
  return Math.floor(differenceInDays(fromIso, toDate) / 7);
}

export function differenceInMonths(fromIso: string, toDate = new Date()) {
  const from = parseDate(fromIso);
  let months = (toDate.getFullYear() - from.getFullYear()) * 12 + toDate.getMonth() - from.getMonth();
  if (toDate.getDate() < from.getDate()) {
    months -= 1;
  }
  return Math.max(0, months);
}

export function formatBabyAge(birthDate: string) {
  const weeks = differenceInWeeks(birthDate);
  const months = differenceInMonths(birthDate);

  if (months < 2) {
    return `${weeks} semanas`;
  }

  return `${months} meses`;
}

export function getPostpartumLabel(deliveryDate: string) {
  const weeks = differenceInWeeks(deliveryDate);
  const months = differenceInMonths(deliveryDate);

  if (weeks < 12) {
    return `${weeks} semanas desde o parto`;
  }

  return `${months} meses desde o parto`;
}

export function toInputDate(date = new Date()) {
  return date.toISOString().slice(0, 10);
}
