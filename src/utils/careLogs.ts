import { CareLog, CareLogType } from '../types';

export const careLogLabels: Record<CareLogType, string> = {
  mamada: 'Mamada',
  fralda: 'Fralda',
  sono: 'Sono',
  medicacao: 'Medicação',
};

export function getLatestCareLogByType(logs: CareLog[], type: CareLogType) {
  return logs.find((log) => log.type === type);
}

export function formatCareLogTime(createdAt: string) {
  return new Date(createdAt).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
}
