import { PhotoMemory } from '../types';
import { getJson, removeJson, setJson } from './storage';

const PHOTOS_KEY = 'mae-bebe:photos';

export async function loadPhotos() {
  return getJson<PhotoMemory[]>(PHOTOS_KEY, []);
}

export async function savePhotos(photos: PhotoMemory[]) {
  await setJson(PHOTOS_KEY, photos);
}

export async function clearPhotos() {
  await removeJson(PHOTOS_KEY);
}
