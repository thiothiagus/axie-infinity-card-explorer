# Revisão — Implementar grid de cartas com filtros (classe, parte, geração) e busca por nome (task-003)

- task: task-003
- reviewer: Agnes (agente)
- type: critical
- created_at: 2026-11-08

## Resumo

Revisão crítica da UI principal do Card Explorer. Verifiquei o diff
completo (3 commits de código + docs) contra os 11 critérios de
aceitação da task e os 17 passos do plano. A task criou a UI completa:
`CardGrid`, `Card`, `FilterBar`, `SearchInput`, `CardDetail` (modal),
`useCardFilter` (hook), tipos, CSS global + modules, e 5 arquivos de
teste (28 testes).

## Itens verificados

- [x] `src/types/card.ts` — `Card`, `Generation`, `Stats`,
      `GenerationFilter` types. Usado em todos os componentes.
- [x] `src/index.css` — reset + `:root` com 10 variáveis de cor
      (6 classes + bg + card + accent + overlay).
- [x] `src/components/SearchInput.tsx` — input `type="search"`,
      controlado, botão de limpar. 5 testes.
- [x] `src/components/FilterBar.tsx` — 3 grupos de chips
      (geração/classe/parte), `aria-pressed` nos chips ativos,
      parte só renderiza quando `availableParts.length > 0`. 6
      testes.
- [x] `src/components/Card.tsx` — carta com nome, tier, geração,
      classe, parte; placeholder de iniciais quando `image ===
      null`; cor por classe via `CLASS_COLORS`. 3 testes (via
      `CardGrid`).
- [x] `src/components/CardGrid.tsx` — grid CSS
      (`auto-fill, minmax(180px, 1fr)`), empty state com mascote
      detetive + "Nenhuma carta encontrada". 3 testes.
- [x] `src/components/CardDetail.tsx` — modal `role="dialog"`
      `aria-modal`, fecha por botão/`Escape`/overlay, stats e
      skills condicionais, fallback "detalhes ainda não
      disponíveis". 7 testes.
- [x] `src/hooks/useCardFilter.ts` — `filterCards` (pura,
      testável) + `useCardFilter` (useMemo com deps explícitas).
      Filtragem case-insensitive, geração/classe/parte.
- [x] `src/App.tsx` — layout com header (mascote + título),
      `SearchInput`, `FilterBar`, `CardGrid`, `CardDetail`
      condicional; estado `useState` para 4 filtros +
      `selectedCard`; deduplicação de classes/partes em
      `generation='all'` via `Set`. 7 testes.
- [x] `src/main.tsx` — `import './index.css'` adicionado.
- [x] `src/App.test.tsx` — 7 testes (smoke + integração).
- [x] `src/components/CardGrid.test.tsx` — 3 testes.
- [x] `src/components/FilterBar.test.tsx` — 6 testes.
- [x] `src/components/CardDetail.test.tsx` — 7 testes.
- [x] `src/components/SearchInput.test.tsx` — 5 testes.
- [x] CSS modules: 5 arquivos `*.module.css` (Card, CardGrid,
      FilterBar, SearchInput, CardDetail, App).
- [x] Validações: `npm run typecheck` exit 0, `npm run lint`
      exit 0, `npm test` 28 passed, `npm run build` `built in
      854ms`, `npm run dev` HTTP 200 com mascote no HTML.

## Testes automatizados

- **Criados** (5 arquivos, 28 testes):
  - `src/App.test.tsx` atualizado: de 1 smoke test para 7 testes
    (smoke + 6 de integração: 12 cartas por padrão, busca
    case-insensitive, geração classic/origin-v3, empty state,
    modal abre/fecha).
  - `src/components/CardGrid.test.tsx` (3 testes): renderiza 1
    carta por item, empty state, `onCardClick`.
  - `src/components/FilterBar.test.tsx` (6 testes): chips de
    geração, `onGenerationChange`, `onClassChange`, "Todas" de
    classe, parts conditionais, `aria-pressed`.
  - `src/components/CardDetail.test.tsx` (7 testes): dialog com
    nome, fechar por botão/`Escape`/overlay, stats presentes/
    ausentes, skills, fallback "detalhes não disponíveis".
  - `src/components/SearchInput.test.tsx` (5 testes):
    placeholder/aria-label, `onChange`, clear button, valor
    controlado.
- **Alterados**: `src/App.test.tsx` (expandido de 1 para 7
  testes).
- **Removidos**: nenhum.
- Resultado da auditoria da TESTING: `npm test` 28 passed;
  `riteward check` 3 gates PASS; nenhum snapshot, pulo ou
  reescrita de expectativa sem motivo.

## Problemas encontrados

- **Info**: `image` no dataset é um slug (`"anemone"`) em Origin
  v3 e `null` em Classic. O `Card.tsx` mostra um
  `imageLabel` (o slug) em vez de uma imagem real — os PNGs das
  cartas não existem em `src/assets/cards/` ainda. Decisão
  registrada em `## Notas` (task-002 pode adicionar os PNGs
  reais; por enquanto o placeholder é aceitável).
- **Info**: `stats` é `null` em Origin v3 (não há stats no
  dataset amostra). O `CardDetail` mostra o fallback "detalhes
  ainda não disponíveis" — correto.
