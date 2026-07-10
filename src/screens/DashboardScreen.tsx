import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { Card } from '../components/Card';
import { PrimaryButton } from '../components/PrimaryButton';
import { Screen } from '../components/Screen';
import { Body, Caption, Heading, Title } from '../components/Typography';
import { getDailyTip, healthDisclaimer } from '../data/mockContent';
import { loadEvents } from '../services/eventService';
import { colors, spacing } from '../theme';
import { AppProfiles, CalendarEvent, MainTabParamList } from '../types';
import { differenceInMonths, differenceInWeeks, formatBabyAge, getPostpartumLabel } from '../utils/date';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

type Props = {
  profiles: AppProfiles;
};

export function DashboardScreen({ profiles }: Props) {
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList>>();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const babyAgeMonths = differenceInMonths(profiles.baby.birthDate);
  const postpartumWeeks = differenceInWeeks(profiles.mother.deliveryDate);
  const tip = getDailyTip();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadEvents().then((items) => setEvents(items.sort((a, b) => a.date.localeCompare(b.date)).slice(0, 3)));
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <Screen>
      <View style={styles.header}>
        <Caption>Olá, {profiles.mother.name}</Caption>
        <Title>{profiles.baby.name} tem {formatBabyAge(profiles.baby.birthDate)}</Title>
        <Body>{getPostpartumLabel(profiles.mother.deliveryDate)}</Body>
      </View>

      <View style={styles.stats}>
        <Card>
          <Caption>Idade do bebé</Caption>
          <Heading>{babyAgeMonths} meses</Heading>
        </Card>
        <Card>
          <Caption>Pós-parto</Caption>
          <Heading>{postpartumWeeks} sem.</Heading>
        </Card>
      </View>

      <Card>
        <Caption>Dica do dia</Caption>
        <Heading>{tip.title}</Heading>
        <Body>{tip.body}</Body>
      </Card>

      <Card>
        <Heading>Próximos eventos</Heading>
        <View style={styles.list}>
          {events.length ? (
            events.map((event) => (
              <View key={event.id} style={styles.eventRow}>
                <Body>{event.title}</Body>
                <Caption>{event.date} · {event.type}</Caption>
              </View>
            ))
          ) : (
            <Body>Ainda não há eventos marcados.</Body>
          )}
        </View>
      </Card>

      <View style={styles.quickGrid}>
        <PrimaryButton label="Treino" onPress={() => navigation.navigate('Treino')} />
        <PrimaryButton label="Alimentação mãe" onPress={() => navigation.navigate('Mae')} variant="secondary" />
        <PrimaryButton label="Alimentação bebé" onPress={() => navigation.navigate('Bebe')} variant="secondary" />
        <PrimaryButton label="Calendário" onPress={() => navigation.navigate('Calendario')} variant="secondary" />
        <PrimaryButton label="Galeria" onPress={() => navigation.navigate('Galeria')} variant="secondary" />
      </View>

      <Caption style={styles.disclaimer}>{healthDisclaimer}</Caption>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.sm,
  },
  stats: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  list: {
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  eventRow: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    paddingBottom: spacing.sm,
  },
  quickGrid: {
    gap: spacing.sm,
  },
  disclaimer: {
    color: colors.warning,
  },
});
