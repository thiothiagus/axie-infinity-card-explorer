# Contexto — Adicionar funcionalidade de ordenação de cartas (task-008)

Registre a investigação da tarefa usando esta estrutura. É o artefato da
DISCOVERY: criado no início da etapa, preenchido durante ela e congelado ao
avançar para PLANNING — o plano consome este registro em vez de re-derivar o
contexto. Metadados no topo:

- task: task-008
- author: Kiro (agente)
- created_at: 2026-11-08T19:44

## Problema

Origem: gap de funcionalidade identificado durante desenvolvimento.

Evidência: o projeto possui 198 cartas com sistema de filtros funcionando (busca por nome, filtro por geração/classe/parte via `useCardFilter` em `src/hooks/useCardFilter.ts`), mas sem opção de ordenação. As cartas aparecem na ordem original do JSON (`src/data/cards.json`). 

Situação atual verificada em `src/App.tsx` (linhas 22-65):
- Estado gerencia: `search`, `generation`, `axieClass`, `part`
- `filteredCards` retorna resultado do hook `useCardFilter`
- Não há estado nem lógica de ordenação
- `CardGrid` recebe `cards` diretamente sem transformação adicional

Usuários podem filtrar mas não podem reorganizar os resultados por critérios como nome alfabético, tier ou HP.

## Memória consultada

Etiquetas consultadas no SETUP:
- `docs/rules/` — nenhuma etiqueta de memória encontrada (diretório não existe)
- `riteward decision list` — nenhuma decisão registrada ainda

Contexto: projeto novo sem memória acumulada. Investigação baseada no código existente.

## Código lido

- **`src/App.tsx`** (linhas 1-74) — Ponto de entrada da aplicação. Gerencia estado de filtros (`search`, `generation`, `axieClass`, `part`) e chama `useCardFilter` para obter cartas filtradas. Renderiza `SearchInput`, `FilterBar` e `CardGrid`. Aqui será adicionado o estado de ordenação e o novo componente `SortControl`.

- **`src/hooks/useCardFilter.ts`** (linhas 1-42) — Hook que aplica filtros nas cartas. Exporta `filterCards` (função pura) e `useCardFilter` (hook com `useMemo`). Retorna array filtrado mas não ordenado. Aqui será adicionada a lógica de ordenação ou criado hook separado `useCardSort`.

- **`src/types/card.ts`** (linhas 1-25) — Define tipos `Card`, `Stats`, `Generation` e `GenerationFilter`. Campos relevantes para ordenação: `name` (string), `tier` (string | null), `stats.HP` (number quando stats existe, null caso contrário). Pode precisar de novo tipo `SortCriteria` e `SortDirection`.

- **`src/components/CardGrid.tsx`** (linhas 1-33) — Componente que renderiza grid de cartas. Recebe `cards` como prop e mapeia renderizando `Card` para cada item. Não precisa de alteração, mas receberá array já ordenado.

- **`src/components/FilterBar.tsx`** (linhas 1-106) — Componente de filtros usando chips/botões. Padrão visual: grupos com label + chips. Serve de referência para criar `SortControl` com estilo consistente.

- **`src/components/SearchInput.tsx`** (linhas 1-35) — Componente de busca com input e botão de limpar. Usa `memo` e props controladas. Referência de padrão de componente controlado.

- **`src/data/cards.json`** — 198 cartas em formato JSON array. Verificado durante leitura de código que campos relevantes existem (name sempre presente, tier e stats.HP podem ser null).

## Superfície de composição

Nenhum componente afetado. Esta task adiciona funcionalidade nova (ordenação) sem remover, migrar ou mudar affordances existentes. Os componentes existentes (`SearchInput`, `FilterBar`, `CardGrid`) continuam funcionando sem alteração de interface pública.

## Dívida e riscos

**Resultado do `riteward refactor scan src/`:**
- Nenhum arquivo monolítico detectado

**Riscos mapeados:**

- **Performance em ordenações frequentes** — Com 198 cartas, ordenar a cada mudança de filtro pode causar re-renders desnecessários. Evidência: `useCardFilter` usa `useMemo` para otimizar filtros; ordenação deve seguir o mesmo padrão.

- **Ordenação com valores null** — Campos `tier` e `stats` podem ser null. Evidência: `src/types/card.ts` define `tier: string | null` e `stats: Stats | null`. Solução: cartas com valor null devem aparecer no final da ordenação.

- **Compatibilidade de tier entre gerações** — Classic e Origin v3 podem ter diferentes sistemas de tier. Evidência: não investigado profundamente nos dados, mas o tipo permite string livre. Risco baixo: ordenação alfabética de strings funciona independente do formato.

## Perguntas em aberto

Nenhuma. Todos os aspectos da funcionalidade estão bem definidos:
- Critérios de ordenação: nome (A-Z/Z-A), tier, HP
- Comportamento com valores null: documentado (aparecem no final)
- Integração com filtros existentes: manter ordenação após filtragem
- Padrões visuais: seguir `FilterBar` existente

## Conclusão da investigação

**O que se sabe:**
- Arquitetura atual: React com hooks, estado no `App.tsx`, filtros via `useCardFilter` com `useMemo`
- Dados: 198 cartas com campos `name` (sempre presente), `tier` (nullable) e `stats.HP` (nullable)
- Padrões estabelecidos: componentes controlados, memo, props tipadas, CSS modules, testes com vitest
- Não há dívida técnica bloqueante (scan limpo)

**O que segue incerto:**
- Nada bloqueia a implementação. Decisões de design estão claras.

**O que a PLANNING deve considerar:**
1. Criar novo tipo `SortCriteria` para tipagem forte (ex.: `'name-asc' | 'name-desc' | 'tier' | 'hp'`)
2. Decidir entre estender `useCardFilter` ou criar hook separado `useCardSort` — recomendação: separar (responsabilidade única)
3. Componente `SortControl` deve seguir padrão de `FilterBar` (chips/botões com aria-pressed)
4. Lógica de ordenação deve lidar com null colocando valores ausentes no final
5. Performance: usar `useMemo` para evitar re-renders desnecessários
6. Testes: cobrir casos de borda (null, empates, persistência com filtros)
