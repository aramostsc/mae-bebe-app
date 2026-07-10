# Mãe & Bebé

Aplicação mobile em Expo + React Native + TypeScript para apoiar mães no pós-parto e nos primeiros anos do bebé.

## Estado do MVP

- Onboarding com perfil da mãe e do bebé.
- Dashboard com idade do bebé, tempo desde o parto, dica diária e próximos eventos.
- Área de planos com treino pós-parto, nutrição da mãe, alimentação do bebé e dicas.
- Calendário interno com criar, editar e apagar eventos.
- Memórias com câmara/galeria, tipos de momento e organização por mês de idade.
- Agenda com vista mensal, eventos manuais e aniversários mensais automáticos.
- Definições com edição de perfis, notificações locais, aviso de responsabilidade e reset local.

## Arquitetura

```text
src/
  components/    Componentes visuais reutilizáveis
  data/          Conteúdo mockado e regras simples do MVP
  navigation/    Navegação principal
  screens/       Telas da aplicação
  services/      Persistência local, notificações e futura camada cloud
  types/         Tipos partilhados
  utils/         Cálculos de datas, validações e utilitários
```

## Dependências principais

- Expo
- React Native
- TypeScript
- React Navigation
- AsyncStorage
- Expo Image Picker
- Expo Camera
- Expo Notifications

## Instalação

```bash
npm install
npm run start
```

Para correr no browser:

```bash
npm run web
```

Depois, abra no Expo Go, num emulador Android ou no navegador. O projeto prioriza Android, mantendo compatibilidade iOS e suporte web para testes.

## Verificação

```bash
npm run typecheck
```

## Modelo de dados inicial

- `MotherProfile`: nome, data do parto, tipo de parto opcional, amamentação e objetivo principal.
- `BabyProfile`: nome, data de nascimento, sexo opcional, peso e altura opcionais.
- `CalendarEvent`: título, data, tipo e notas.
- `PhotoMemory`: URI local, data, mês de idade do bebé e nota.
- `Tip`: categoria, título e conteúdo.

## Decisões a validar

- Firebase ou Supabase para autenticação, base de dados e armazenamento de fotos.
- Se a app terá login obrigatório no primeiro lançamento ou modo local primeiro.
- Nível de personalização dos planos de treino e nutrição.
- Design visual final, incluindo ilustrações, logótipo e paleta.
- Políticas de privacidade, consentimento e retenção de fotos/dados.

## Aviso

A app não substitui médico, pediatra, nutricionista, fisioterapeuta pélvico ou outro profissional de saúde.
