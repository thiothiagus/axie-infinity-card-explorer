# Plano — Implementar grid de cartas com filtros (classe, parte, geração) e busca por nome (task-003)

- task: task-003
- author: Agnes (agente)
- created_at: 2026-11-08

## Contexto

O scaffold React + Vite + TS existe (task-001, v0.1.0) mas a UI do
Card Explorer não foi implementada — `src/App.tsx` é só a página de
boas-vindas. O dataset (`src/data/cards.json`, 12 cartas; `classes
.json`, `parts.json`) existe mas não é consumado. O mascote detetive
está em `src/assets/` mas não referenciado. O contexto de DISCOVERY
(`task-003.md` em `.riteward/contexts/`) mapeou os riscos: tipagem
JSON → Card[], `image: null` (Classic), `stats: null` (Origin v3),
`noUnusedLocals`.

## Objetivo

Entregar a UI principal do Card Explorer: `CardGrid` com 12 cartas
(demostrativo), `FilterBar` (chips de geração/classe/parte),
`SearchInput` (busca por nome), `CardDetail` (modal), mascote
detetive no header e no empty state. Estado com `useState`/`useMemo`
React puro. CSS Modules. 4+ testes de componente.

## Abordagem

Escrever os componentes manualmente (não usar UI library, para
manter o scaffold leve). Ordem dos passos:

1. `src/types/card.ts` — tipos `Card`, `Generation`, `Stats` +
   helpers (`isClassic`, `isOriginV3`).
2. `src/index.css` — reset mínimo + variáveis de cor por classe
   (Plant=verde, Bird=azul, Aquatic=ciano, Bug=roxo, Reptile=
   laranja, Beast=marrom; Aqua=azul-escuro).
3. `src/components/SearchInput.tsx` + `.module.css` — input
   controlado com `value`/`onChange` + placeholder "Buscar carta…".
4. `src/components/FilterBar.tsx` + `.module.css` — chips de
   geração (Todas/Classic/Origin v3), classe (dinâmica pela
   geração selecionada), parte (só Origin v3). Props:
   `generation`, `axieClass`, `part`, `onGenerationChange`,
   `onClassChange`, `onPartChange`, `availableClasses`,
   `availableParts`.
5. `src/components/Card.tsx` + `.module.css` — carta: nome,
   geração, classe, parte, tier; placeholder (gradiente +
   iniciais) se `image === null`; `onClick` abre detalhe.
6. `src/components/CardGrid.tsx` + `.module.css` — grid CSS
   responsivo; props `cards`, `onCardClick`; empty state com
   mascote detetive + "Nenhuma carta encontrada".
7. `src/components/CardDetail.tsx` + `.module.css` — modal
   (`role="dialog"`, `aria-modal`); props `card`, `onClose`;
   fecha por botão e por `Escape`.
8. `src/hooks/useCardFilter.ts` — hook que recebe `cards`,
   `search`, `generation`, `axieClass`, `part` e retorna
   `filteredCards` (useMemo). Exportar também `GenerationFilter`
   type.
9. Reescrever `src/App.tsx` — layout: header (h1 + mascote),
   SearchInput, FilterBar, CardGrid, CardDetail (condicional).
   Estado: `useState` para os 4 filtros + `selectedCard`.
10. Atualizar `src/main.tsx` — `import './index.css'`.
11. Atualizar `src/App.test.tsx` — teste de integração (busca
    "cloud", geração classic + classe Bird).
12. Criar `src/components/CardGrid.test.tsx`,
    `FilterBar.test.tsx`, `CardDetail.test.tsx`,
    `SearchInput.test.tsx` (4 testes).
13. Validar: `npm run typecheck`, `npm run lint`, `npm test`,
    `npm run build` — todos verdes.
14. Commit checkpoint por passo (1 passo = 1 commit via
    `riteward workflow commit`).

## Alternativas consideradas

1. **Tailwind CSS** — rejeitada: adiciona config (postcss,
   tailwind.config, content globs) e dep (postcss, autoprefixer);
   o scaffold mínimo é CSS Modules (nativo do Vite, zero config).
   Se o usuário quiser Tailwind, vira task separada.
2. **React Router para detalhe** — rejeitada: adiciona dep
   (`react-router-dom`); o requisito é "modal ou rota" e o modal é
   mais simples (sem routing). Detalhe em modal com `role="dialog"`.
