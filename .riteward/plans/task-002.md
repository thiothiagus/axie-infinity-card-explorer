# Plano — Expandir dataset de cartas Axie de 12 para 198 cartas (task-002)

- task: task-002
- author: Agnes (agente)
- created_at: 2026-11-08

## Contexto

O dataset atual tem 12 cartas (6 Classic + 6 Origin v3). O
concorrente `origin-rosy.vercel.app` expõe 192 cartas Origin v3
via `__NEXT_DATA__` no HTML (32 por classe: Aqua, Beast, Bird,
Bug, Plant, Reptile). A UI (task-003, v0.2.0) já consome
`cards.json` e lida com `image: null`/`stats: null`. Esta task
expande o dataset local para 198 cartas (6 Classic + 192 Origin
v3), adiciona campos opcionais ao type, e atualiza os testes.

## Objetivo

Entregar `src/data/cards.json` com 198 cartas (6 Classic + 192
Origin v3), `src/types/card.ts` com campos opcionais
(`description`, `energyCost`, `actionType`), e testes atualizados
para o novo total. O dataset é extraído do `__NEXT_DATA__` do
`origin-rosy` (fonte confiável, já extraída para
`/tmp/opencode/origin-cards.json`).

## Abordagem

Já extraí as 192 cartas Origin v3 para
`/tmp/opencode/origin-cards.json` (formato compatível com
`cards.json`). A implementação é:

1. Ler o `cards.json` atual (6 Classic).
2. Ler o `origin-cards.json` (192 Origin v3).
3. Combinar: manter as 6 Classic + adicionar as 192 Origin v3 =
   198 cartas.
4. Escrever o novo `cards.json`.
5. Atualizar `types/card.ts` (campos opcionais).
6. Atualizar `App.test.tsx` (total 198; geração classic = 6,
   origin-v3 = 192; busca "cloud" = 1).
7. Validações: `typecheck`, `lint`, `test`, `build`, `refactor
   scan`, `riteward check`.
8. Commit checkpoint.

## Alternativas consideradas

1. **Manter só 12 cartas e não expandir** — rejeitada: o
   requisito é "150+ cartas". 12 é insuficiente.
2. **Expandir Classic também (até ~30 cartas)** — rejeitada: a
   fonte estruturada do site oficial não é acessível em JSON
   simples (SPA Next.js sem endpoint público). 192 Origin v3 já
   excede o meta de "150+". O dataset Classic pode ser expandido
   numa task separada quando houver fonte.
3. **Baixar os 192 PNGs reais** — rejeitada: ~1.3 MB cada = ~200
   MB total, inaceitável para um repo Git. Manter slug +
   placeholder na UI.
4. **Gerar dataset sintético** — rejeitada: os nomes/classes/
   partes reais do `origin-rosy` são mais valiosos que nomes
   inventados.

## Componentes do recurso

- `src/data/cards.json` — expandido de 12 para 198 — veredito:
  corrigido no escopo.
- `src/types/card.ts` — campos opcionais adicionados — veredito:
  corrigido no escopo.
- `src/App.test.tsx` — expectativas atualizadas — veredito:
  corrigido no escopo.
- `src/components/CardGrid.test.tsx` — mock mantido (2 cartas
  locais, não depende do total global) — veredito: mantido.
- `src/data/classes.json` — mantido (2 × 6 classes) — veredito:
  mantido.
- `src/data/parts.json` — mantido — veredito: mantido.

## Passos

1. **Combinar dataset** — onde: `src/data/cards.json`. Ler
   `cards.json` atual (6 Classic) + `/tmp/opencode/origin-cards
   .json` (192 Origin v3), concatenar, escrever 198 cartas.
   Como verificar: `node -e "console.log(require('./src/data/
   cards.json').length)"` → `198`.

