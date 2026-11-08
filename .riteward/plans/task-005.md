# Plano — Adicionar testes unitários para componentes e hooks não cobertos (task-005)

Descreva o plano técnico usando esta estrutura. Metadados no topo:

- task: task-005
- author: Kiro (agente de código)
- created_at: 2026-11-08

## Contexto

O projeto possui 28 testes em 5 arquivos, todos focados em testes de integração ou componentes complexos (App.test.tsx, CardDetail.test.tsx, SearchInput.test.tsx, CardGrid.test.tsx, FilterBar.test.tsx). No entanto, três áreas com lógica de negócio importante carecem de testes unitários dedicados:

1. **Card.tsx**: funções auxiliares `getInitials` e `getClassColor` não testadas isoladamente
2. **useCardFilter.ts**: função pura `filterCards` só coberta via testes de integração
3. **App.tsx**: funções helper `getAvailableClasses` e `getAvailableParts` definidas dentro do componente, sem testes diretos

Esta dependência exclusiva de testes de integração dificulta a detecção de regressões específicas e o diagnóstico de falhas. Este plano adiciona cobertura unitária para essas áreas, facilitando manutenção futura.

## Objetivo

Adicionar testes unitários para componentes e hooks não cobertos, atingindo:
- Mínimo de 18 novos testes distribuídos em 3 arquivos (Card.test.tsx, useCardFilter.test.ts, generation.test.ts)
- Cobertura direta de todas as funções auxiliares e lógica de negócio identificadas
- Todos os quality gates passando (test, typecheck, lint)

## Abordagem

**Estratégia:** Adicionar testes unitários para funções e hooks existentes, com mínima refatoração necessária para testabilidade.

1. **Exportar funções auxiliares de Card.tsx**: adicionar `export` a `getInitials` e `getClassColor` para possibilitar testes unitários diretos, mantendo-as no mesmo arquivo
2. **Extrair helpers de App.tsx**: mover `getAvailableClasses` e `getAvailableParts` para novo módulo `src/utils/generation.ts`, tornando-as testáveis isoladamente
3. **Testar função pura existente**: `filterCards` já é exportada de `useCardFilter.ts`, basta criar os testes
4. **Seguir padrão existente**: usar vitest + @testing-library/react, describe/it/expect, como os testes atuais do projeto
5. **Usar dados reais**: importar classes.json e parts.json nos testes de generation.ts para garantir integração correta

Esta abordagem minimiza mudanças no código de produção (apenas exports e extração) enquanto maximiza a cobertura de testes unitários.

## Alternativas consideradas

1. **Manter funções privadas e testar apenas via integração**: continuar sem exportar `getInitials` e `getClassColor`, testando-as apenas indiretamente através dos testes de renderização do componente Card. Descartada porque dificulta o diagnóstico de falhas específicas nessas funções e não atende ao objetivo da task de adicionar testes unitários diretos.

2. **Criar módulo utils separado para funções de Card**: extrair `getInitials` e `getClassColor` para `src/utils/card.ts` em vez de apenas exportá-las. Descartada porque adiciona complexidade desnecessária — as funções são específicas do componente Card e não têm reuso em outros lugares, então mantê-las no mesmo arquivo é mais coeso.

3. **Mockar dados JSON nos testes de generation.ts**: criar fixtures mock para testar `getAvailableClasses` e `getAvailableParts`. Descartada porque usar os dados reais (classes.json e parts.json) garante que os testes validam a integração correta com a estrutura de dados real, detectando problemas de schema.

## Componentes do recurso

Nenhum componente afetado.

## Passos

1. **Exportar funções auxiliares de Card.tsx**
   - Onde: `src/components/Card.tsx` linhas 15 e 24
   - Adicionar `export` antes de `function getInitials` e `function getClassColor`
   - Como verificar: `npm run typecheck` passa sem erros

2. **Criar testes para Card.tsx**
   - Onde: criar `src/components/Card.test.tsx`
   - Testes a implementar (mínimo 8):
     - `getInitials`: nome simples ("Anemone" → "AN"), múltiplas palavras ("Pumpkin Head" → "PH"), mais de 2 palavras (pega só 2 primeiras), string vazia, espaços extras
     - `getClassColor`: classes conhecidas (Plant, Bird, Aquatic, etc.), classe desconhecida retorna '#888'
     - Renderização do componente: com imagem (mostra label), sem imagem (mostra iniciais), aria-labels corretos, cores aplicadas ao tier e borda
   - Como verificar: `npm test` executa os novos testes

3. **Criar testes para useCardFilter.ts**
   - Onde: criar `src/hooks/useCardFilter.test.ts`
   - Testes a implementar (mínimo 6):
     - `filterCards` com cada filtro isolado: generation (classic/origin/all), axieClass, part, search
     - Combinações de filtros: generation + axieClass, search + generation, todos juntos
     - Casos limites: array vazio, search com espaços extras (trim), normalização case-insensitive
   - Como verificar: `npm test` executa os novos testes

