import { AppProfiles } from '../types';
import { setJson, getJson, removeJson } from './storage';

const PROFILE_KEY = 'mae-bebe:profiles';

export async function loadProfiles() {
  return getJson<AppProfiles | null>(PROFILE_KEY, null);
}

export async function saveProfiles(profiles: AppProfiles) {
  await setJson(PROFILE_KEY, profiles);
  return profiles;
}

export async function clearProfiles() {
  await removeJson(PROFILE_KEY);
}