3. **Estado global (Zustand/Context)** — rejeitada: 4 filtros +
   1 seleção cabem em `useState`/`useMemo` em `App.tsx`; estado
   global é premature (o hook `useCardFilter` já separa a lógica).
4. **Ícones SVG por classe** — rejeitada: o dataset não tem
   arquivos SVG; o placeholder de gradiente + iniciais é suficiente
   e não depende de assets extras.

## Componentes do recurso

A task reescreve `App.tsx` e cria 5 componentes + 1 hook + 1
módulo de tipos. A superfície para tarefas futuras:

- `src/App.tsx` — reescrito (layout + estado) — veredito: afetado
  de propósito.
- `src/main.tsx` — adiciona `import './index.css'` — veredito:
  corrigido no escopo.
- `src/components/Card.tsx` — criado — veredito: criado no escopo.
- `src/components/CardGrid.tsx` — criado — veredito: criado no
  escopo.
- `src/components/FilterBar.tsx` — criado — veredito: criado no
  escopo.
- `src/components/SearchInput.tsx` — criado — veredito: criado
  no escopo.
- `src/components/CardDetail.tsx` — criado — veredito: criado no
  escopo.
- `src/hooks/useCardFilter.ts` — criado — veredito: criado no
  escopo.
- `src/types/card.ts` — criado — veredito: criado no escopo.
- `src/index.css` — criado — veredito: criado no escopo.
- `src/App.test.tsx` — atualizado — veredito: corrigido no escopo.
- `src/components/*.test.tsx` — 4 arquivos criados — veredito:
  criado no escopo.

## Passos

1. **Criar `src/types/card.ts`** — onde: `src/types/`. Conteúdo:
   `type Generation = 'classic' | 'origin-v3'`, `interface Stats
   { HP: number; MOV: number; ATK: number; DEF: number }`,
   `interface Card { id: string; name: string; generation:
   Generation; axieClass: string; part: string | null; tier:
   string; image: string | null; stats: Stats | null; skills:
   string[] }`. Como verificar: `test -f src/types/card.ts &&
   npm run typecheck` (exit 0).

2. **Criar `src/index.css`** — onde: `src/`. Conteúdo: reset
   (`* { box-sizing: border-box; margin: 0 }`), `:root` com
   variáveis `--color-plant: #4caf50`, `--color-bird: #2196f3`,
   `--color-aquatic: #00bcd4`, `--color-bug: #9c27b0`,
   `--color-reptile: #ff9800`, `--color-beast: #795548`,
   `--color-aqua: #1a237e`, `--bg: #fafafa`, `--card-bg: #fff`.
   Como verificar: `test -f src/index.css`.

3. **Criar `src/components/SearchInput.tsx` + `SearchInput.
   module.css`** — onde: `src/components/`. `SearchInput.tsx`:
   props `{ value: string; onChange: (v: string) => void }`;
   input com `type="search"`, `aria-label="Buscar carta"`,
   placeholder "Buscar carta…". `SearchInput.module.css`: estilo
   do input (largura 240px, padding, borda). Como verificar:
   `test -f src/components/SearchInput.tsx && npm run typecheck`.

4. **Criar `src/components/FilterBar.tsx` + `FilterBar.module
   .css`** — onde: `src/components/`. Props: `{ generation:
   string; axieClass: string | null; part: string | null;
   onGenerationChange: (g: string) => void; onClassChange: (c:
   string | null) => void; onPartChange: (p: string | null) =>
   void; availableClasses: string[]; availableParts: string[] }`.
   Renderiza 3 grupos de chips: geração (Todas/Classic/Origin v3),
   classe (chips de `availableClasses`, destacado se
   `axieClass`), parte (chips de `availableParts`, só se
   `availableParts.length > 0`). Chip = `<button>` com
   `aria-pressed`. Como verificar: `test -f
   src/components/FilterBar.tsx && npm run typecheck`.

5. **Criar `src/components/Card.tsx` + `Card.module.css`** —
   onde: `src/components/`. Props: `{ card: Card; onClick: ()
   => void }`. Renderiza `<article>` (ou `<button>`) com:
   nome, geração (badge), classe (badge colorido), parte (se
   houver), tier; imagem: se `card.image` não for null, mostra
   `<img src={...}>` (placeholder por enquanto — a URL não
   existe, então usa um `<div>` com gradiente + iniciais);
   senão placeholder. Como verificar: `test -f
   src/components/Card.tsx && npm run typecheck`.