2. **Atualizar `types/card.ts`** — onde: `src/types/card.ts`.
   Adicionar `description?: string`, `energyCost?: number`,
   `actionType?: 'Melee' | 'Ranged' | 'Support'` ao `interface
   Card`. Como verificar: `grep -c "description?"
   src/types/card.ts` → `1`.

3. **Atualizar `App.test.tsx`** — onde: `src/App.test.tsx`.
   Mudar `toHaveLength(12)` para `toHaveLength(198)`; mudar
   `toHaveLength(6)` (classic) para `toHaveLength(6)` (mantido);
   mudar `toHaveLength(6)` (origin-v3) para `toHaveLength(192)
   `. Como verificar: `npm test` passa.

4. **Validar scaffold** — `npm run typecheck` (exit 0),
   `npm run lint` (exit 0), `npm test` (todos), `npm run build`
   (gera `dist/`). Como verificar: cada comando exit 0.

5. **`riteward refactor scan`** — confirmar limpo. Como
   verificar: `riteward refactor scan` → `Nenhum arquivo
   monolítico detectado.`

6. **`riteward check`** — 3 gates PASS. Como verificar:
   `riteward check` → `Todos os quality gates passaram.`

7. **Commit checkpoint** — via `riteward workflow commit task
   -002 --message "feat: expande dataset de 12 para 198 cartas
   (192 Origin v3 + 6 Classic)"`.

## Riscos

- **Risco**: os 192 Origin v3 têm `tier: null` (a fonte não
  expõe tier). A UI já lida (`card.tier` pode ser null).
  **Mitigação**: manter `tier: null`; a UI mostra o badge de
  tier apenas quando `tier` não é null (já implementado na
  task-003).
- **Risco**: `image` é um slug (ex. `1022d390710ba8b35dd...`)
  que não corresponde a um PNG local. A UI mostra
  `imageLabel` (o slug) — aceitável como placeholder.
  **Mitigação**: manter slug; vira task de "adicionar imagens
  reais" depois.
- **Risco**: `stats` é `null` em todos os 192 Origin v3. A UI
  mostra fallback "detalhes não disponíveis". **Mitigação**:
  manter `null`; vira task de "adicionar stats" depois.
- **Risco**: `App.test.tsx` `toHaveLength(198)` — o teste de
  geração `origin-v3` antes era `toHaveLength(6)` (6 cartas
  amostra). Agora é `toHaveLength(192)`. **Mitigação**: passo
  3 atualiza.
- **Risco**: o `cards.json` cresce de ~5 KB para ~60 KB (198
  cartas × ~300 B). O bundle do `vite build` cresce em ~20 KB
  (gzip). **Mitigação**: aceitável; `refactor.ignore_files`
  cobre o JSON.

## Critérios de sucesso

- [ ] `src/data/cards.json` tem 198 cartas (6 Classic + 192
      Origin v3), todas com `id` único
- [ ] `src/data/cards.json` é JSON válido
- [ ] Todas as 6 classes Origin v3 têm 32 cartas cada
- [ ] `src/types/card.ts` tem `description?`, `energyCost?`,
      `actionType?`
- [ ] `npm run typecheck` passa
- [ ] `npm run lint` passa
- [ ] `npm test` passa
- [ ] `npm run build` gera `dist/`
- [ ] `riteward refactor scan` limpo
- [ ] `riteward check` passa (3 gates)

## Revisões

- Iteração 1 (2026-11-08): auto-auditoria inicial — confirmei
  que os 10 critérios de aceitação da task estão mapeados nos
  passos 1–7; os comandos citados existem; os arquivos citados
  (`src/data/cards.json`, `src/types/card.ts`,
  `src/App.test.tsx`, `src/components/CardGrid.test.tsx`)
  existem; alternativas foram pesadas (manter 12, expandir
  Classic, baixar PNGs, dataset sintético) e descartadas com
  motivo; nenhum placeholder restante.

## Aprovação

- [x] Plano auto-auditado (critérios mapeados, arquivos verificados
      e sem placeholders)
