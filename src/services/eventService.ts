import { initialEvents } from '../data/mockContent';
import { BabyProfile, CalendarEvent } from '../types';
import { addMonthsToInputDate, differenceInMonths, isTodayOrFuture } from '../utils/date';
import { getJson, removeJson, setJson } from './storage';

const EVENTS_KEY = 'mae-bebe:events';

export async function loadEvents() {
  return getJson<CalendarEvent[]>(EVENTS_KEY, initialEvents);
}

export async function loadEventsForBaby(baby: BabyProfile) {
  const events = await loadEvents();
  const automaticEvents = createMonthlyBirthdayEvents(baby);
  return [...events, ...automaticEvents]
    .filter((event) => isTodayOrFuture(event.date))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export async function saveEvents(events: CalendarEvent[]) {
  await setJson(
    EVENTS_KEY,
    events.filter((event) => event.source !== 'system').map((event) => ({ ...event, source: 'user' as const })),
  );
}

export async function clearEvents() {
  await removeJson(EVENTS_KEY);
}

function createMonthlyBirthdayEvents(baby: BabyProfile): CalendarEvent[] {
  const currentAgeMonths = differenceInMonths(baby.birthDate);
  const startMonth = Math.max(1, currentAgeMonths + 1);
  const endMonth = startMonth + 11;

  return Array.from({ length: endMonth - startMonth + 1 }, (_, index) => {
    const month = startMonth + index;
    return {
      id: `system-monthly-${baby.id}-${month}`,
      title: `${baby.name} faz ${month} ${month === 1 ? 'mês' : 'meses'}`,
      date: addMonthsToInputDate(baby.birthDate, month),
      type: 'aniversario',
      notes: 'Marco mensal gerado automaticamente pela app.',
      source: 'system',
    };
  });
}
