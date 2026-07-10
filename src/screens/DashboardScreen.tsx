import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Card } from '../components/Card';
import { PrimaryButton } from '../components/PrimaryButton';
import { Screen } from '../components/Screen';
import { Body, Caption, Heading, Title } from '../components/Typography';
import { getDailyReflection, getDailyTip, getTodayAction, healthDisclaimer } from '../data/mockContent';
import { loadEvents } from '../services/eventService';
import { colors, radii, spacing } from '../theme';
import { AppProfiles, CalendarEvent, MainTabParamList } from '../types';
import { differenceInMonths, differenceInWeeks, formatBabyAge, getPostpartumLabel } from '../utils/date';

type Props = {
  profiles: AppProfiles;
};

export function DashboardScreen({ profiles }: Props) {
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList>>();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const babyAgeMonths = differenceInMonths(profiles.baby.birthDate);
  const postpartumWeeks = differenceInWeeks(profiles.mother.deliveryDate);
  const tip = getDailyTip();
  const reflection = getDailyReflection(postpartumWeeks, babyAgeMonths);
  const todayAction = useMemo(
    () => getTodayAction(postpartumWeeks, babyAgeMonths, events.length > 0),
    [babyAgeMonths, events.length, postpartumWeeks],
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadEvents().then((items) => setEvents(items.sort((a, b) => a.date.localeCompare(b.date)).slice(0, 2)));
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <Screen>
      <View style={styles.hero}>
        <Caption>Olá, {profiles.mother.name}</Caption>
        <Title>Um passo de cada vez.</Title>
        <Body>
          {profiles.baby.name} tem {formatBabyAge(profiles.baby.birthDate)}. {getPostpartumLabel(profiles.mother.deliveryDate)}.
        </Body>
      </View>

      <View style={styles.reflection}>
        <Caption>Para hoje</Caption>
        <Heading>{reflection.title}</Heading>
        <Body>{reflection.body}</Body>
      </View>

      <Card>
        <Caption>Ação pequena</Caption>
        <Heading>{todayAction.title}</Heading>
        <Body>{todayAction.body}</Body>
        <View style={styles.cardAction}>
          <PrimaryButton label={todayAction.cta} onPress={() => navigation.navigate(todayAction.target)} />
        </View>
      </Card>

      <View style={styles.summaryRow}>
        <View style={styles.summaryItem}>
          <Caption>Bebé</Caption>
          <Heading>{babyAgeMonths} meses</Heading>
        </View>
        <View style={styles.summaryItem}>
          <Caption>Pós-parto</Caption>
          <Heading>{postpartumWeeks} sem.</Heading>
        </View>
      </View>

      <Card>
        <Caption>Dica do dia</Caption>
        <Heading>{tip.title}</Heading>
        <Body>{tip.body}</Body>
      </Card>

      <Card>
        <View style={styles.cardHeader}>
          <Heading>Agenda próxima</Heading>
          <PrimaryButton label="Abrir" onPress={() => navigation.navigate('Calendar')} variant="secondary" />
        </View>
        <View style={styles.list}>
          {events.length ? (
            events.map((event) => (
              <View key={event.id} style={styles.eventRow}>
                <Body>{event.title}</Body>
                <Caption>
                  {event.date} · {event.type}
                </Caption>
              </View>
            ))
          ) : (
            <Body>Nada marcado para já. Podes respirar um pouco.</Body>
          )}
        </View>
      </Card>

      <View style={styles.quickGrid}>
        <PrimaryButton label="Ver planos" onPress={() => navigation.navigate('Plans')} variant="secondary" />
        <PrimaryButton label="Guardar memória" onPress={() => navigation.navigate('Memories')} variant="secondary" />
      </View>

      <Caption style={styles.disclaimer}>{healthDisclaimer}</Caption>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    gap: spacing.sm,
    paddingTop: spacing.sm,
  },
  reflection: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.lg,
  },
  cardAction: {
    marginTop: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  summaryItem: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    flex: 1,
    gap: spacing.xs,
    padding: spacing.md,
  },
  cardHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
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