6. **Criar `src/components/CardGrid.tsx` + `CardGrid.module.
   css`** — onde: `src/components/`. Props: `{ cards: Card[];
   onCardClick: (c: Card) => void; mascotUrl: string }`.
   Se `cards.length === 0`: empty state (mascote + "Nenhuma
   carta encontrada"). Senão: `<div>` grid CSS (3 colunas,
   responsivo) de `<Card>`. Como verificar: `test -f
   src/components/CardGrid.tsx && npm run typecheck`.

7. **Criar `src/components/CardDetail.tsx` + `CardDetail.module
   .css`** — onde: `src/components/`. Props: `{ card: Card;
   onClose: () => void }`. Modal: `<div role="dialog"
   aria-modal="true">` com overlay + card de detalhes (nome,
   classe, parte, tier, stats se não null, skills). Fecha por
   botão "Fechar" e por `Escape` (useEffect com
   `addEventListener('keydown')`). Como verificar: `test -f
   src/components/CardDetail.tsx && npm run typecheck`.

8. **Criar `src/hooks/useCardFilter.ts`** — onde: `src/hooks/`.
   Conteúdo: `type GenerationFilter = 'all' | Generation`;
   `export function useCardFilter(cards: Card[], search: string,
   generation: GenerationFilter, axieClass: string | null,
   part: string | null): Card[]` — `useMemo` filtrando:
   `search` (case-insensitive, inclui em `name`), `generation`
   (`'all'` ou match), `axieClass` (match ou null), `part`
   (match ou null). Como verificar: `test -f
   src/hooks/useCardFilter.ts && npm run typecheck`.

9. **Reescrever `src/App.tsx`** — onde: `src/`. Layout:
   `<main>` com header (`<h1>` + `<img>` mascote), `<SearchInput
   >`, `<FilterBar>` (com `availableClasses`/`availableParts`
   derivados do `generation` via `classes.json`/`parts.json`),
   `<CardGrid>`, `{selectedCard && <CardDetail>}`. Estado:
   `useState` para `search`, `generation` (`'all'`), `axieClass`
   (null), `part` (null), `selectedCard` (null). Importar
   `cards` de `../data/cards.json` (cast `as Card[]`),
   `classes` de `../data/classes.json`, `parts` de `../data/
   parts.json`, `mascotUrl` de `./assets/...`. Como verificar:
   `test -f src/App.tsx && npm run typecheck`.

10. **Atualizar `src/main.tsx`** — onde: `src/`. Adicionar
    `import './index.css'` (antes de render). Como verificar:
    `grep -q "index.css" src/main.tsx`.

11. **Atualizar `src/App.test.tsx`** — onde: `src/`. Conteúdo:
    manter smoke test + adicionar teste de integração:
    `render(<App />)`, `userEvent.type(screen.getByRole('search
    box'), 'cloud')` → 1 carta; `userEvent.click` chip
    "Classic" → filtra. Como verificar: `npm test` (2+ testes).

