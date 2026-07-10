import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing } from '../theme';
import { CareLog, CareLogType } from '../types';
import { careLogLabels, formatCareLogTime, getLatestCareLogByType } from '../utils/careLogs';
import { PrimaryButton } from './PrimaryButton';
import { Body, Caption, Heading } from './Typography';

type Props = {
  logs: CareLog[];
  nightMode: boolean;
  onAdd: (type: CareLogType) => void;
  onToggleNightMode: () => void;
};

const logTypes: CareLogType[] = ['mamada', 'fralda', 'sono', 'medicacao'];

export function CareLogPanel({ logs, nightMode, onAdd, onToggleNightMode }: Props) {
  return (
    <View style={[styles.wrap, nightMode && styles.nightWrap]}>
      <View style={styles.headerRow}>
        <View style={styles.headerText}>
          <Caption style={nightMode && styles.nightCaption}>Registo rápido</Caption>
          <Heading style={nightMode && styles.nightHeading}>Últimos cuidados</Heading>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={onToggleNightMode}
          style={({ pressed }) => [styles.modeButton, nightMode && styles.modeButtonNight, pressed && styles.pressed]}
        >
          <Text style={[styles.modeButtonText, nightMode && styles.modeButtonTextNight]}>
            {nightMode ? 'Dia' : 'Noite'}
          </Text>
        </Pressable>
      </View>

      <Body style={nightMode && styles.nightBody}>
        {nightMode
          ? 'Botões grandes, pouco brilho. Só o essencial para esta hora.'
          : 'Um toque chega. Serve para aliviar a memória, não para controlar tudo.'}
      </Body>

      <View style={nightMode ? styles.nightGrid : styles.grid}>
        {logTypes.map((type) => {
          const latestLog = getLatestCareLogByType(logs, type);

          return (
            <View key={type} style={[styles.item, nightMode && styles.nightItem]}>
              <PrimaryButton label={careLogLabels[type]} onPress={() => onAdd(type)} variant={nightMode ? 'primary' : 'secondary'} />
              <Caption style={nightMode && styles.nightCaption}>
                {latestLog ? `Último: ${formatCareLogTime(latestLog.createdAt)}` : 'Ainda sem registo'}
              </Caption>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.md,
  },
  nightWrap: {
    backgroundColor: colors.night,
    borderColor: colors.nightSurface,
  },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  headerText: {
    flex: 1,
    gap: spacing.xs,
  },
  modeButton: {
    alignItems: 'center',
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
    borderRadius: radii.sm,
    borderWidth: 1,
    minHeight: 40,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  modeButtonNight: {
    backgroundColor: colors.nightSurface,
    borderColor: colors.nightMuted,
  },
  modeButtonText: {
    color: colors.primaryDark,
    fontSize: 14,
    fontWeight: '800',
  },
  modeButtonTextNight: {
    color: colors.nightText,
  },
  grid: {
    gap: spacing.sm,
  },
  nightGrid: {
    gap: spacing.md,
  },
  item: {
    gap: spacing.xs,
  },
  nightItem: {
    gap: spacing.sm,
  },
  nightCaption: {
    color: colors.nightMuted,
  },
  nightHeading: {
    color: colors.nightText,
  },
  nightBody: {
    color: colors.nightText,
  },
  pressed: {
    opacity: 0.78,
  },
});
