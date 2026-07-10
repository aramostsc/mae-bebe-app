import { Card } from '../components/Card';
import { Screen } from '../components/Screen';
import { Body, Heading, Title } from '../components/Typography';
import { getMotherNutrition } from '../data/mockContent';
import { colors } from '../theme';
import { AppProfiles } from '../types';

type Props = {
  profiles: AppProfiles;
};

export function MotherNutritionScreen({ profiles }: Props) {
  const suggestions = getMotherNutrition(profiles.mother.breastfeeding);

  return (
    <Screen>
      <Title>Nutrição da mãe</Title>
      {suggestions.map((item) => (
        <Card key={item.title}>
          <Heading>{item.title}</Heading>
          <Body>{item.body}</Body>
        </Card>
      ))}
      <Card>
        <Heading>Aviso</Heading>
        <Body style={{ color: colors.warning }}>
          Consulte nutricionista ou médico em caso de dúvidas, anemia, perda de peso excessiva, diabetes, alergias,
          hipertensão ou outras condições.
        </Body>
      </Card>
    </Screen>
  );
}
