---
id: task-005
title: Adicionar testes unitários para componentes e hooks não cobertos
status: in_progress
priority: 75
created_at: 2026-11-08
---

# Adicionar testes unitários para componentes e hooks não cobertos

## Contexto

Origem: diagnóstico de cobertura do projeto. Atualmente temos 28 testes em 5 arquivos (App.test.tsx, CardDetail.test.tsx, SearchInput.test.tsx, CardGrid.test.tsx, FilterBar.test.tsx), mas componentes e hooks fundamentais estão sem testes unitários dedicados:

- **Card.tsx** (83 linhas): funções auxiliares `getInitials` e `getClassColor` + renderização condicional não testadas
- **useCardFilter.ts** (42 linhas): lógica de filtragem sem testes diretos (apenas via integração no App)
- **App.tsx helpers** (linhas 24-38): `getAvailableClasses` e `getAvailableParts` não testados isoladamente

Problema: essas funções/hooks executam lógica de negócio importante mas dependem de testes de integração para cobertura, tornando mais difícil detectar regressões específicas.

## Descrição

Origem: diagnóstico de cobertura — Card.tsx (83 linhas), useCardFilter.ts (42 linhas) e helpers do App.tsx (linhas 24-38) sem testes dedicados.

Escopo:
- Criar src/components/Card.test.tsx (testar getInitials, getClassColor, renderização com/sem imagem)
- Criar src/hooks/useCardFilter.test.ts (testar filterCards com todos os filtros combinados, casos limites)
- Criar testes para getAvailableClasses e getAvailableParts (extrair para módulo testável ou testar via export)

Cobertura atual: 28 testes em 5 arquivos, todos de integração ou componentes complexos.

## Escopo

**Dentro do escopo:**

- Criar `src/components/Card.test.tsx` com testes para:
  - `getInitials`: nomes simples, múltiplas palavras, casos extremos (string vazia, espaços extras)
  - `getClassColor`: classes conhecidas, classe desconhecida (fallback)
  - Renderização do componente: com imagem, sem imagem (iniciais), cores da classe, aria-labels
- Criar `src/hooks/useCardFilter.test.ts` com testes para:
  - `filterCards`: cada filtro isolado (search, generation, axieClass, part)
  - Combinações de filtros
  - Casos limites: array vazio, search com trim, normalização case-insensitive
- Criar `src/utils/generation.ts` para extrair `getAvailableClasses` e `getAvailableParts` do App.tsx
- Criar `src/utils/generation.test.ts` com testes para:
  - `getAvailableClasses`: generation 'all', 'classic', 'origin', entrada não existente
  - `getAvailableParts`: mesmos casos

**Fora do escopo:**

- Testes de integração (já existem em App.test.tsx)
- Refatoração de componentes além da extração dos helpers
- Alteração da lógica existente (apenas adicionar testes)
- Testes de CSS ou estilos visuais

## Critérios de aceitação

- [x] Arquivo `src/components/Card.test.tsx` criado com no mínimo 8 testes cobrindo `getInitials`, `getClassColor` e renderização do componente (28 testes criados)
- [x] Arquivo `src/hooks/useCardFilter.test.ts` criado com no mínimo 6 testes cobrindo `filterCards` com filtros isolados e combinados (18 testes criados)
- [x] Arquivo `src/utils/generation.ts` criado com funções `getAvailableClasses` e `getAvailableParts` extraídas do App.tsx
- [x] Arquivo `src/utils/generation.test.ts` criado com no mínimo 4 testes cobrindo ambas as funções (11 testes criados)
- [x] App.tsx atualizado para importar as funções de `src/utils/generation.ts`
- [x] `npm test` executa com sucesso todos os testes (existentes + novos) - 85 testes em 8 arquivos
- [x] `npm run typecheck` passa sem erros
- [x] `npm run lint` passa sem warnings

## Plano de testes manuais

1. **Executar suite de testes completa**

```bash
npm test
```

Esperado: Todos os testes passam, incluindo os novos arquivos (Card.test.tsx, useCardFilter.test.ts, generation.test.ts)

Verificar: Output deve mostrar `Test Files X passed (X)` e `Tests Y passed (Y)` sem falhas

2. **Verificar typecheck**

```bash
npm run typecheck
```

Esperado: Compilação TypeScript bem-sucedida sem erros

Verificar: Nenhum erro de tipo reportado

