import * as ImagePicker from 'expo-image-picker';
import { useEffect, useMemo, useState } from 'react';
import { Alert, Image, StyleSheet, View } from 'react-native';

import { Card } from '../components/Card';
import { FormField } from '../components/FormField';
import { PrimaryButton } from '../components/PrimaryButton';
import { Screen } from '../components/Screen';
import { Body, Caption, Heading, Title } from '../components/Typography';
import { loadPhotos, savePhotos } from '../services/photoService';
import { spacing } from '../theme';
import { BabyProfile, PhotoMemory } from '../types';
import { differenceInMonths } from '../utils/date';
import { createId } from '../utils/id';

type Props = {
  baby: BabyProfile;
};

export function GalleryScreen({ baby }: Props) {
  const [photos, setPhotos] = useState<PhotoMemory[]>([]);
  const [note, setNote] = useState('');

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

  async function addPhoto(uri: string) {
    const nextPhoto: PhotoMemory = {
      id: createId('photo'),
      uri,
      createdAt: new Date().toISOString(),
      babyAgeMonth: differenceInMonths(baby.birthDate),
      note: note.trim() || undefined,
    };
    const nextPhotos = [nextPhoto, ...photos];
    setPhotos(nextPhotos);
    setNote('');
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
      <Title>Memórias</Title>
      <Card>
        <Heading>Adicionar memória</Heading>
        <View style={styles.form}>
          <FormField label="Nota curta opcional" value={note} onChangeText={setNote} placeholder={`Ex.: Primeiro sorriso do ${baby.name}`} />
          <PrimaryButton label="Tirar foto" onPress={takePhoto} />
          <PrimaryButton label="Selecionar da galeria" onPress={pickPhoto} variant="secondary" />
        </View>
      </Card>

      {Object.keys(groupedPhotos).length === 0 ? (
        <Card>
          <Body>Ainda não há fotos guardadas.</Body>
        </Card>
      ) : (
        Object.entries(groupedPhotos)
          .sort(([a], [b]) => Number(b) - Number(a))
          .map(([month, monthPhotos]) => (
            <View key={month} style={styles.group}>
              <Heading>{month} meses</Heading>
              {monthPhotos.map((photo) => (
                <Card key={photo.id}>
                  <Image source={{ uri: photo.uri }} style={styles.image} />
                  {photo.note ? <Body>{photo.note}</Body> : null}
                  <Caption>{new Date(photo.createdAt).toLocaleDateString('pt-PT')}</Caption>
                  <PrimaryButton label="Apagar foto" onPress={() => deletePhoto(photo.id)} variant="secondary" />
                </Card>
              ))}
            </View>
          ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: spacing.md,
    marginTop: spacing.md,
  },
  group: {
    gap: spacing.md,
  },
  image: {
    aspectRatio: 1,
    borderRadius: 8,
    marginBottom: spacing.sm,
    width: '100%',
  },
});