12. **Criar `src/components/CardGrid.test.tsx`** — onde:
    `src/components/`. Teste: 12 cartas por padrão; com
    `cards` vazio → empty state (mascote + "Nenhuma carta
    encontrada"). Como verificar: `npm test`.

13. **Criar `src/components/FilterBar.test.tsx`** — onde:
    `src/components/`. Teste: clicar chip de classe chama
    `onClassChange`; clicar geração muda `availableClasses`.
    Como verificar: `npm test`.

14. **Criar `src/components/CardDetail.test.tsx`** — onde:
    `src/components/`. Teste: modal abre com `role="dialog"`;
    clicar "Fechar" chama `onClose`. Como verificar: `npm test`.

15. **Criar `src/components/SearchInput.test.tsx`** — onde:
    `src/components/`. Teste: digitar chama `onChange`. Como
    verificar: `npm test`.

16. **Validar scaffold** — `npm run typecheck` (exit 0),
    `npm run lint` (exit 0), `npm test` (7+ testes),
    `npm run build` (gera `dist/`). Como verificar: cada
    comando exit 0.

17. **Commit checkpoint por passo** — via `riteward workflow
    commit task-003 --message "feat: ..."` após cada grupo de
    passos (tipos+css, componentes, hook, App, testes). Mensagem
    no imperativo, padrão do histórico.

## Riscos

- **Risco**: `resolveJsonModule` importa `cards.json` como
  `unknown[]`. **Mitigação**: cast `as Card[]` em `App.tsx` (ou
  em `types/card.ts` com `export const cards = cardsData as
  Card[]`). O passo 9 faz isso.
- **Risco**: `noUnusedLocals: true` — se criar `types/card.ts`
  e não usar todos os tipos, `typecheck` falha. **Mitigação**:
  o passo 16 valida; os tipos `Card`, `Generation`, `Stats`
  são usados em `Card.tsx`, `CardGrid.tsx`, `useCardFilter.ts`.
- **Risco**: `image: null` em Classic — o `Card.tsx` precisa de
  placeholder. **Mitigação**: o passo 5 usa gradiente + iniciais
  quando `image === null`.
- **Risco**: `stats: null` em Origin v3 — o `CardDetail.tsx`
  precisa lidar. **Mitigação**: o passo 7 mostra "—" ou oculta
  a seção de stats quando `stats === null`.
- **Risco**: CSS Modules + `strict` — a tipagem exige
  `vite/client` types. **Mitigação**: já está em
  `tsconfig.json` `types: ["vite/client"]` (passo 1).
- **Risco**: `userEvent` não está instalado (o scaffold tem
  `@testing-library/react` mas não `@testing-library/user-event
  `). **Mitigação**: os testes usam `fireEvent` (do
  `@testing-library/react`, já instalado) em vez de
  `userEvent`. O passo 11-15 usam `fireEvent.change`,
  `fireEvent.click`.
- **Risco**: `pkill -f vite` matando o próprio shell (como na
  task-001). **Mitigação**: a bateria de REVIEW usa `pkill -f
  "vite.js"` (mais específico) ou encerra o dev server com
  `kill $(lsof -t -i:2943)` antes.

## Critérios de sucesso

- [ ] `npm run dev` exibe a página com título, mascote detetive,
      FilterBar (chips de geração + classe + parte), SearchInput,
      e grid de 12 cartas
- [ ] Filtrar por `generation='classic'` mostra 6; por
      `generation='origin-v3'` mostra 6; por `generation='all'`
      mostra 12
- [ ] Filtrar por classe (ex. `Bird` em Origin v3) mostra apenas
      as cartas Bird de Origin v3
- [ ] Filtrar por parte (ex. `Tail`) mostra apenas cartas com
      `part='Tail'`
- [ ] Buscar "cloud" (case-insensitive) mostra 1 carta ("Cloud")
- [ ] Combinações de filtros funcionam (ex. geração `classic` +
      classe `Bird` → 1 carta: "Spirit Feather")
- [ ] Vazio (`filteredCards.length === 0`) exibe o mascote
      detetive com mensagem "Nenhuma carta encontrada"
- [ ] Clicar numa carta abre o modal `CardDetail` com os dados;
      fechar o modal volta ao grid
- [ ] `npm test` passa (testes de CardGrid, FilterBar,
      CardDetail, SearchInput, App)
- [ ] `npm run lint` e `npm run typecheck` passam
- [ ] `npm run build` gera `dist/` sem erro

## Revisões

- Iteração 1 (2026-11-08): auto-auditoria inicial — confirmei
  que os 11 critérios de aceitação da task estão mapeados nos
  passos 1–17; os comandos citados (`npm run typecheck`, `npm run
  lint`, `npm test`, `npm run build`) existem; os arquivos
  citados (`src/types/card.ts`, `src/index.css`,
  `src/components/*.tsx`, `src/hooks/useCardFilter.ts`,
  `src/App.tsx`, `src/main.tsx`, `src/App.test.tsx`,
  `src/components/*.test.tsx`) existem ou serão criados;
  alternativas foram pesadas (Tailwind, React Router, estado
  global, SVG icons) e descartadas com motivo; nenhum
  placeholder restante. O `userEvent` não está instalado, então
  os testes usam `fireEvent` (do `@testing-library/react`, já
  presente) — registrado no Risco 6.

## Aprovação

- [x] Plano auto-auditado (critérios mapeados, arquivos verificados
      e sem placeholders)
