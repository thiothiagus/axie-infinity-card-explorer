# Contexto — Implementar grid de cartas com filtros (classe, parte, geração) e busca por nome (task-003)

- task: task-003
- author: Agnes (agente)
- created_at: 2026-11-08

## Problema

O scaffold React + Vite + TS existe (task-001, v0.1.0), mas a UI do
Card Explorer ainda não foi implementada — `src/App.tsx` só renderiza
uma página de boas-vindas com um `<h1>` e dois `<p>`. O dataset
(`src/data/cards.json`, 12 cartas; `classes.json`, `parts.json`)
existe mas não é consumado por nenhum componente. O mascote detetive
(`src/assets/mascote-detetive-com-lupa-e-carta.png`) está na
`src/assets/` mas não é referenciado. Falta a UI principal: grid de
cartas + filtros + busca + detalhe.

Evidência: `src/App.tsx` (16 linhas) —
```tsx
export function App() {
  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem' }}>
      <h1>Axie Infinity Card Explorer</h1>
      <p>
        Explore cartas de <strong>Axie Classic</strong> e{' '}
        <strong>Axie Origin v3</strong>.
      </p>
      <p>
        O grid de cartas, filtros por classe/parte e busca ficam na próxima
        task — por enquanto, esta página confirma que o scaffold React + Vite
        + TypeScript está rodando.
      </p>
    </main>
  )
}
```
O texto literalmente diz "O grid de cartas, filtros por classe/parte e
busca ficam na próxima task" — esta é essa próxima task.

## Memória consultada

- `task-001` (concluída) — contexto em
  `.riteward/contexts/task-001.md`: decisões de stack (React 18 + Vite
  5 + TS 5, dados JSON locais em `src/data/`, CSS puro/modules,
  `resolveJsonModule` ativo no tsconfig). Esta task consome esses
  artefatos.
- `task-setup` (concluída) — `.riteward/contexts/task-setup.md`:
  `refactor.max_lines: 500`, `ignore_files` com `src/data/**/*.json`
  e `*.png` (não gera falsos positivos de monolíticos).
- `riteward decision list` — vazio (nenhuma decision record ainda).

## Código lido

- `src/App.tsx` — componente raiz atual (página de boas-vindas);
  será reescrito para layout com header + FilterBar + SearchInput +
  CardGrid + CardDetail.
- `src/main.tsx` — entry point; monta `<App />` em StrictMode;
  **não importa CSS global** (não há `src/index.css` ainda) — precisa
  de `import './index.css'` no passo de implementação.
- `src/data/cards.json` — 12 cartas, cada com `id`, `name`,
  `generation` ("classic" | "origin-v3"), `axieClass`, `part`
  (null em Classic, string em Origin v3), `tier` (S/A/B/C), `image`
  (slug em Origin v3, null em Classic), `stats` (objeto em Classic,
  null em Origin v3), `skills` ([]). 6 Classic: Mossy Leaf (Plant),
  Spirit Feather (Bird), Tide Tail (Aquatic), Spider Eyes (Bug),
  Scorched Scales (Reptile), Bear Paw (Beast). 6 Origin v3: Anemone
  (Aqua, Tail), Belieber (Beast, Ears), Cloud (Bird, Tail), Bettle
  Spike (Bug, Ears), Bamboo Shoot (Plant, Horn), Cerastes (Reptile,
  Horn).
- `src/data/classes.json` — `[{ generation: "classic", classes:
  [Plant, Bird, Aquatic, Bug, Reptile, Beast] }, { generation:
  "origin-v3", classes: [Aqua, Beast, Bird, Bug, Plant, Reptile] }]`.
- `src/data/parts.json` — `[{ generation: "classic", parts: [] },
  { generation: "origin-v3", parts: [Ears, Eyes, Tail, Horn, Mouth,
  Back] }]`.
- `src/App.test.tsx` — smoke test atual: `getByRole('heading', {name:
  /Axie Infinity Card Explorer/i})`. Será atualizado com teste de
  integração.
- `src/assets/` — 3 PNGs: `mascote-detetive-com-lupa-e-carta.png`
  (a usar no header/empty state), `icone-axie-explorador-de-cartas
  .png`, `explorador-de-cartas-axie-infinity.png`.
- `tsconfig.json` — `resolveJsonModule: true` (permite
  `import cards from '../data/cards.json'`), `strict: true`,
  `noUnusedLocals: true` (preciso usar todas as imports), `types:
  [vite/client, vitest/globals, @testing-library/jest-dom]`.
- `eslint.config.js` — flat config com `react/react-in-jsx-scope:
  off` (não precisa `import React` em JSX).
- `src/test/setup.ts` — `import '@testing-library/jest-dom'`
  (assertions `toBeInTheDocument`, `toHaveTextContent`, etc.).

## Superfície de composição

A task reescreve `App.tsx` (componente raiz) e cria 5 componentes
novo. A superfície para tarefas futuras:

- `src/App.tsx` — reescrito (layout + estado) — veredito: afetado
  de propósito.
- `src/main.tsx` — adiciona `import './index.css'` — veredito:
  corrigido no escopo.
- `src/components/Card.tsx` — criado — veredito: criado no escopo.
- `src/components/CardGrid.tsx` — criado — veredito: criado no
  escopo.
- `src/components/FilterBar.tsx` — criado — veredito: criado no
  escopo.
- `src/components/SearchInput.tsx` — criado — veredito: criado no
  escopo.
- `src/components/CardDetail.tsx` — criado — veredito: criado no
  escopo.
- `src/hooks/useCardFilter.ts` — criado (opcional) — veredito:
  criado no escopo.
- `src/types/card.ts` — criado — veredito: criado no escopo.
- `src/index.css` — criado — veredito: criado no escopo.
- `src/App.test.tsx` — atualizado — veredito: corrigido no escopo.
- `src/components/*.test.tsx` — 4 arquivos criados — veredito:
  criado no escopo.

## Dívida e riscos

- `refactor scan` (2026-11-08, `riteward refactor scan`): `Nenhum
  arquivo monolítico detectado.` — esperado: a UI ainda não existe.
- **Risco**: `cards.json` `image` é um slug (ex. `"anemone"`) em
  Origin v3 e `null` em Classic. O `Card.tsx` precisa de um
  placeholder para quando `image` é `null` (Classic não tem imagem
  no dataset). **Mitigação**: `Card.tsx` mostra um `<div>` com
  gradiente por classe + iniciais quando `image === null`; quando
  `image` é um slug, tenta `import` dinâmico ou URL em
  `src/assets/cards/` (não existe ainda — vira task-002). Por
  enquanto, o `Card` só usa a imagem se `image` for um caminho
  válido; senão, placeholder.
- **Risco**: `stats` é `null` em Origin v3 (não temos stats no
  dataset amostra). O `CardDetail` precisa lidar com `stats: null`
  (mostrar "—" ou ocultar). **Mitigação**: `stats && stats.HP`
  com fallback.
- **Risco**: `noUnusedLocals: true` — se criar `types/card.ts` e
  não usar todos os tipos, `npm run typecheck` falha.
  **Mitigação**: garantir que todos os tipos exportados sejam
  usados em `Card.tsx`/`CardGrid.tsx`/etc.
- **Risco**: CSS Modules + `strict` — a tipagem de CSS modules em
  TS exige `*.module.css` declaration (Vite gera via
  `vite/client` types, que já está em `tsconfig.json`
  `types: ["vite/client"]`). **Mitigação**: já coberto.
- **Risco**: `resolveJsonModule` importa `cards.json` como
  `unknown[]` (TS não deduz o shape). **Mitigação**: cast
  `as Card[]` em `types/card.ts` ou em quem importa.
- **Risco**: os 4 testes de componente (`CardGrid`, `FilterBar`,
  `CardDetail`, `App`) podem falhar se os componentes não
  exportam os nomes esperados. **Mitigação**: export named (não
  default) para facilitar a importação nos testes.
- **Risco**: `pkill -f vite` matando o próprio shell (como na
  task-001). **Mitigação**: a bateria usa `pkill -f "vite.js"`
  (mais específico) ou `pkill -f "vite"` com `sleep 1` antes.

## Perguntas em aberto

- **Imagem das cartas**: o dataset atual tem `image: "anemone"`
  (slug) em Origin v3, mas não há `src/assets/cards/` com os PNGs
  das cartas. Como placeholder, o `Card` mostra gradiente + iniciais.
  A task-002 (expandir dataset) pode adicionar os PNGs reais.
  Decisão: usar placeholder por enquanto — não bloqueia.
- **Sort**: não está no escopo. Se o usuário quiser sort, vira
  quickfix depois.

## Conclusão da investigação

A task-003 é autocontida e operável sobre o scaffold existente.
A PLANNING deve: (1) definir `src/types/card.ts` com `Card`,
`Generation`, `Stats`; (2) criar `src/index.css` global (variáveis
de cor por classe); (3) criar 5 componentes em `src/components/`
com CSS modules; (4) criar `src/hooks/useCardFilter.ts` (ou
`useMemo` em `App.tsx`); (5) reescrever `App.tsx` (layout:
header com mascote + FilterBar + SearchInput + CardGrid +
CardDetail modal); (6) atualizar `main.tsx` (`import './index
.css'`); (7) criar 4 testes de componente + atualizar `App
.test.tsx`; (8) garantir `noUnusedLocals` (usar todos os tipos).
Os riscos são de tipagem (JSON → Card[]), placeholder de imagem
(null em Classic), e `stats: null`. Todos mitigáveis no plano.
O `refactor scan` está limpo. Nenhum `BLOCKED` — as perguntas em
aberto (imagem, sort) têm decisão por padrão (placeholder, sem
sort) que não bloqueia.