4. **Extrair funções helper para módulo utils**
   - Onde: criar `src/utils/generation.ts`
   - Mover `getAvailableClasses` e `getAvailableParts` de `src/App.tsx` (linhas 24-38) para o novo módulo
   - Adicionar imports necessários: `GenerationFilter` de `../types/card`, dados de `../data/classes.json` e `../data/parts.json`
   - Como verificar: `npm run typecheck` passa sem erros

5. **Atualizar App.tsx para usar o novo módulo**
   - Onde: `src/App.tsx`
   - Remover definições das funções (linhas 24-38)
   - Adicionar import: `import { getAvailableClasses, getAvailableParts } from './utils/generation'`
   - Como verificar: `npm run dev` inicia sem erros, aplicação funciona normalmente

6. **Criar testes para generation.ts**
   - Onde: criar `src/utils/generation.test.ts`
   - Testes a implementar (mínimo 4):
     - `getAvailableClasses`: generation='all' (retorna união de todas), generation='classic' (retorna só classes classic), generation='origin' (retorna só classes origin), generation inválido (retorna array vazio)
     - `getAvailableParts`: mesmos casos de teste
   - Usar dados reais importados de classes.json e parts.json
   - Como verificar: `npm test` executa os novos testes

7. **Validar suite completa de testes**
   - Onde: raiz do projeto
   - Executar `npm test` e confirmar que todos os 28 testes existentes + novos (mínimo 18) passam
   - Como verificar: output mostra "Test Files X passed" e "Tests Y passed" sem falhas

8. **Validar quality gates**
   - Onde: raiz do projeto
   - Executar `npm run typecheck` (deve passar sem erros)
   - Executar `npm run lint` (deve passar sem warnings)
   - Como verificar: ambos os comandos retornam sucesso

## Riscos

1. **Quebra de encapsulamento ao exportar funções privadas**
   - Risco: exportar `getInitials` e `getClassColor` pode levar outros módulos a usá-las indevidamente
   - Mitigação: as funções continuam no mesmo arquivo de Card.tsx (não em utils compartilhado), sinalizando que são específicas do componente; documentar na revisão de código que são exportadas apenas para testes
   
2. **Quebra de testes de integração existentes após extração**
   - Risco: mover funções de App.tsx pode quebrar testes existentes em App.test.tsx
   - Mitigação: rodar `npm test` após cada passo; App.test.tsx não testa as funções helper diretamente, então a extração não deve afetar

3. **Dependência de dados JSON nos testes**
   - Risco: mudanças em classes.json ou parts.json podem quebrar testes de generation.ts
   - Mitigação: aceitável — essa dependência garante que os testes validam a integração real; se o schema mudar, os testes devem falhar para alertar sobre inconsistências

4. **Quantidade de testes pode ser insuficiente**
   - Risco: mínimo de 18 testes pode não cobrir todos os edge cases
   - Mitigação: os números mínimos garantem cobertura básica; expandir cobertura pode ser feito em task futura se necessário

## Critérios de sucesso

Os 8 critérios de aceitação da task estão mapeados nos Passos:

- [ ] Arquivo `src/components/Card.test.tsx` criado com no mínimo 8 testes cobrindo `getInitials`, `getClassColor` e renderização do componente (Passo 2)
- [ ] Arquivo `src/hooks/useCardFilter.test.ts` criado com no mínimo 6 testes cobrindo `filterCards` com filtros isolados e combinados (Passo 3)
- [ ] Arquivo `src/utils/generation.ts` criado com funções `getAvailableClasses` e `getAvailableParts` extraídas do App.tsx (Passo 4)
- [ ] Arquivo `src/utils/generation.test.ts` criado com no mínimo 4 testes cobrindo ambas as funções (Passo 6)
- [ ] App.tsx atualizado para importar as funções de `src/utils/generation.ts` (Passo 5)
- [ ] `npm test` executa com sucesso todos os testes (existentes + novos) (Passo 7)
- [ ] `npm run typecheck` passa sem erros (Passo 8)
- [ ] `npm run lint` passa sem warnings (Passo 8)

## Revisões

- **Iteração 1 (2026-11-08 18:40)**: Plano inicial criado com base na conclusão da investigação do contexto congelado. Todos os 8 passos mapeados, 4 riscos identificados com mitigação, 3 alternativas consideradas e descartadas. Verificação dos arquivos citados:
  - `src/components/Card.tsx` existe (lido durante DISCOVERY)
  - `src/hooks/useCardFilter.ts` existe (lido durante DISCOVERY)
  - `src/App.tsx` existe (lido durante DISCOVERY)
  - `src/data/classes.json` e `src/data/parts.json` existem (mencionados na investigação)
  - Comandos `npm test`, `npm run typecheck`, `npm run lint`, `npm run dev` verificados no package.json
  - Todos os 8 critérios de aceitação da task cobertos nos passos
  - Sem placeholders remanescentes

## Aprovação

- [x] Plano auto-auditado (critérios mapeados, arquivos verificados e sem placeholders)