- **Info**: `getAvailableClasses('all')` usa `Set` para
  deduplicar — classes Reptile/Bird/Plant/Beast/Bug existem nas
  2 gerações. Registro em `## Notas`.

## Veredicto

**Aprovado.** Todos os 11 critérios de aceitação foram
verificados individualmente e estão marcados `[x]` na task. O
diff está limpo: 3 commits (`4df5ec9` código, `c1d966c`
criterios, + commit da revisão), 24 arquivos no commit
principal. Nenhum arquivo proibido (segredos, state de workflow,
node_modules, logs) entrou no commit. 4 desvios do plano foram
registrados em `## Notas` com motivo.

Achados adicionais durante a bateria:

- **Corrigido**: `package.json` tinha chave duplicada
  `eslint-plugin-react-hooks` (linhas 27–28: `^7.0.0` e
  `^7.1.1`), gerando warning no `vite build`. Removida a
  duplicada (mantida `^7.1.1` — a instalada). Ver
  `docs/audits/test-results-task-003.txt` (antes do commit da
  correção).

## Próximo passo

Avançar para FINALIZATION: o commit final da task-003 será feito
pelo `workflow commit`. Após `COMPLETED`, merge local na `main`
+ delete da branch `feat/card-grid-filters` — em modo
autônomo, exigem autorização explícita do usuário.

## Bateria de testes manuais

Pré-requisitos: terminal aberto em
`/var/mnt/ssd2/wip-apps/axie-infinity-card-explorer`,
`npm install` já feito, dev server disponível em
`localhost:2943`.

1. **Rodar `npm run dev` e abrir a página** — Esperado:
   `http://localhost:2943` exibe "Axie Infinity Card Explorer",
   mascote detetive no header, FilterBar com chips, SearchInput,
   e grid de 12 cartas.
   Verificar:

   ```
   cd /var/mnt/ssd2/wip-apps/axie-infinity-card-explorer && (npm run dev > /tmp/vite-dev.log 2>&1 &) && sleep 5 && curl -s http://localhost:2943 | grep -c "Axie Infinity Card Explorer" && pkill -f "vite.js"; echo "dev server validado e encerrado"
   ```

2. **Rodar `npm test`** — Esperado: 5 test files, 28 tests
   passed.
   Verificar:

   ```
   cd /var/mnt/ssd2/wip-apps/axie-infinity-card-explorer && npm test 2>&1 | tail -8
   ```

3. **Rodar `npm run lint`** — Esperado: exit 0, sem warnings.
   Verificar:

   ```
   cd /var/mnt/ssd2/wip-apps/axie-infinity-card-explorer && npm run lint && echo "lint OK (exit 0)"
   ```

4. **Rodar `npm run typecheck`** — Esperado: exit 0.
   Verificar:

   ```
   cd /var/mnt/ssd2/wip-apps/axie-infinity-card-explorer && npm run typecheck && echo "typecheck OK (exit 0)"
   ```

5. **Rodar `npm run build`** — Esperado: `dist/` gerado.
   Verificar:

   ```
   cd /var/mnt/ssd2/wip-apps/axie-infinity-card-explorer && npm run build && ls dist/
   ```

6. **Teste manual de filtragem no navegador** (após `npm run
   dev` em outra aba) — Esperado: clicar chip "Classic" reduz
   grid para 6; digitar "anemone" no SearchInput reduz para 1;
   clicar numa carta abre modal; clicar "Fechar" fecha; limpar
   todos os filtros volta a 12; busca "zzz" mostra empty state
   com o mascote.
   Verificar: inspecionar visualmente + console sem erros.

## Resultado da bateria

- Origem: docs/audits/test-results-task-003.txt (execução
  autônoma do agente, 2026-11-08, modo `review_approval: false`)
- Auditor: Agnes (agente) — 2026-11-08 (modo autônomo)
- Vereditos:
  - 1: ok — `npm run dev` → HTTP 200, "Axie Infinity Card
    Explorer" presente (1 ocorrência no HTML), dev server
    encerrado.
  - 2: ok — `npm test` → `Test Files 5 passed (5)`, `Tests 28
    passed (28)`.
  - 3: ok — `npm run lint` → exit 0, `lint OK`.
  - 4: ok — `npm run typecheck` → exit 0, `typecheck OK`.
  - 5: ok — `npm run build` → `built in 865ms`, `dist/` com
    `index.html` + `assets/`. (Corrigido: `package.json` tinha
    chave duplicada `eslint-plugin-react-hooks` — removida,
    ver `## Veredicto`.)
  - 6: pendente — teste manual no navegador (não automático;
    executado pelo usuário na bateria, não coberto pela
    transcrição do agente).

## Aprovação do usuário

Modo autônomo (`permissions.review_approval: false`): o checkbox
de aprovação do usuário é dispensado; a bateria foi executada e
auditada pelo próprio agente (ver `## Resultado da bateria`).
O passo 6 (teste manual de filtragem no navegador) é responsabilidade
do usuário e não bloqueia o avanço em modo autônomo. O avanço
para FINALIZATION é feito sem pausa.
