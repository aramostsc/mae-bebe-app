import { useState } from 'react';
import { Alert, StyleSheet, Switch, View } from 'react-native';

import { Card } from '../components/Card';
import { FormField } from '../components/FormField';
import { PrimaryButton } from '../components/PrimaryButton';
import { Screen } from '../components/Screen';
import { SelectChips } from '../components/SelectChips';
import { Body, Caption, Heading, Title } from '../components/Typography';
import { healthDisclaimer } from '../data/mockContent';
import { clearCareLogs } from '../services/careLogService';
import { clearEvents } from '../services/eventService';
import { requestNotificationPermission } from '../services/notificationService';
import { clearPhotos } from '../services/photoService';
import { clearProfiles, saveProfiles } from '../services/profileService';
import { colors, spacing } from '../theme';
import { AppProfiles, MainGoal } from '../types';
import { isFutureDate, isValidInputDate } from '../utils/validation';

type Props = {
  profiles: AppProfiles;
  onProfilesChange: (profiles: AppProfiles | null) => void;
};

export function SettingsScreen({ profiles, onProfilesChange }: Props) {
  const [motherName, setMotherName] = useState(profiles.mother.name);
  const [deliveryDate, setDeliveryDate] = useState(profiles.mother.deliveryDate);
  const [breastfeeding, setBreastfeeding] = useState(profiles.mother.breastfeeding);
  const [mainGoal, setMainGoal] = useState<MainGoal>(profiles.mother.mainGoal);
  const [babyName, setBabyName] = useState(profiles.baby.name);
  const [babyBirthDate, setBabyBirthDate] = useState(profiles.baby.birthDate);

  async function handleSave() {
    if (!motherName.trim() || !babyName.trim()) {
      Alert.alert('Campos em falta', 'O nome da mãe e do bebé não devem ficar vazios.');
      return;
    }

    if (!isValidInputDate(deliveryDate) || !isValidInputDate(babyBirthDate)) {
      Alert.alert('Data inválida', 'Use o formato AAAA-MM-DD, por exemplo 2026-07-10.');
      return;
    }

    if (isFutureDate(deliveryDate) || isFutureDate(babyBirthDate)) {
      Alert.alert('Data no futuro', 'As datas do parto e nascimento não devem estar no futuro.');
      return;
    }

    const nextProfiles: AppProfiles = {
      mother: {
        ...profiles.mother,
        name: motherName.trim(),
        deliveryDate,
        breastfeeding,
        mainGoal,
      },
      baby: {
        ...profiles.baby,
        name: babyName.trim(),
        birthDate: babyBirthDate,
      },
    };

    await saveProfiles(nextProfiles);
    onProfilesChange(nextProfiles);
    Alert.alert('Guardado', 'Perfis atualizados com sucesso.');
  }

  async function handleNotifications() {
    const granted = await requestNotificationPermission();
    Alert.alert(granted ? 'Notificações ativas' : 'Permissão não concedida');
  }

  function handleReset() {
    Alert.alert('Recomeçar app?', 'Isto apaga perfis, eventos, cuidados e fotos guardadas localmente neste dispositivo.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Apagar',
        style: 'destructive',
        onPress: async () => {
          await Promise.all([clearProfiles(), clearEvents(), clearPhotos(), clearCareLogs()]);
          onProfilesChange(null);
        },
      },
    ]);
  }

  return (
    <Screen>
      <Title>Definições</Title>

      <Card>
        <Heading>Perfil da mãe</Heading>
        <View style={styles.form}>
          <FormField label="Nome" value={motherName} onChangeText={setMotherName} />
          <FormField label="Data do parto" value={deliveryDate} onChangeText={setDeliveryDate} placeholder="AAAA-MM-DD" />
          <View style={styles.row}>
            <Body>Amamentação</Body>
            <Switch value={breastfeeding} onValueChange={setBreastfeeding} thumbColor={breastfeeding ? colors.primary : colors.border} />
          </View>
          <View style={styles.fieldGroup}>
            <Body>Objetivo principal</Body>
            <SelectChips
              value={mainGoal}
              onChange={setMainGoal}
              options={[
                { label: 'Recuperação', value: 'recuperacao' },
                { label: 'Energia', value: 'energia' },
                { label: 'Alimentação', value: 'alimentacao' },
                { label: 'Organização', value: 'organizacao' },
                { label: 'Memórias', value: 'memorias' },
                { label: 'Outro', value: 'outro' },
              ]}
            />
          </View>
        </View>
      </Card>

      <Card>
        <Heading>Perfil do bebé</Heading>
        <View style={styles.form}>
          <FormField label="Nome" value={babyName} onChangeText={setBabyName} />
          <FormField label="Data de nascimento" value={babyBirthDate} onChangeText={setBabyBirthDate} placeholder="AAAA-MM-DD" />
          <PrimaryButton label="Guardar perfis" onPress={handleSave} />
        </View>
      </Card>

      <Card>
        <Caption>Privacidade</Caption>
        <Heading>Dados neste dispositivo</Heading>
        <View style={styles.privacyList}>
          <Body>• Perfis da mãe e do bebé.</Body>
          <Body>• Agenda, marcos e lembretes.</Body>
          <Body>• Registos rápidos de cuidados.</Body>
          <Body>• Memórias, fotos e notas.</Body>
        </View>
        <Caption>Nesta fase do MVP, estes dados ficam guardados localmente. Ainda não há conta, cloud ou sincronização familiar.</Caption>
      </Card>

      <Card>
        <Caption>Permissões</Caption>
        <Heading>O que a app pode pedir</Heading>
        <View style={styles.privacyList}>
          <Body>• Câmara e galeria: apenas quando adicionas uma memória.</Body>
          <Body>• Notificações: apenas para lembretes locais.</Body>
        </View>
        <View style={styles.buttonGap}>
          <PrimaryButton label="Gerir notificações" onPress={handleNotifications} variant="secondary" />
        </View>
      </Card>

      <Card>
        <Caption>Compromisso</Caption>
        <Heading>O que evitamos</Heading>
        <View style={styles.privacyList}>
          <Body>• Não usamos anúncios nesta experiência.</Body>
          <Body>• Não vendemos ansiedade com alertas agressivos.</Body>
          <Body>• Não enviamos fotos ou dados do bebé para cloud sem decisão explícita futura.</Body>
        </View>
      </Card>

      <Card>
        <Heading>Exportação futura</Heading>
        <Body>Exportar dados, relatórios de cuidados e álbuns de memórias está preparado para uma fase futura.</Body>
      </Card>

      <Card>
        <Heading>Aviso de responsabilidade</Heading>
        <Body style={{ color: colors.warning }}>{healthDisclaimer}</Body>
      </Card>

      <Card>
        <Heading>Apagar dados locais</Heading>
        <Body>Use esta opção para testar a app desde o início ou apagar dados guardados neste dispositivo.</Body>
        <View style={styles.buttonGap}>
          <PrimaryButton label="Apagar dados e recomeçar" onPress={handleReset} variant="secondary" />
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: spacing.md,
    marginTop: spacing.md,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonGap: {
    marginTop: spacing.md,
  },
  fieldGroup: {
    gap: spacing.sm,
  },
  privacyList: {
    gap: spacing.sm,
    marginVertical: spacing.md,
  },
});
