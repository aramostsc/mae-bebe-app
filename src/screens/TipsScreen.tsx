import { Card } from '../components/Card';
import { Screen } from '../components/Screen';
import { Body, Caption, Heading, Title } from '../components/Typography';
import { tips } from '../data/mockContent';

export function TipsScreen() {
  return (
    <Screen>
      <Title>Dicas</Title>
      {tips.map((tip) => (
        <Card key={tip.id}>
          <Caption>{tip.category}</Caption>
          <Heading>{tip.title}</Heading>
          <Body>{tip.body}</Body>
        </Card>
      ))}
    </Screen>
  );
}
