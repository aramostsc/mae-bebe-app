# Product Spec: Mãe & Bebé

## Visão

Criar uma aplicação mobile simples, privada e calma para apoiar mães no pós-parto e no acompanhamento dos primeiros anos do bebé, inicialmente em português de Portugal.

## Público

Mães no pós-parto, mães recentes e famílias que querem organizar rotinas, memórias, eventos e cuidados gerais.

## MVP

1. Onboarding com perfis da mãe e do bebé.
2. Dashboard com idade do bebé, tempo desde o parto, dica diária e próximos eventos.
3. Plano de treino pós-parto por fase.
4. Nutrição da mãe com sugestões gerais.
5. Alimentação do bebé por idade em meses.
6. Calendário interno com eventos editáveis.
7. Galeria local com fotos e notas.
8. Dicas por categoria.
9. Definições, notificações locais e aviso de responsabilidade.

## Princípios de produto

- Privacidade e confiança primeiro.
- Informação clara, sem promessas médicas absolutas.
- Interface calma, legível e fácil de usar com uma mão.
- Conteúdo útil mesmo sem backend.
- Preparação para cloud, família e integrações futuras.

## Dados do MVP

Os dados começam guardados localmente com AsyncStorage. A camada de `services` deve permitir futura migração para Firebase ou Supabase sem reescrever as telas.

## Sequência de implementação

1. Criar base Expo + TypeScript.
2. Criar navegação e estrutura de pastas.
3. Definir tipos e dados mockados.
4. Implementar onboarding e persistência local.
5. Implementar dashboard e cálculos de idade.
6. Implementar telas de conteúdo.
7. Implementar calendário e galeria.
8. Adicionar notificações locais.
9. Documentar e testar arranque local.

## Riscos técnicos

- Permissões de câmara, galeria e notificações variam entre Android e iOS.
- Armazenar apenas URI local de fotos pode ser frágil a longo prazo; cloud storage será necessário.
- Conteúdo de saúde precisa revisão profissional antes de produção.
- Integração com calendários nativos exige permissões e fluxos separados.
- Notificações locais podem variar conforme poupança de bateria no Android.

## Decisões pendentes

- Firebase vs Supabase.
- Login obrigatório vs modo local com backup opcional.
- Política de privacidade e consentimento.
- Conteúdo validado por profissionais.
- Suporte multi-bebé e partilha familiar.
