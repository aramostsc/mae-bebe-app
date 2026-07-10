import { useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { Card } from '../components/Card';
import { FormField } from '../components/FormField';
import { PrimaryButton } from '../components/PrimaryButton';
import { Screen } from '../components/Screen';
import { Body, Caption, Heading, Title } from '../components/Typography';
import { loadEvents, saveEvents } from '../services/eventService';
import { colors, spacing } from '../theme';
import { BabyProfile, CalendarEvent, EventType } from '../types';
import { createId } from '../utils/id';

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

  useEffect(() => {
    loadEvents().then(setEvents);
  }, []);

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

  async function handleSave() {
    if (!title.trim() || !date) {
      Alert.alert('Campos em falta', 'Adicione título e data no formato AAAA-MM-DD.');
      return;
    }

    const event: CalendarEvent = {
      id: editingId ?? createId('event'),
      title: title.trim(),
      date,
      type,
      notes: notes.trim() || undefined,
    };

    await persist(editingId ? events.map((item) => (item.id === editingId ? event : item)) : [...events, event]);
    resetForm();
  }

  function handleEdit(event: CalendarEvent) {
    setEditingId(event.id);
    setTitle(event.title);
    setDate(event.date);
    setType(event.type);
    setNotes(event.notes ?? '');
  }

  async function handleDelete(eventId: string) {
    await persist(events.filter((event) => event.id !== eventId));
  }

  return (
    <Screen>
      <Title>Calendário</Title>
      <Body>Eventos internos para consultas, vacinas, aniversários mensais, lembretes, marcos e autocuidado.</Body>

      <Card>
        <Heading>{editingId ? 'Editar evento' : 'Novo evento'}</Heading>
        <View style={styles.form}>
          <FormField label="Título" value={title} onChangeText={setTitle} placeholder={`Ex.: Consulta do ${baby.name}`} />
          <FormField label="Data" value={date} onChangeText={setDate} placeholder="AAAA-MM-DD" />
          <FormField label="Tipo" value={type} onChangeText={(value) => setType(value as EventType)} placeholder="consulta, vacina, marco..." />
          <FormField label="Notas" value={notes} onChangeText={setNotes} placeholder="Opcional" />
          <PrimaryButton label={editingId ? 'Guardar alterações' : 'Adicionar evento'} onPress={handleSave} />
          {editingId ? <PrimaryButton label="Cancelar edição" onPress={resetForm} variant="secondary" /> : null}
        </View>
      </Card>

      {events.map((event) => (
        <Card key={event.id}>
          <Caption>{event.date} · {event.type}</Caption>
          <Heading>{event.title}</Heading>
          {event.notes ? <Body>{event.notes}</Body> : null}
          <View style={styles.actions}>
            <PrimaryButton label="Editar" onPress={() => handleEdit(event)} variant="secondary" />
            <PrimaryButton label="Apagar" onPress={() => handleDelete(event.id)} variant="secondary" />
          </View>
        </Card>
      ))}

      <Caption style={styles.note}>Arquitetura preparada para futura integração com Google Calendar e Apple Calendar.</Caption>
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: spacing.md,
    marginTop: spacing.md,
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
