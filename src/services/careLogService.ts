import { CareLog } from '../types';
import { getJson, removeJson, setJson } from './storage';

const CARE_LOGS_KEY = 'mae-bebe:care-logs';

export async function loadCareLogs() {
  return getJson<CareLog[]>(CARE_LOGS_KEY, []);
}

export async function saveCareLogs(logs: CareLog[]) {
  await setJson(CARE_LOGS_KEY, logs);
}

export async function clearCareLogs() {
  await removeJson(CARE_LOGS_KEY);
}
