import { Card } from '../components/Card';
import { Screen } from '../components/Screen';
import { Body, Caption, Heading, Title } from '../components/Typography';
import { getTrainingPlan, safetyStopNotice } from '../data/mockContent';
import { colors } from '../theme';
import { AppProfiles } from '../types';
import { differenceInMonths, differenceInWeeks } from '../utils/date';

type Props = {
  profiles: AppProfiles;
};

export function TrainingScreen({ profiles }: Props) {
  const weeks = differenceInWeeks(profiles.mother.deliveryDate);
  const months = differenceInMonths(profiles.mother.deliveryDate);
  const plan = getTrainingPlan(months, weeks);

  return (
    <Screen>
      <Title>Treino pós-parto</Title>
      <Card>
        <Caption>Fase sugerida</Caption>
        <Heading>{plan.phase}</Heading>
        <Body>{plan.focus}</Body>
      </Card>

      <Card>
        <Heading>Plano base</Heading>
        {plan.items.map((item) => (
          <Body key={item}>• {item}</Body>
        ))}
      </Card>

      <Card>
        <Heading>Segurança primeiro</Heading>
        <Body style={{ color: colors.warning }}>{safetyStopNotice}</Body>
      </Card>
    </Screen>
  );
}
