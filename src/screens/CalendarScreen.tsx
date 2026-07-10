import { useEffect, useMemo, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { Card } from '../components/Card';
import { FormField } from '../components/FormField';
import { MonthCalendar } from '../components/MonthCalendar';
import { PrimaryButton } from '../components/PrimaryButton';
import { Screen } from '../components/Screen';
import { SelectChips } from '../components/SelectChips';
import { Body, Caption, Heading, Title } from '../components/Typography';
import { loadEventsForBaby, saveEvents } from '../services/eventService';
import { colors, spacing } from '../theme';
import { BabyProfile, CalendarEvent, EventType } from '../types';
import { addMonthsToMonthKey, getMonthKey, getMonthLabel, toInputDate } from '../utils/date';
import { createId } from '../utils/id';
import { isFutureDate, isValidInputDate } from '../utils/validation';

type Props = {
  baby: BabyProfile;
};

const defaultType: EventType = 'lembrete';

export function CalendarScreen({ baby }: Props) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState<EventType>(defaultType);
  const [notes, setNotes] = useState('');
  const [visibleMonth, setVisibleMonth] = useState(getMonthKey());
  const [selectedDate, setSelectedDate] = useState(toInputDate());

  useEffect(() => {
    loadEventsForBaby(baby).then(setEvents);
  }, [baby]);

  const selectedDateEvents = useMemo(
    () => events.filter((event) => event.date === selectedDate),
    [events, selectedDate],
  );

  async function persist(nextEvents: CalendarEvent[]) {
    const sorted = nextEvents.sort((a, b) => a.date.localeCompare(b.date));
    setEvents(sorted);
    await saveEvents(sorted);
  }

  function resetForm() {
    setEditingId(null);
    setTitle('');
    setDate('');
    setType(defaultType);
    setNotes('');
  }

  function applyTemplate(nextType: EventType) {
    setType(nextType);
    if (!title.trim()) {
      const labels: Record<EventType, string> = {
        consulta: `Consulta do ${baby.name}`,
        vacina: `Vacina do ${baby.name}`,
        aniversario: `Marco do ${baby.name}`,
        lembrete: 'Lembrete',
        marco: `Novo marco do ${baby.name}`,
        autocuidado: 'Momento de autocuidado',
      };
      setTitle(labels[nextType]);
    }
  }

  function handleSelectDate(nextDate: string) {
    setSelectedDate(nextDate);
    setDate(nextDate);
  }

  async function handleSave() {
    if (!title.trim() || !date) {
      Alert.alert('Campos em falta', 'Adicione título e data no formato AAAA-MM-DD.');
      return;
    }

    if (!isValidInputDate(date)) {
      Alert.alert('Data inválida', 'Use o formato AAAA-MM-DD, por exemplo 2026-07-10.');
      return;
    }

    if (isFutureDate(baby.birthDate) || date < baby.birthDate) {
      Alert.alert('Data a rever', 'A data do evento não deve ser anterior ao nascimento do bebé.');
      return;
    }

    const event: CalendarEvent = {
      id: editingId ?? createId('event'),
      title: title.trim(),
      date,
      type,
      notes: notes.trim() || undefined,
      source: 'user',
    };

    await persist(editingId ? events.map((item) => (item.id === editingId ? event : item)) : [...events, event]);
    setSelectedDate(date);
    setVisibleMonth(getMonthKey(new Date(`${date}T12:00:00`)));
    resetForm();
  }

  function handleEdit(event: CalendarEvent) {
    if (event.source === 'system') {
      return;
    }

    setEditingId(event.id);
    setTitle(event.title);
    setDate(event.date);
    setType(event.type);
    setNotes(event.notes ?? '');
    setSelectedDate(event.date);
    setVisibleMonth(getMonthKey(new Date(`${event.date}T12:00:00`)));
  }

  async function handleDelete(eventId: string) {
    await persist(events.filter((event) => event.id !== eventId));
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Title>Agenda</Title>
        <Body>Um lugar simples para compromissos, vacinas, marcos e pequenos lembretes.</Body>
      </View>

      <Card>
        <View style={styles.monthHeader}>
          <PrimaryButton label="‹" onPress={() => setVisibleMonth(addMonthsToMonthKey(visibleMonth, -1))} variant="secondary" />
          <Heading style={styles.monthTitle}>{getMonthLabel(visibleMonth)}</Heading>
          <PrimaryButton label="›" onPress={() => setVisibleMonth(addMonthsToMonthKey(visibleMonth, 1))} variant="secondary" />
        </View>
        <MonthCalendar
          monthKey={visibleMonth}
          events={events}
          selectedDate={selectedDate}
          onSelectDate={handleSelectDate}
        />
      </Card>

      <Card>
        <Caption>Dia selecionado</Caption>
        <Heading>{selectedDate}</Heading>
        <View style={styles.list}>
          {selectedDateEvents.length ? (
            selectedDateEvents.map((event) => (
              <View key={event.id} style={styles.eventRow}>
                <Body>{event.title}</Body>
                <Caption>
                  {event.type}
                  {event.source === 'system' ? ' · automático' : ''}
                </Caption>
              </View>
            ))
          ) : (
            <Body>Nada marcado neste dia.</Body>
          )}
        </View>
      </Card>

      <Card>
        <Heading>{editingId ? 'Editar evento' : 'Novo evento'}</Heading>
        <View style={styles.form}>
          <View style={styles.fieldGroup}>
            <Caption>Tipo</Caption>
            <SelectChips
              value={type}
              onChange={applyTemplate}
              options={[
                { label: 'Consulta', value: 'consulta' },
                { label: 'Vacina', value: 'vacina' },
                { label: 'Lembrete', value: 'lembrete' },
                { label: 'Marco', value: 'marco' },
                { label: 'Autocuidado', value: 'autocuidado' },
              ]}
            />
          </View>
          <FormField label="Título" value={title} onChangeText={setTitle} placeholder={`Ex.: Consulta do ${baby.name}`} />
          <FormField label="Data" value={date} onChangeText={setDate} placeholder="AAAA-MM-DD" />
          <FormField label="Notas" value={notes} onChangeText={setNotes} placeholder="Opcional" />
          <PrimaryButton label={editingId ? 'Guardar alterações' : 'Adicionar evento'} onPress={handleSave} />
          {editingId ? <PrimaryButton label="Cancelar edição" onPress={resetForm} variant="secondary" /> : null}
        </View>
      </Card>

      <View style={styles.sectionHeader}>
        <Heading>Próximos</Heading>
        <Caption>Inclui aniversários mensais automáticos.</Caption>
      </View>

      {events.slice(0, 8).map((event) => (
        <Card key={event.id}>
          <Caption>
            {event.date} · {event.type}
            {event.source === 'system' ? ' · automático' : ''}
          </Caption>
          <Heading>{event.title}</Heading>
          {event.notes ? <Body>{event.notes}</Body> : null}
          {event.source !== 'system' ? (
            <View style={styles.actions}>
              <PrimaryButton label="Editar" onPress={() => handleEdit(event)} variant="secondary" />
              <PrimaryButton label="Apagar" onPress={() => handleDelete(event.id)} variant="secondary" />
            </View>
          ) : null}
        </Card>
      ))}

      <Caption style={styles.note}>Preparado para futura integração com Google Calendar e Apple Calendar.</Caption>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.sm,
  },
  monthHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  monthTitle: {
    flex: 1,
    textAlign: 'center',
  },
  form: {
    gap: spacing.md,
    marginTop: spacing.md,
  },
  fieldGroup: {
    gap: spacing.sm,
  },
  sectionHeader: {
    gap: spacing.xs,
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
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  note: {
    color: colors.muted,
  },
});
