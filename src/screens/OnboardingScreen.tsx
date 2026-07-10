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
import { colors, radii, spacing } from '../theme';
import { AppProfiles, BirthType, MainGoal } from '../types';
import { createId } from '../utils/id';
import { isFutureDate, isPositiveNumberText, isValidInputDate } from '../utils/validation';

type Props = {
  onComplete: (profiles: AppProfiles) => void;
};

type OnboardingStep = 'welcome' | 'mother' | 'baby' | 'review';

const stepOrder: OnboardingStep[] = ['welcome', 'mother', 'baby', 'review'];

export function OnboardingScreen({ onComplete }: Props) {
  const [step, setStep] = useState<OnboardingStep>('welcome');
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

  const stepIndex = stepOrder.indexOf(step);

  function goBack() {
    setStep(stepOrder[Math.max(0, stepIndex - 1)]);
  }

  function goNext() {
    if (step === 'mother' && !validateMother()) {
      return;
    }

    if (step === 'baby' && !validateBaby()) {
      return;
    }

    setStep(stepOrder[Math.min(stepOrder.length - 1, stepIndex + 1)]);
  }

  function validateMother() {
    if (!motherName.trim() || !deliveryDate) {
      Alert.alert('Campos em falta', 'Preenche o nome da mãe e a data do parto.');
      return false;
    }

    if (!isValidInputDate(deliveryDate)) {
      Alert.alert('Data inválida', 'Usa o formato AAAA-MM-DD, por exemplo 2026-07-10.');
      return false;
    }

    if (isFutureDate(deliveryDate)) {
      Alert.alert('Data no futuro', 'A data do parto não deve estar no futuro.');
      return false;
    }

    return true;
  }

  function validateBaby() {
    if (!babyName.trim() || !babyBirthDate) {
      Alert.alert('Campos em falta', 'Preenche o nome do bebé e a data de nascimento.');
      return false;
    }

    if (!isValidInputDate(babyBirthDate)) {
      Alert.alert('Data inválida', 'Usa o formato AAAA-MM-DD, por exemplo 2026-07-10.');
      return false;
    }

    if (isFutureDate(babyBirthDate)) {
      Alert.alert('Data no futuro', 'A data de nascimento não deve estar no futuro.');
      return false;
    }

    if (babyBirthDate < deliveryDate) {
      Alert.alert('Datas a rever', 'A data de nascimento do bebé não deve ser anterior à data do parto.');
      return false;
    }

    if (!isPositiveNumberText(weight) || !isPositiveNumberText(height)) {
      Alert.alert('Medidas inválidas', 'Peso e altura devem ser números positivos quando preenchidos.');
      return false;
    }

    return true;
  }

  async function handleSubmit() {
    if (!validateMother() || !validateBaby()) {
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
      <View style={styles.progressWrap}>
        {stepOrder.map((item, index) => (
          <View key={item} style={[styles.progressDot, index <= stepIndex && styles.progressDotActive]} />
        ))}
      </View>

      {step === 'welcome' ? (
        <>
          <View style={styles.hero}>
            <Caption>Mãe & Bebé</Caption>
            <Title>Apoio calmo para os primeiros passos da maternidade</Title>
            <Body>
              Vamos começar com o essencial. Não precisa de ficar perfeito agora; podes ajustar estes dados mais tarde.
            </Body>
          </View>

          <View style={styles.welcomeBox}>
            <Heading>Um lugar para respirar</Heading>
            <Body>
              A app vai ajudar-te a acompanhar o pós-parto, o bebé, a agenda e as memórias, sem substituir profissionais de saúde.
            </Body>
          </View>

          <Caption style={styles.disclaimer}>{healthDisclaimer}</Caption>
          <PrimaryButton label="Começar com calma" onPress={goNext} />
        </>
      ) : null}

      {step === 'mother' ? (
        <Card>
          <Caption>Passo 1 de 3</Caption>
          <Heading>Sobre a mãe</Heading>
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
      ) : null}

      {step === 'baby' ? (
        <Card>
          <Caption>Passo 2 de 3</Caption>
          <Heading>Sobre o bebé</Heading>
          <View style={styles.form}>
            <FormField label="Nome" value={babyName} onChangeText={setBabyName} placeholder="Ex.: Mateus" />
            <FormField label="Data de nascimento" value={babyBirthDate} onChangeText={setBabyBirthDate} placeholder="AAAA-MM-DD" />
            <FormField label="Sexo opcional" value={babySex} onChangeText={setBabySex} placeholder="feminino, masculino..." />
            <FormField label="Peso opcional em kg" value={weight} onChangeText={setWeight} keyboardType="decimal-pad" />
            <FormField label="Altura opcional em cm" value={height} onChangeText={setHeight} keyboardType="decimal-pad" />
          </View>
        </Card>
      ) : null}

      {step === 'review' ? (
        <Card>
          <Caption>Passo 3 de 3</Caption>
          <Heading>Está tudo pronto</Heading>
          <View style={styles.reviewList}>
            <Body>Mãe: {motherName}</Body>
            <Body>Bebé: {babyName}</Body>
            <Body>Parto: {deliveryDate}</Body>
            <Body>Nascimento: {babyBirthDate}</Body>
          </View>
          <Caption>Depois podes alterar estes dados em Definições.</Caption>
        </Card>
      ) : null}

      {step !== 'welcome' ? (
        <View style={styles.actions}>
          <PrimaryButton label="Voltar" onPress={goBack} variant="secondary" />
          <PrimaryButton label={step === 'review' ? 'Entrar na app' : 'Continuar'} onPress={step === 'review' ? handleSubmit : goNext} />
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  progressWrap: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  progressDot: {
    backgroundColor: colors.border,
    borderRadius: 999,
    flex: 1,
    height: 6,
  },
  progressDotActive: {
    backgroundColor: colors.primary,
  },
  hero: {
    gap: spacing.sm,
  },
  welcomeBox: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.lg,
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
  actions: {
    gap: spacing.sm,
  },
  reviewList: {
    gap: spacing.sm,
    marginVertical: spacing.md,
  },
  disclaimer: {
    color: colors.warning,
  },
});
