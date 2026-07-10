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

export function addMonthsToInputDate(inputDate: string, months: number) {
  const date = parseDate(inputDate);
  const day = date.getDate();
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);

  if (next.getDate() !== day) {
    next.setDate(0);
  }

  return toInputDate(next);
}

export function isTodayOrFuture(inputDate: string, today = new Date()) {
  return inputDate >= toInputDate(today);
}

export function getMonthKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export function addMonthsToMonthKey(monthKey: string, offset: number) {
  const [year, month] = monthKey.split('-').map(Number);
  const date = new Date(year, month - 1 + offset, 1, 12);
  return getMonthKey(date);
}

export function getMonthLabel(monthKey: string) {
  const [year, month] = monthKey.split('-').map(Number);
  const date = new Date(year, month - 1, 1, 12);
  const label = date.toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function getCalendarDays(monthKey: string) {
  const [year, month] = monthKey.split('-').map(Number);
  const firstDay = new Date(year, month - 1, 1, 12);
  const firstWeekday = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month, 0, 12).getDate();
  const cells: Array<{ date: string; day: number; inMonth: boolean }> = [];

  for (let index = 0; index < firstWeekday; index += 1) {
    const date = new Date(year, month - 1, 1 - (firstWeekday - index), 12);
    cells.push({ date: toInputDate(date), day: date.getDate(), inMonth: false });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, month - 1, day, 12);
    cells.push({ date: toInputDate(date), day, inMonth: true });
  }

  while (cells.length % 7 !== 0) {
    const last = parseDate(cells[cells.length - 1].date);
    const date = new Date(last);
    date.setDate(last.getDate() + 1);
    cells.push({ date: toInputDate(date), day: date.getDate(), inMonth: false });
  }

  return cells;
}
