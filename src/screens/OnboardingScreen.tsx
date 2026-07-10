import { useState } from 'react';
import { Alert, StyleSheet, Switch, View } from 'react-native';

import { Card } from '../components/Card';
import { FormField } from '../components/FormField';
import { PrimaryButton } from '../components/PrimaryButton';
import { Screen } from '../components/Screen';
import { SelectChips } from '../components/SelectChips';
import { Body, Caption, Heading, Title } from '../components/Typography';
import { healthDisclaimer } from '../data/mockContent';
import { saveProfiles } from '../services/profileService';
import { colors, spacing } from '../theme';
import { AppProfiles, BirthType, MainGoal } from '../types';
import { createId } from '../utils/id';
import { isFutureDate, isPositiveNumberText, isValidInputDate } from '../utils/validation';

type Props = {
  onComplete: (profiles: AppProfiles) => void;
};

export function OnboardingScreen({ onComplete }: Props) {
  const [motherName, setMotherName] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [birthType, setBirthType] = useState<BirthType>('');
  const [breastfeeding, setBreastfeeding] = useState(true);
  const [mainGoal, setMainGoal] = useState<MainGoal>('recuperacao');
  const [babyName, setBabyName] = useState('');
  const [babyBirthDate, setBabyBirthDate] = useState('');
  const [babySex, setBabySex] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');

  async function handleSubmit() {
    if (!motherName.trim() || !deliveryDate || !babyName.trim() || !babyBirthDate) {
      Alert.alert('Campos em falta', 'Preencha o nome da mãe, data do parto, nome do bebé e data de nascimento.');
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

    if (!isPositiveNumberText(weight) || !isPositiveNumberText(height)) {
      Alert.alert('Medidas inválidas', 'Peso e altura devem ser números positivos quando preenchidos.');
      return;
    }

    const profiles: AppProfiles = {
      mother: {
        id: createId('mother'),
        name: motherName.trim(),
        deliveryDate,
        birthType,
        breastfeeding,
        mainGoal,
      },
      baby: {
        id: createId('baby'),
        name: babyName.trim(),
        birthDate: babyBirthDate,
        sex: babySex as AppProfiles['baby']['sex'],
        weightKg: weight ? Number(weight.replace(',', '.')) : undefined,
        heightCm: height ? Number(height.replace(',', '.')) : undefined,
      },
    };

    await saveProfiles(profiles);
    onComplete(profiles);
  }

  return (
    <Screen>
      <View style={styles.hero}>
        <Caption>Mãe & Bebé</Caption>
        <Title>Apoio calmo para os primeiros passos da maternidade</Title>
        <Body>{healthDisclaimer}</Body>
      </View>

      <Card>
        <Heading>Perfil da mãe</Heading>
        <View style={styles.form}>
          <FormField label="Nome" value={motherName} onChangeText={setMotherName} placeholder="Ex.: Ana" />
          <FormField label="Data do parto" value={deliveryDate} onChangeText={setDeliveryDate} placeholder="AAAA-MM-DD" />
          <View style={styles.fieldGroup}>
            <Caption>Tipo de parto opcional</Caption>
            <SelectChips
              value={birthType}
              onChange={setBirthType}
              options={[
                { label: 'Por definir', value: '' },
                { label: 'Vaginal', value: 'vaginal' },
                { label: 'Cesariana', value: 'cesariana' },
                { label: 'Instrumentado', value: 'instrumentado' },
                { label: 'Outro', value: 'outro' },
              ]}
            />
          </View>
          <View style={styles.row}>
            <Body>Amamentação</Body>
            <Switch value={breastfeeding} onValueChange={setBreastfeeding} thumbColor={breastfeeding ? colors.primary : colors.border} />
          </View>
          <View style={styles.fieldGroup}>
            <Caption>Objetivo principal</Caption>
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
          <FormField label="Nome" value={babyName} onChangeText={setBabyName} placeholder="Ex.: Mateus" />
          <FormField label="Data de nascimento" value={babyBirthDate} onChangeText={setBabyBirthDate} placeholder="AAAA-MM-DD" />
          <FormField label="Sexo opcional" value={babySex} onChangeText={setBabySex} placeholder="feminino, masculino..." />
          <FormField label="Peso opcional em kg" value={weight} onChangeText={setWeight} keyboardType="decimal-pad" />
          <FormField label="Altura opcional em cm" value={height} onChangeText={setHeight} keyboardType="decimal-pad" />
        </View>
      </Card>

      <PrimaryButton label="Começar" onPress={handleSubmit} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    gap: spacing.sm,
  },
  form: {
    gap: spacing.md,
    marginTop: spacing.md,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fieldGroup: {
    gap: spacing.sm,
  },
});
