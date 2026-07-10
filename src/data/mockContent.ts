import { CalendarEvent, Tip } from '../types';
import { toInputDate } from '../utils/date';

export const healthDisclaimer =
  'Esta app oferece informação geral e apoio organizacional. Não substitui médico, pediatra, nutricionista, fisioterapeuta pélvico ou outro profissional de saúde.';

export const safetyStopNotice =
  'Se surgir dor, sangramento, tonturas, pressão pélvica, incontinência, febre, desconforto intenso ou preocupação com o bebé, pare e contacte um profissional de saúde.';

export const tips: Tip[] = [
  {
    id: 'tip-1',
    category: 'recuperacao',
    title: 'Uma pausa também conta',
    body: 'Escolha um momento curto para respirar com calma, beber água e reparar no corpo sem julgamento.',
  },
  {
    id: 'tip-2',
    category: 'bebe',
    title: 'Observe sinais, não apenas horários',
    body: 'Sono, fome e conforto variam muito. Pequenos padrões do seu bebé ajudam a orientar a rotina.',
  },
  {
    id: 'tip-3',
    category: 'alimentacao',
    title: 'Monte refeições simples',
    body: 'Uma base de proteína, hidratos, legumes e gordura de qualidade pode facilitar dias com pouco tempo.',
  },
  {
    id: 'tip-4',
    category: 'sono',
    title: 'Ritual curto',
    body: 'Luz baixa, voz calma e repetição ajudam o bebé a reconhecer a transição para descanso.',
  },
  {
    id: 'tip-5',
    category: 'organizacao',
    title: 'Prepare o próximo passo',
    body: 'Deixar fraldas, muda de roupa e água à mão reduz pequenas fricções durante o dia.',
  },
  {
    id: 'tip-6',
    category: 'mae',
    title: 'Peça ajuda de forma concreta',
    body: 'Pedidos como preparar uma refeição ou segurar o bebé durante 20 minutos são mais fáceis de aceitar.',
  },
  {
    id: 'tip-7',
    category: 'desenvolvimento',
    title: 'Brincar pode ser simples',
    body: 'Conversar, cantar e mostrar contrastes ao bebé já são estímulos valiosos nos primeiros meses.',
  },
];

export const initialEvents: CalendarEvent[] = [
  {
    id: 'event-1',
    title: 'Consulta de acompanhamento',
    type: 'consulta',
    date: toInputDate(new Date(Date.now() + 1000 * 60 * 60 * 24 * 5)),
    notes: 'Confirmar horário e levar dúvidas anotadas.',
  },
  {
    id: 'event-2',
    title: 'Momento de autocuidado',
    type: 'autocuidado',
    date: toInputDate(new Date(Date.now() + 1000 * 60 * 60 * 24 * 2)),
    notes: '20 minutos para banho calmo, descanso ou caminhada curta.',
  },
];

export function getDailyTip(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((date.getTime() - start.getTime()) / 86400000);
  return tips[dayOfYear % tips.length];
}

export function getTrainingPlan(monthsPostpartum: number, weeksPostpartum: number) {
  if (weeksPostpartum < 6) {
    return {
      phase: '0-6 semanas',
      focus: 'Recuperação, descanso e reconexão suave',
      items: ['Respiração diafragmática', 'Mobilidade suave de ombros e coluna', 'Conexão abdominal e pélvica sem esforço', 'Caminhadas muito curtas se houver conforto'],
    };
  }

  if (weeksPostpartum < 12) {
    return {
      phase: '6-12 semanas',
      focus: 'Ativação leve e confiança no movimento',
      items: ['Caminhada progressiva', 'Mobilidade de ancas e coluna', 'Agachamento assistido', 'Ponte de glúteos suave', 'Core seguro sem pressão abdominal'],
    };
  }

  if (monthsPostpartum < 6) {
    return {
      phase: '3-6 meses',
      focus: 'Força leve progressiva e postura',
      items: ['Treino leve com peso corporal', 'Glúteos e costas', 'Core anti-rotação suave', 'Alongamentos de peito e flexores da anca', 'Progressão lenta por tolerância'],
    };
  }

  return {
    phase: '6+ meses',
    focus: 'Progressão gradual para treino completo',
    items: ['Força global 2-3 vezes por semana', 'Cardio moderado', 'Core funcional', 'Progressão de impacto apenas se houver conforto', 'Ajustar carga ao sono e energia'],
  };
}

export function getMotherNutrition(breastfeeding: boolean) {
  return [
    { title: 'Pequeno-almoço', body: 'Papas de aveia com fruta e iogurte, ovos com pão de mistura, ou smoothie com proteína e frutos secos.' },
    { title: 'Almoço', body: 'Prato simples com legumes, arroz/batata/massa, proteína como peixe, frango, ovos, tofu ou leguminosas.' },
    { title: 'Jantar', body: 'Sopa rica em legumes com uma fonte de proteína, ou refeição quente leve com hidratos e gordura de qualidade.' },
    { title: 'Snacks', body: 'Fruta, iogurte, frutos secos, queijo fresco, húmus com tostas, ou sandes simples.' },
    {
      title: 'Hidratação',
      body: breastfeeding
        ? 'Se está a amamentar, mantenha água por perto e beba ao longo do dia, especialmente após mamadas.'
        : 'Tenha água visível durante o dia e ajuste a ingestão ao calor, movimento e sede.',
    },
  ];
}

export function getBabyFoodPlan(ageMonths: number) {
  if (ageMonths < 6) {
    return {
      phase: '0-6 meses',
      items: ['Leite materno ou fórmula conforme orientação', 'Sem introdução alimentar salvo indicação médica', 'Acompanhar fraldas, crescimento e sinais do bebé'],
    };
  }

  if (ageMonths < 12) {
    return {
      phase: '6-12 meses',
      items: ['Introdução gradual de alimentos simples', 'Explorar texturas adequadas à idade', 'Observar sinais de prontidão e saciedade', 'Introduzir alergénios com orientação quando necessário'],
    };
  }

  return {
    phase: '12+ meses',
    items: ['Alimentação familiar adaptada', 'Variedade de cores, texturas e grupos alimentares', 'Promover autonomia com segurança', 'Manter atenção a sal, açúcar e risco de engasgamento'],
  };
}
