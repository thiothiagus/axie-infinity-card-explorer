# Plano — Adicionar funcionalidade de ordenação de cartas (task-008)

Descreva o plano técnico usando esta estrutura. Metadados no topo:

- task: task-008
- author: Kiro (agente)
- created_at: 2026-11-08T19:46

## Contexto

Fundamentado na conclusão da investigação (`.riteward/contexts/task-008.md`):

O projeto possui 198 cartas com sistema de filtros funcionando (busca, geração, classe, parte) via `useCardFilter`, mas sem ordenação. As cartas aparecem sempre na ordem original do JSON. Arquitetura atual usa React com hooks, estado centralizado no `App.tsx`, otimizações com `useMemo`, componentes controlados e tipados. Não há dívida técnica bloqueante (refactor scan limpo). Padrões visuais estabelecidos em `FilterBar` (chips/botões com aria-pressed).

Este plano adiciona funcionalidade de ordenação sem quebrar affordances existentes.

## Objetivo

Adicionar funcionalidade de ordenação de cartas por nome (A-Z/Z-A), tier e HP, mantendo a ordenação ao aplicar/remover filtros, com controle visual consistente com o design existente e testes cobrindo casos de borda.

## Abordagem

**Estratégia escolhida: Separação de responsabilidades com hook dedicado**

1. **Tipos**: Criar `SortCriteria` em `src/types/card.ts` para tipagem forte das opções de ordenação
2. **Hook de ordenação**: Criar `src/hooks/useCardSort.ts` (separado do `useCardFilter`) que recebe array filtrado e critério, retorna array ordenado com `useMemo` para performance
3. **Componente visual**: Criar `src/components/SortControl.tsx` seguindo padrão de `FilterBar` (chips/botões com aria-pressed)
4. **Integração no App**: Adicionar estado `sortBy` no `App.tsx`, compor filtro → ordenação → grid
5. **Lógica de ordenação**: Função pura `sortCards` que lida com null colocando valores ausentes no final
6. **Testes**: Testes unitários para `sortCards`, `useCardSort` e `SortControl`

**Justificativa**: Separar ordenação de filtragem mantém responsabilidade única (cada hook faz uma coisa), facilita testes e permite reutilização. A composição no App (`useCardFilter` → `useCardSort`) é explícita e legível.

## Alternativas consideradas

1. **Estender `useCardFilter` com ordenação integrada** — Adicionar lógica de ordenação dentro do hook existente. Descartada porque viola responsabilidade única: o hook ficaria fazendo filtro E ordenação, aumentando complexidade e dificultando testes isolados.

2. **Ordenação inline no App.tsx sem hook** — Fazer `.sort()` direto no componente após o filter. Descartada porque: (a) não usa `useMemo`, causando re-sorts desnecessários; (b) lógica de negócio no componente de apresentação; (c) dificulta testes da lógica de ordenação.

3. **Ordenação por múltiplos critérios simultâneos (ex: tier primeiro, depois nome)** — Permitir ordenação composta. Descartada porque está fora do escopo definido na task (critérios de aceitação pedem ordenação simples por um critério por vez) e aumentaria complexidade de UI.

## Componentes do recurso

Nenhum componente afetado. Esta task adiciona funcionalidade nova (ordenação) sem remover, migrar ou mudar affordances existentes. Componentes existentes mantêm suas interfaces públicas inalteradas:
- `SearchInput` — mantido (nenhuma alteração)
- `FilterBar` — mantido (nenhuma alteração)
- `CardGrid` — mantido (recebe array já ordenado, mas interface `CardGridProps` não muda)

## Passos

1. **Adicionar tipos de ordenação** — Editar `src/types/card.ts` e adicionar export `export type SortCriteria = 'name-asc' | 'name-desc' | 'tier' | 'hp'`. Verificar: TypeScript compila sem erros, tipo exportado está disponível.

2. **Criar função pura de ordenação** — Criar `src/hooks/useCardSort.ts` com função `sortCards(cards: Card[], sortBy: SortCriteria): Card[]`. Implementar lógica para cada critério: nome A-Z usa `localeCompare`, nome Z-A usa `localeCompare` invertido, tier ordena alfabeticamente com null no final, HP ordena decrescente com null no final. Verificar: função exportada e tipada.

3. **Criar hook de ordenação** — No mesmo arquivo, criar hook `useCardSort(cards: Card[], sortBy: SortCriteria): Card[]` que usa `useMemo` com dependências `[cards, sortBy]` e chama `sortCards` internamente. Verificar: hook exportado e otimizado.

4. **Criar testes da lógica de ordenação** — Criar `src/hooks/useCardSort.test.ts` com testes para: (a) ordenação por nome A-Z e Z-A, (b) ordenação por tier com null no final, (c) ordenação por HP com null no final, (d) empates (cartas com mesmo valor mantêm ordem relativa), (e) array vazio retorna array vazio. Verificar: `npm test` passa nos novos testes.

