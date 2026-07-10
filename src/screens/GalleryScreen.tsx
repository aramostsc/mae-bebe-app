import * as ImagePicker from 'expo-image-picker';
import { useEffect, useMemo, useState } from 'react';
import { Alert, Image, StyleSheet, View } from 'react-native';

import { Card } from '../components/Card';
import { FormField } from '../components/FormField';
import { PrimaryButton } from '../components/PrimaryButton';
import { Screen } from '../components/Screen';
import { SelectChips } from '../components/SelectChips';
import { Body, Caption, Heading, Title } from '../components/Typography';
import { loadPhotos, savePhotos } from '../services/photoService';
import { colors, radii, spacing } from '../theme';
import { BabyProfile, PhotoMemory } from '../types';
import { differenceInMonths, formatBabyAge } from '../utils/date';
import { createId } from '../utils/id';

type Props = {
  baby: BabyProfile;
};

type MemoryMood = NonNullable<PhotoMemory['mood']>;

const moodLabels: Record<MemoryMood, string> = {
  marco: 'Marco',
  ternura: 'Ternura',
  rotina: 'Rotina',
  descoberta: 'Descoberta',
  familia: 'Família',
};

export function GalleryScreen({ baby }: Props) {
  const [photos, setPhotos] = useState<PhotoMemory[]>([]);
  const [note, setNote] = useState('');
  const [mood, setMood] = useState<MemoryMood>('ternura');
  const babyAgeMonths = differenceInMonths(baby.birthDate);

  useEffect(() => {
    loadPhotos().then(setPhotos);
  }, []);

  const groupedPhotos = useMemo(() => {
    return photos.reduce<Record<number, PhotoMemory[]>>((groups, photo) => {
      groups[photo.babyAgeMonth] = groups[photo.babyAgeMonth] ?? [];
      groups[photo.babyAgeMonth].push(photo);
      return groups;
    }, {});
  }, [photos]);

  const latestPhoto = photos[0];

  async function addPhoto(uri: string) {
    const nextPhoto: PhotoMemory = {
      id: createId('photo'),
      uri,
      createdAt: new Date().toISOString(),
      babyAgeMonth: babyAgeMonths,
      note: note.trim() || undefined,
      mood,
    };
    const nextPhotos = [nextPhoto, ...photos];
    setPhotos(nextPhotos);
    setNote('');
    setMood('ternura');
    await savePhotos(nextPhotos);
  }

  async function pickPhoto() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permissão necessária', 'Autorize o acesso à galeria para selecionar fotos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled) {
      await addPhoto(result.assets[0].uri);
    }
  }

  async function takePhoto() {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permissão necessária', 'Autorize o acesso à câmara para tirar fotos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      await addPhoto(result.assets[0].uri);
    }
  }

  async function deletePhoto(photoId: string) {
    const nextPhotos = photos.filter((photo) => photo.id !== photoId);
    setPhotos(nextPhotos);
    await savePhotos(nextPhotos);
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Caption>{baby.name} tem {formatBabyAge(baby.birthDate)}</Caption>
        <Title>Memórias</Title>
        <Body>Um lugar para guardar pequenos momentos sem pressão de fazer um álbum perfeito.</Body>
      </View>

      <View style={styles.summaryRow}>
        <View style={styles.summaryItem}>
          <Caption>Total</Caption>
          <Heading>{photos.length}</Heading>
        </View>
        <View style={styles.summaryItem}>
          <Caption>Fase atual</Caption>
          <Heading>{babyAgeMonths} meses</Heading>
        </View>
      </View>

      <Card>
        <Heading>Guardar um momento</Heading>
        <View style={styles.form}>
          <View style={styles.fieldGroup}>
            <Caption>Tipo de memória</Caption>
            <SelectChips
              value={mood}
              onChange={setMood}
              options={[
                { label: 'Ternura', value: 'ternura' },
                { label: 'Marco', value: 'marco' },
                { label: 'Rotina', value: 'rotina' },
                { label: 'Descoberta', value: 'descoberta' },
                { label: 'Família', value: 'familia' },
              ]}
            />
          </View>
          <FormField label="Nota curta opcional" value={note} onChangeText={setNote} placeholder={`Ex.: Primeiro sorriso do ${baby.name}`} />
          <PrimaryButton label="Tirar foto" onPress={takePhoto} />
          <PrimaryButton label="Selecionar da galeria" onPress={pickPhoto} variant="secondary" />
        </View>
      </Card>

      {!latestPhoto ? (
        <View style={styles.emptyState}>
          <Heading>A primeira memória pode ser simples.</Heading>
          <Body>Uma foto, uma frase curta, ou só um momento que não queres perder no meio do cansaço.</Body>
        </View>
      ) : null}

      {Object.keys(groupedPhotos).length === 0 ? null : (
        Object.entries(groupedPhotos)
          .sort(([a], [b]) => Number(b) - Number(a))
          .map(([month, monthPhotos]) => (
            <View key={month} style={styles.group}>
              <View style={styles.groupHeader}>
                <Heading>{month} meses</Heading>
                <Caption>{monthPhotos.length} {monthPhotos.length === 1 ? 'memória' : 'memórias'}</Caption>
              </View>
              {monthPhotos.map((photo) => (
                <Card key={photo.id}>
                  <Image source={{ uri: photo.uri }} style={styles.image} />
                  <Caption>
                    {photo.mood ? moodLabels[photo.mood] : 'Memória'} · {new Date(photo.createdAt).toLocaleDateString('pt-PT')}
                  </Caption>
                  {photo.note ? <Body>{photo.note}</Body> : <Body style={styles.softText}>Sem nota. E está tudo bem.</Body>}
                  <View style={styles.photoAction}>
                    <PrimaryButton label="Apagar foto" onPress={() => deletePhoto(photo.id)} variant="secondary" />
                  </View>
                </Card>
              ))}
            </View>
          ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.sm,
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
  form: {
    gap: spacing.md,
    marginTop: spacing.md,
  },
  fieldGroup: {
    gap: spacing.sm,
  },
  emptyState: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.lg,
  },
  group: {
    gap: spacing.md,
  },
  groupHeader: {
    gap: spacing.xs,
  },
  image: {
    aspectRatio: 1,
    borderRadius: 8,
    marginBottom: spacing.sm,
    width: '100%',
  },
  photoAction: {
    marginTop: spacing.md,
  },
  softText: {
    color: colors.muted,
  },
});
