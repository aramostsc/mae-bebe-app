export type BirthType = 'vaginal' | 'cesariana' | 'instrumentado' | 'outro' | '';

export type MainGoal =
  | 'recuperacao'
  | 'energia'
  | 'alimentacao'
  | 'organizacao'
  | 'memorias'
  | 'outro';

export type MotherProfile = {
  id: string;
  name: string;
  deliveryDate: string;
  birthType?: BirthType;
  breastfeeding: boolean;
  mainGoal: MainGoal;
};

export type BabyProfile = {
  id: string;
  name: string;
  birthDate: string;
  sex?: 'feminino' | 'masculino' | 'outro' | '';
  weightKg?: number;
  heightCm?: number;
};

export type AppProfiles = {
  mother: MotherProfile;
  baby: BabyProfile;
};

export type EventType = 'consulta' | 'vacina' | 'aniversario' | 'lembrete' | 'marco' | 'autocuidado';

export type CalendarEvent = {
  id: string;
  title: string;
  date: string;
  type: EventType;
  notes?: string;
  source?: 'user' | 'system';
};

export type PhotoMemory = {
  id: string;
  uri: string;
  createdAt: string;
  babyAgeMonth: number;
  note?: string;
};

export type TipCategory =
  | 'mae'
  | 'bebe'
  | 'sono'
  | 'alimentacao'
  | 'recuperacao'
  | 'desenvolvimento'
  | 'organizacao';

export type Tip = {
  id: string;
  category: TipCategory;
  title: string;
  body: string;
};

export type RootStackParamList = {
  MainTabs: undefined;
  EventEditor: { eventId?: string } | undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Plans: undefined;
  Calendar: undefined;
  Memories: undefined;
  Settings: undefined;
};