5. **Criar componente SortControl** — Criar `src/components/SortControl.tsx` seguindo padrão de `FilterBar`. Props: `sortBy: SortCriteria` e `onChange: (s: SortCriteria) => void`. Renderizar chips/botões para cada opção com aria-pressed. Verificar: componente exportado e tipado.

6. **Criar estilos do SortControl** — Criar `src/components/SortControl.module.css` reutilizando classes de `FilterBar.module.css` (`.bar`, `.group`, `.groupLabel`, `.chips`, `.chip`). Verificar: arquivo criado e importado no componente.

7. **Criar testes do componente SortControl** — Criar `src/components/SortControl.test.tsx` testando: (a) renderiza todas as opções, (b) marca opção selecionada com aria-pressed="true", (c) chama onChange ao clicar em opção. Verificar: `npm test` passa nos novos testes.

8. **Integrar no App.tsx** — Editar `src/App.tsx`: (a) importar `SortControl` e `useCardSort`, (b) adicionar estado `const [sortBy, setSortBy] = useState<SortCriteria>('name-asc')`, (c) aplicar ordenação após filtro: `const sortedCards = useCardSort(filteredCards, sortBy)`, (d) renderizar `<SortControl sortBy={sortBy} onChange={setSortBy} />` na seção controls após FilterBar, (e) passar `sortedCards` para CardGrid em vez de `filteredCards`. Verificar: aplicação compila e renderiza controle de ordenação.

9. **Atualizar contador de resultados** — Ajustar `resultCount` em `src/App.tsx` para usar `sortedCards.length` em vez de `filteredCards.length`. Verificar: contador reflete cartas após filtro e ordenação.

10. **Validação manual completa** — Rodar `npm run dev`, testar cada critério de ordenação (nome A-Z, Z-A, tier, HP), aplicar filtros e verificar que ordenação persiste. Verificar: comportamento conforme critérios de aceitação.

## Riscos

- **Performance em ordenações frequentes** (identificado no contexto) — Mitigação: usar `useMemo` no `useCardSort` com dependências corretas (`[cards, sortBy]`). Com 198 cartas, operação é leve, mas evitar re-sorts desnecessários é boa prática.

- **Ordenação com valores null** (identificado no contexto) — Mitigação: lógica explícita em `sortCards` para colocar null no final. Pattern: `if (a === null) return 1; if (b === null) return -1;` antes da comparação real. Testes devem cobrir casos com null.

- **Mutação do array original** — Mitigação: usar `[...cards].sort()` para criar cópia antes de ordenar, evitando mutação do array recebido como prop.

- **Compatibilidade de tier entre gerações** (risco baixo identificado) — Mitigação: ordenação alfabética de strings funciona independente do formato. Se no futuro tier precisar ordenação numérica customizada, será outra task.

## Critérios de sucesso

Cada critério de aceitação da task está coberto pelos passos acima:

- [ ] Controle de ordenação visível na seção de controles ao lado dos filtros — Coberto pelo passo 8 (integração no App.tsx renderizando SortControl)
- [ ] Ordenação por nome A-Z ordena as cartas alfabeticamente crescente — Coberto pelos passos 2-3 (implementação) e 4 (testes)
- [ ] Ordenação por nome Z-A ordena as cartas alfabeticamente decrescente — Coberto pelos passos 2-3 (implementação) e 4 (testes)
- [ ] Ordenação por tier funciona corretamente (cartas sem tier aparecem no final) — Coberto pelos passos 2-3 (implementação com null handling) e 4 (testes)
- [ ] Ordenação por HP funciona corretamente (cartas sem HP aparecem no final) — Coberto pelos passos 2-3 (implementação com null handling) e 4 (testes)
- [ ] Ordenação persiste ao aplicar ou remover filtros de busca/geração/classe/parte — Coberto pelo passo 8 (composição filtro → ordenação) e 10 (validação manual)
- [ ] Componente `SortControl` possui testes unitários cobrindo todas as opções — Coberto pelo passo 7
- [ ] Lógica de ordenação possui testes unitários cobrindo casos de borda (valores null, empates) — Coberto pelo passo 4

## Revisões

- **Iteração 1 (2026-11-08T19:47)** — Plano inicial criado com todos os passos concretos, riscos mapeados, alternativas documentadas e critérios cobertos. Verificado que todos os arquivos e comandos citados existem (`src/types/card.ts`, `src/hooks/useCardFilter.ts`, `src/components/FilterBar.tsx`, `src/App.tsx`). Ordenação dos passos é lógica: tipos → lógica → testes → UI → integração. Nenhum placeholder restante.

## Aprovação

(Auto-audite o plano antes de marcar: confirme que todos os critérios da task estão cobertos, arquivos e comandos citados existem, alternativas foram pesadas e não restam placeholders. O checkbox é exigido no modo padrão (`permissions.plan_approval: true` ou ausente); com `permissions.plan_approval: false` no `.riteward/config.yaml`, o checkbox é dispensado, mas a auto-auditoria continua obrigatória.)

- [x] Plano auto-auditado (critérios mapeados, arquivos verificados e sem placeholders)
