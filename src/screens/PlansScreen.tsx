import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Card } from '../components/Card';
import { Screen } from '../components/Screen';
import { SelectChips } from '../components/SelectChips';
import { Body, Caption, Heading, Title } from '../components/Typography';
import {
  getBabyFoodPlan,
  getMotherNutrition,
  getPlanOrientation,
  getTrainingPlan,
  safetyStopNotice,
  tips,
} from '../data/mockContent';
import { colors, radii, spacing } from '../theme';
import { AppProfiles } from '../types';
import { differenceInMonths, differenceInWeeks } from '../utils/date';

type Props = {
  profiles: AppProfiles;
};

type PlanArea = 'treino' | 'mae' | 'bebe' | 'dicas';

const areaLabels: Record<PlanArea, string> = {
  treino: 'Movimento',
  mae: 'Cuidar da mãe',
  bebe: 'Cuidar do bebé',
  dicas: 'Ideias leves',
};

export function PlansScreen({ profiles }: Props) {
  const [area, setArea] = useState<PlanArea>('treino');
  const postpartumWeeks = differenceInWeeks(profiles.mother.deliveryDate);
  const postpartumMonths = differenceInMonths(profiles.mother.deliveryDate);
  const babyAgeMonths = differenceInMonths(profiles.baby.birthDate);
  const trainingPlan = getTrainingPlan(postpartumMonths, postpartumWeeks);
  const motherNutrition = getMotherNutrition(profiles.mother.breastfeeding);
  const babyFood = getBabyFoodPlan(babyAgeMonths);
  const orientation = getPlanOrientation(area, profiles.mother.breastfeeding, babyAgeMonths);

  return (
    <Screen>
      <View style={styles.header}>
        <Title>Planos</Title>
        <Body>Uma orientação de cada vez. O resto fica guardado para quando fizer sentido.</Body>
      </View>

      <SelectChips
        value={area}
        onChange={setArea}
        options={[
          { label: 'Movimento', value: 'treino' },
          { label: 'Mãe', value: 'mae' },
          { label: 'Bebé', value: 'bebe' },
          { label: 'Dicas', value: 'dicas' },
        ]}
      />

      <View style={styles.todayBox}>
        <Caption>Orientação de hoje · {areaLabels[area]}</Caption>
        <Heading>{orientation.title}</Heading>
        <Body>{orientation.body}</Body>
      </View>

      <View style={styles.sectionHeader}>
        <Heading>Biblioteca</Heading>
        <Caption>Consulta quando precisares, sem obrigação de fazer tudo.</Caption>
      </View>

      {area === 'treino' ? (
        <>
          <Card>
            <Caption>Fase sugerida</Caption>
            <Heading>{trainingPlan.phase}</Heading>
            <Body>{trainingPlan.focus}</Body>
          </Card>
          <Card>
            <Heading>Plano base</Heading>
            <View style={styles.list}>
              {trainingPlan.items.map((item) => (
                <Body key={item}>• {item}</Body>
              ))}
            </View>
          </Card>
          <Card>
            <Heading>Segurança primeiro</Heading>
            <Body style={styles.warning}>{safetyStopNotice}</Body>
          </Card>
        </>
      ) : null}

      {area === 'mae' ? (
        <>
          {motherNutrition.map((item) => (
            <Card key={item.title}>
              <Heading>{item.title}</Heading>
              <Body>{item.body}</Body>
            </Card>
          ))}
          <Card>
            <Heading>Aviso</Heading>
            <Body style={styles.warning}>
              Consulta nutricionista ou médico em caso de dúvidas, anemia, perda de peso excessiva, diabetes,
              alergias, hipertensão ou outras condições.
            </Body>
          </Card>
        </>
      ) : null}

      {area === 'bebe' ? (
        <>
          <Card>
            <Caption>Idade atual: {babyAgeMonths} meses</Caption>
            <Heading>{babyFood.phase}</Heading>
            <View style={styles.list}>
              {babyFood.items.map((item) => (
                <Body key={item}>• {item}</Body>
              ))}
            </View>
          </Card>
          <Card>
            <Heading>Aviso de segurança</Heading>
            <Body style={styles.warning}>
              Atenção a engasgamento, alergias, mel antes dos 12 meses, excesso de sal/açúcar e alimentos perigosos.
              Confirma sempre dúvidas com o pediatra.
            </Body>
          </Card>
        </>
      ) : null}

      {area === 'dicas'
        ? tips.map((tip) => (
            <Card key={tip.id}>
              <Caption>{tip.category}</Caption>
              <Heading>{tip.title}</Heading>
              <Body>{tip.body}</Body>
            </Card>
          ))
        : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.sm,
  },
  todayBox: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.lg,
  },
  sectionHeader: {
    gap: spacing.xs,
  },
  list: {
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  warning: {
    color: colors.warning,
  },
});
