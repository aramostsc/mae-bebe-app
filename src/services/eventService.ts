import { initialEvents } from '../data/mockContent';
import { CalendarEvent } from '../types';
import { getJson, removeJson, setJson } from './storage';

const EVENTS_KEY = 'mae-bebe:events';

export async function loadEvents() {
  return getJson<CalendarEvent[]>(EVENTS_KEY, initialEvents);
}

export async function saveEvents(events: CalendarEvent[]) {
  await setJson(EVENTS_KEY, events);
}

export async function clearEvents() {
  await removeJson(EVENTS_KEY);
}
