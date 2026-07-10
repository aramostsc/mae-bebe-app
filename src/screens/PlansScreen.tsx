import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Card } from '../components/Card';
import { Screen } from '../components/Screen';
import { SelectChips } from '../components/SelectChips';
import { Body, Caption, Heading, Title } from '../components/Typography';
import {
  getBabyFoodPlan,
  getMotherNutrition,
  getTrainingPlan,
  safetyStopNotice,
  tips,
} from '../data/mockContent';
import { colors, spacing } from '../theme';
import { AppProfiles } from '../types';
import { differenceInMonths, differenceInWeeks } from '../utils/date';

type Props = {
  profiles: AppProfiles;
};

type PlanArea = 'treino' | 'mae' | 'bebe' | 'dicas';

export function PlansScreen({ profiles }: Props) {
  const [area, setArea] = useState<PlanArea>('treino');
  const postpartumWeeks = differenceInWeeks(profiles.mother.deliveryDate);
  const postpartumMonths = differenceInMonths(profiles.mother.deliveryDate);
  const babyAgeMonths = differenceInMonths(profiles.baby.birthDate);
  const trainingPlan = getTrainingPlan(postpartumMonths, postpartumWeeks);
  const motherNutrition = getMotherNutrition(profiles.mother.breastfeeding);
  const babyFood = getBabyFoodPlan(babyAgeMonths);

  return (
    <Screen>
      <View style={styles.header}>
        <Title>Planos</Title>
        <Body>Orientações simples para a mãe e para o bebé, sempre com espaço para validação profissional.</Body>
      </View>

      <SelectChips
        value={area}
        onChange={setArea}
        options={[
          { label: 'Treino', value: 'treino' },
          { label: 'Mãe', value: 'mae' },
          { label: 'Bebé', value: 'bebe' },
          { label: 'Dicas', value: 'dicas' },
        ]}
      />

      {area === 'treino' ? (
        <>
          <Card>
            <Caption>Fase sugerida</Caption>
            <Heading>{trainingPlan.phase}</Heading>
            <Body>{trainingPlan.focus}</Body>
          </Card>
          <Card>
            <Heading>Plano base</Heading>
            {trainingPlan.items.map((item) => (
              <Body key={item}>• {item}</Body>
            ))}
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
              Consulte nutricionista ou médico em caso de dúvidas, anemia, perda de peso excessiva, diabetes,
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
            {babyFood.items.map((item) => (
              <Body key={item}>• {item}</Body>
            ))}
          </Card>
          <Card>
            <Heading>Aviso de segurança</Heading>
            <Body style={styles.warning}>
              Atenção a engasgamento, alergias, mel antes dos 12 meses, excesso de sal/açúcar e alimentos perigosos.
              Confirme sempre dúvidas com o pediatra.
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
  warning: {
    color: colors.warning,
  },
});
