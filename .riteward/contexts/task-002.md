# Contexto — Expandir dataset de cartas Axie (Classic + Origin v3) de 12 para 150+ cartas (task-002)

- task: task-002
- author: Agnes (agente)
- created_at: 2026-11-08

## Problema

O dataset em `src/data/cards.json` tem 12 cartas amostra (6 Classic +
6 Origin v3). A UI (task-003, v0.2.0) já consome esse dataset, mas
exibe apenas 12 cartas — insuficiente para um Card Explorer. O
concorrente `origin-rosy.vercel.app` tem ~150+ cartas Origin v3 com
imagem em CDN Sanity. O site oficial (`classic.axieinfinity.com`)
tem o dataset Classic. Falta expandir o dataset local para cobrir
ambas as gerações de forma completa.

Evidência: `node -e "console.log(require('./src/data/cards.json').length)"` → `12`.

## Memória consultada

- `task-003` (concluída) — contexto em `.riteward/contexts/task-003.md`:
  a UI já consome `cards.json`, `classes.json`, `parts.json` e lida
  com `image: null` (placeholder de iniciais) e `stats: null`
  (fallback "detalhes não disponíveis"). Esta task expande o
  dataset; a UI não precisa de mudança (os campos adicionais
  `description`, `energyCost`, `actionType` são opcionais na UI por
  enquanto).
- `task-001` (concluída) — `.riteward/contexts/task-001.md`: dados
  JSON locais em `src/data/`, `resolveJsonModule` ativo,
  `refactor.ignore_files` já cobre `src/data/**/*.json`.

## Código lido

- `src/data/cards.json` — 12 cartas, cada com `id`, `name`,
  `generation` ("classic" | "origin-v3"), `axieClass`, `part`
  (null em Classic), `tier`, `image` (slug em Origin v3, null em
  Classic), `stats` (objeto em Classic, null em Origin v3),
  `skills` ([]).
- `src/data/classes.json` — 2 gerações × 6 classes.
- `src/data/parts.json` — classic: [], origin-v3: [Ears, Eyes,
  Tail, Horn, Mouth, Back].
- `src/types/card.ts` — `Card`, `Generation`, `Stats`,
  `GenerationFilter`.
- `origin-rosy.vercel.app` — HTML tem `__NEXT_DATA__` com ~150
  cartas Origin v3, cada com `_id`, `axieClass.title`, `part.
  title`, `slug`, `title`, `tier` (null), `mainImage.asset._ref`
  (slug para CDN Sanity `cdn.sanity.io/images/tac9w5pw/
  production/<hash>-900x1350.png`).
- `classic.axieinfinity.com/explorer/cards` — SPA Next.js, filtros
  por Class/Body Part/Energy Cost/Action Type.

## Superfície de composição

- `src/data/cards.json` — expandido de 12 para ~150+ — veredito:
  corrigido no escopo.
- `src/data/classes.json` — mantido (já tem 2 × 6 classes) —
  veredito: mantido.
- `src/data/parts.json` — mantido — veredito: mantido.
- `src/types/card.ts` — adiciona campos opcionais
  (`description`, `energyCost`, `actionType`) — veredito:
  corrigido no escopo.
- `src/components/Card.tsx` — pode exibir `actionType`/
  `energyCost` (opcional) — veredito: mantido (sem mudança
  obrigatória; campos novos são opcionais).
- `src/App.test.tsx` — teste "12 cartas por padrão" precisará ser
  atualizado para o novo total — veredito: corrigido no escopo.
- `src/components/CardGrid.test.tsx` — teste com 12 cartas
  precisará ser atualizado — veredito: corrigido no escopo.

## Dívida e riscos

- `refactor scan` (2026-11-08, `riteward refactor scan`):
  `Nenhum arquivo monolítico detectado.` — `src/data/**/*.json`
  está em `ignore_files` (task-setup), então o crescimento do
  `cards.json` para ~150 entradas não bloqueia.
- **Risco**: `cards.json` com ~150 entradas fica grande (~3–5 KB
  por carta → ~500–750 KB). **Mitigação**: `refactor.ignore_files`
  já cobre; o Vite tree-shakes; o bundle final cresce em ~300 KB
  (aceitável para SPA). Se passar de 1 MB, vira decisão de
  lazy-load (fora do escopo).
- **Risco**: os testes de `App.test.tsx`/`CardGrid.test.tsx`
  que esperam 12 cartas falham após a expansão. **Mitigação**: o
  passo de teste atualiza as expectativas para o novo total.
- **Risco**: os nomes/classes/partes dos ~150 cartas Origin v3
  precisam vir de uma fonte confiável (o `__NEXT_DATA__` do
  `origin-rosy`). **Mitigação**: extrair via `curl + node` em vez
  de digitar manualmente.
- **Risco**: `image` do Origin v3 é um slug (`"anemone"`) sem
  PNG local. A UI mostra placeholder (iniciais) — aceitável.
- **Risco**: `stats` em Origin v3 não existe no dataset de
  origem. Manter `stats: null` para Origin v3 (a UI já lida).
- **Risco**: `energyCost`/`actionType`/`description` podem não
  estar no dataset de origem. Se ausentes, deixar `undefined`
  (opcional no type) — a UI não exibe ainda.

## Perguntas em aberto

- **Quantas cartas Classic exatamente?** O site oficial não tem
  um endpoint JSON simples. Decisão: usar ~30 cartas Classic
  (representativas das 6 classes) + ~150 Origin v3 = ~180 total.
- **Os campos `description`, `energyCost`, `actionType` devem ser
  exibidos na UI já nesta task?** Decisão: não — são opcionais
  no type, a UI de detalhe ainda não os exibe.

## Conclusão da investigação

A task-002 é autocontida: extrair ~150 cartas Origin v3 do
`__NEXT_DATA__` do `origin-rosy` (slug, title, class, part, tier,
image URL), adicionar ~30 cartas Classic (nomes + classes + stats
representativos), atualizar `cards.json`, adicionar campos
opcionais ao `types/card.ts`, e atualizar os 2 testes que
esperam 12 cartas. O `refactor scan` está limpo (ignore_files
cobre). Os riscos são de extração (fonte confiável), tamanho
(aceitável), e teste (atualizar expectativas). Nenhum `BLOCKED` —
as perguntas em aberto têm decisão por padrão.

**Atualização (investigação avançada):** O `__NEXT_DATA__` do
`origin-rosy` tem 192 cartas Origin v3 (32 por classe: Aqua, Beast,
Bird, Bug, Plant, Reptile; 6 partes: Horn 36, Back 37, Tail 35,
Ears 36, Eyes 24, Mouth 24). Já extraído para
`/tmp/opencode/origin-cards.json`. Isso atende o requisito de "150+
cartas" apenas com Origin v3 — o dataset total será 192 (Origin v3)
+ 6 (Classic, mantidos do scaffold) = 198 cartas. O requisito de
"~30 cartas Classic" da decisão inicial foi descartado: a fonte
não é facilmente acessível em JSON, e 192 Origin v3 já excede o
meta de "150+". O dataset Classic pode ser expandido numa task
separada quando houver uma fonte de dados estruturada.
