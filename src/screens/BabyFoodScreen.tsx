import { Card } from '../components/Card';
import { Screen } from '../components/Screen';
import { Body, Caption, Heading, Title } from '../components/Typography';
import { getBabyFoodPlan } from '../data/mockContent';
import { colors } from '../theme';
import { AppProfiles } from '../types';
import { differenceInMonths } from '../utils/date';

type Props = {
  profiles: AppProfiles;
};

export function BabyFoodScreen({ profiles }: Props) {
  const ageMonths = differenceInMonths(profiles.baby.birthDate);
  const plan = getBabyFoodPlan(ageMonths);

  return (
    <Screen>
      <Title>Alimentação do bebé</Title>
      <Card>
        <Caption>Idade atual: {ageMonths} meses</Caption>
        <Heading>{plan.phase}</Heading>
        {plan.items.map((item) => (
          <Body key={item}>• {item}</Body>
        ))}
      </Card>

      <Card>
        <Heading>Aviso de segurança</Heading>
        <Body style={{ color: colors.warning }}>
          Atenção a engasgamento, alergias, mel antes dos 12 meses, excesso de sal/açúcar e alimentos perigosos.
          Confirme sempre dúvidas com o pediatra.
        </Body>
      </Card>
    </Screen>
  );
}
