import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CalendarEvent } from '../types';
import { getCalendarDays, toInputDate } from '../utils/date';
import { colors, radii, spacing } from '../theme';
import { Caption } from './Typography';

type Props = {
  monthKey: string;
  events: CalendarEvent[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
};

const weekdays = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'];

export function MonthCalendar({ monthKey, events, selectedDate, onSelectDate }: Props) {
  const today = toInputDate();
  const days = getCalendarDays(monthKey);

  return (
    <View style={styles.wrap}>
      <View style={styles.weekdays}>
        {weekdays.map((day, index) => (
          <Caption key={`${day}-${index}`} style={styles.weekday}>
            {day}
          </Caption>
        ))}
      </View>
      <View style={styles.grid}>
        {days.map((day) => {
          const dayEvents = events.filter((event) => event.date === day.date);
          const selected = selectedDate === day.date;
          const isToday = today === day.date;

          return (
            <Pressable
              accessibilityRole="button"
              key={day.date}
              onPress={() => onSelectDate(day.date)}
              style={({ pressed }) => [
                styles.day,
                !day.inMonth && styles.outsideMonth,
                isToday && styles.today,
                selected && styles.selected,
                pressed && styles.pressed,
              ]}
            >
              <Text style={[styles.dayText, !day.inMonth && styles.outsideMonthText, selected && styles.selectedText]}>
                {day.day}
              </Text>
              <View style={styles.dots}>
                {dayEvents.slice(0, 3).map((event) => (
                  <View
                    key={event.id}
                    style={[
                      styles.dot,
                      event.type === 'vacina' && styles.dotAccent,
                      event.type === 'autocuidado' && styles.dotCare,
                      event.source === 'system' && styles.dotMuted,
                    ]}
                  />
                ))}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.sm,
  },
  weekdays: {
    flexDirection: 'row',
  },
  weekday: {
    flex: 1,
    fontWeight: '700',
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  day: {
    alignItems: 'center',
    aspectRatio: 1,
    borderColor: colors.border,
    borderRadius: radii.sm,
    borderWidth: 1,
    justifyContent: 'center',
    margin: 2,
    width: '13.25%',
  },
  outsideMonth: {
    backgroundColor: '#FAF3F0',
  },
  today: {
    borderColor: colors.primary,
  },
  selected: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primaryDark,
  },
  dayText: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '700',
  },
  outsideMonthText: {
    color: colors.muted,
  },
  selectedText: {
    color: '#FFFFFF',
  },
  dots: {
    flexDirection: 'row',
    gap: 2,
    height: 8,
    marginTop: 2,
  },
  dot: {
    backgroundColor: colors.primary,
    borderRadius: 3,
    height: 5,
    width: 5,
  },
  dotAccent: {
    backgroundColor: colors.accent,
  },
  dotCare: {
    backgroundColor: colors.warning,
  },
  dotMuted: {
    backgroundColor: colors.muted,
  },
  pressed: {
    opacity: 0.78,
  },
});