3. **Verificar linting**

```bash
npm run lint
```

Esperado: Código passa nas regras do ESLint sem warnings

Verificar: Saída limpa sem avisos ou erros

4. **Confirmar que a aplicação ainda funciona**

```bash
npm run dev
```

Esperado: Servidor dev inicia na porta 2943 sem erros

Verificar: Abrir http://localhost:2943 e confirmar que a aplicação carrega e funciona normalmente

## Notas

**Memória consultada (2026-11-08):**
- Etiquetas verificadas: `docs/rules/` (nenhuma encontrada)
- Decisões verificadas: `riteward decision list` (nenhuma encontrada)
- Conclusão: primeiro trabalho estruturado em testes unitários — sem histórico prévio para reaproveitar

**Auditoria do corpo da task (2026-11-08 18:36):**
- Rodada 1: Corpo completo, todos os placeholders preenchidos com informações reais do código
- Contexto: origem clara, problema identificado
- Escopo: dentro/fora explícitos, 4 arquivos a criar
- Critérios: 8 critérios verificáveis
- Testes manuais: 4 passos com comandos copiáveis e sem placeholders
- Status: pronto para criar artefato de contexto

**Investigação DISCOVERY (2026-11-08 18:37):**
- Artefato de contexto criado: `.riteward/contexts/task-005.md`
- Código investigado: Card.tsx, useCardFilter.ts, App.tsx, testes existentes, configuração
- Refactor scan executado: nenhum arquivo monolítico detectado
- Riscos mapeados: extração de helpers, exportação de funções, dependência de dados JSON
- Decisão tomada: exportar funções auxiliares de Card.tsx (Opção A) para facilitar testes unitários puros
- Contexto completo e pronto para congelar ao avançar para PLANNING

**Implementação IMPLEMENTATION (2026-11-08 18:40-18:45):**
- Passo 1: Funções `getInitials` e `getClassColor` exportadas de Card.tsx
- Passo 2: Card.test.tsx criado com 28 testes (excedeu mínimo de 8)
  - Desvio: teste inicial falhou porque `getInitials('Anemone')` retorna 'A' (uma inicial) não 'AN' (duas letras). A função pega primeira letra de cada palavra, não duas letras de uma palavra. Testes corrigidos para refletir comportamento real.
- Passo 3: useCardFilter.test.ts criado com 18 testes (excedeu mínimo de 6)
- Passo 4: src/utils/generation.ts criado com funções extraídas
- Passo 5: App.tsx atualizado para importar de utils/generation
- Passo 6: generation.test.ts criado com 11 testes (excedeu mínimo de 4)
  - Desvio: testes iniciais falharam porque eu usei 'origin' mas o tipo correto é 'origin-v3'. Corrigido após ler types/card.ts e descobrir que `Generation = 'classic' | 'origin-v3'`
  - Desvio: parts.json tem array vazio para 'classic', então teste ajustado para verificar array vazio em vez de esperar partes
- Passo 7: Suite completa validada - 85 testes em 8 arquivos (eram 28 em 5), todos passando
- Passo 8: Quality gates validados
  - Correção necessária: import não usado `GenerationFilter` em useCardFilter.test.ts removido para passar no lint
- Todos os critérios de aceitação marcados como concluídos
- Total de novos testes: 57 (28+18+11), superando o mínimo de 18 planejado

**Auditoria de testes TESTING (2026-11-08 18:46):**
- Arquivos de teste criados/modificados conferidos:
  - `src/components/Card.test.tsx` (criado): 28 testes cobrindo getInitials, getClassColor e renderização. Motivo: adição de cobertura unitária conforme plano.
  - `src/hooks/useCardFilter.test.ts` (criado): 18 testes cobrindo filterCards com filtros isolados, combinados e edge cases. Motivo: adição de cobertura unitária conforme plano.
  - `src/utils/generation.test.ts` (criado): 11 testes cobrindo getAvailableClasses e getAvailableParts. Motivo: adição de cobertura unitária conforme plano.
- Nenhum teste removido, pulado, comentado ou esvaziado
- Todos os 3 novos arquivos de teste justificados: criados para atingir objetivo da task
- `riteward check` executado: PASS (test, lint, typecheck)
- Auditoria completa: todos os testes criados têm motivo registrado em ## Notas

_Notas sobre o progresso aqui; decisões relevantes viram registros via `riteward decision create`._
