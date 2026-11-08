# Revisão — Expandir dataset de cartas Axie de 12 para 198 cartas (task-002)

- task: task-002
- reviewer: Agnes (agente)
- type: critical
- created_at: 2026-11-08

## Resumo

Revisão crítica da expansão do dataset. Verifiquei o diff completo
(2 commits de código + 1 checkpoint) contra os 10 critérios de
aceitação da task. A task expandiu `cards.json` de 12 para 198
cartas (192 Origin v3 extraídas do `__NEXT_DATA__` do
`origin-rosy` + 6 Classic mantidas do scaffold), adicionou campos
opcionais ao `types/card.ts` (`description?`, `energyCost?`,
`actionType?`), e atualizou `App.test.tsx` para o novo total.

## Itens verificados

- [x] `src/data/cards.json` — 198 cartas (6 Classic + 192 Origin
      v3), 198 ids únicos, JSON válido.
- [x] Contagem por classe: Plant 33, Bird 33, Aquatic 1, Bug 33,
      Reptile 33, Beast 33, Aqua 32 — cada classe Origin v3 tem
      exatamente 32 cartas; "Aquatic" (Classic) aparece 1× (a
      classe Origin v3 equivalente é "Aqua").
- [x] `src/types/card.ts` — `tier: string | null` (era `string`),
      adicionados `description?: string`, `energyCost?: number`,
      `actionType?: 'Melee' | 'Ranged' | 'Support'`.
- [x] `src/App.test.tsx` — atualizado: 198 por padrão, 192 Origin
      v3, 6 Classic; "Anemone" usa `getAllByText` (pode ter
      duplicatas).
- [x] `npm run typecheck` — exit 0.
- [x] `npm run lint` — exit 0.
- [x] `npm test` — 5 test files, 28 tests passed.
- [x] `npm run build` — `built in 977ms`, `dist/` gerado.
- [x] `riteward refactor scan` — limpo (ignore_files cobre
      `src/data/**/*.json`).
- [x] `riteward check` — 3 gates PASS.

## Testes automatizados

- **Alterado**: `src/App.test.tsx` — expectativas atualizadas de
  "12 cartas por padrão" para "198", "6 origin-v3" para "192".
  Motivo: o dataset foi expandido; os testes precisam refletir o
  novo total. Registro em `## Notas` da task.
- **Criado**: nenhum arquivo novo de teste.
- **Removido**: nenhum.
- Resultado da auditoria da TESTING: `npm test` 28 passed;
  `riteward check` 3 gates PASS; nenhum snapshot, pulo ou
  reescrita de expectativa sem motivo.

## Problemas encontrados

- **Info**: `tier` é `null` em todas as 192 cartas Origin v3
  (a fonte não expõe tier). A UI já lida (`Card.tsx` mostra o
  badge de tier apenas quando `tier` não é null).
- **Info**: `image` é um slug (hash) sem PNG local. A UI mostra
  `imageLabel` (o slug) — aceitável como placeholder. Os PNGs
  reais (cada ~1.3 MB, total ~200 MB) são impraticáveis no Git;
  vira task de "adicionar imagens reais" com CDN ou lazy-load.
- **Info**: `stats` é `null` em todas as 192 Origin v3. A UI
  mostra fallback "detalhes não disponíveis".

## Veredicto

**Aprovado.** Todos os 10 critérios de aceitação foram verificados
individualmente e estão marcados `[x]` na task. O diff está limpo:
3 commits (`6a8a7c1` código, `e284e88` critérios + notas, +
revisão), 6 arquivos no commit principal. Nenhum arquivo
proibido (segredos, state de workflow, node_modules, logs) entrou
no commit. Os 3 problemas encontrados são informativos (não
bloqueantes) e corretamente documentados.

## Próximo passo

Avançar para FINALIZATION: o commit final da task-002 será feito
pelo `workflow commit`. Após `COMPLETED`, merge local na `main`
+ delete da branch `feat/expand-card-dataset` — em modo
autônomo, exigem autorização explícita do usuário.

## Bateria de testes manuais

Pré-requisitos: terminal aberto em
`/var/mnt/ssd2/wip-apps/axie-infinity-card-explorer`,
`npm install` já feito.

1. **Validar JSON** — Esperado: 198 entradas, 198 ids únicos,
   192 origin-v3. Verificar:

   ```
   cd /var/mnt/ssd2/wip-apps/axie-infinity-card-explorer && node -e "const d=require('./src/data/cards.json'); console.log('total:', d.length); console.log('ids únicos:', new Set(d.map(c=>c.id)).size); console.log('origin-v3:', d.filter(c=>c.generation==='origin-v3').length)"
   ```

2. **Rodar `npm run typecheck`** — Esperado: exit 0. Verificar:

   ```
   cd /var/mnt/ssd2/wip-apps/axie-infinity-card-explorer && npm run typecheck && echo "typecheck OK"
   ```

3. **Rodar `npm test`** — Esperado: 5 files, 28 tests passed.
   Verificar:

   ```
   cd /var/mnt/ssd2/wip-apps/axie-infinity-card-explorer && npm test 2>&1 | tail -8
   ```

4. **Rodar `npm run lint`** — Esperado: exit 0. Verificar:

   ```
   cd /var/mnt/ssd2/wip-apps/axie-infinity-card-explorer && npm run lint && echo "lint OK"
   ```

5. **Rodar `npm run build`** — Esperado: `dist/` gerado.
   Verificar:

   ```
   cd /var/mnt/ssd2/wip-apps/axie-infinity-card-explorer && npm run build && ls dist/
   ```

6. **Rodar `riteward check`** — Esperado: 3 gates PASS. Verificar:

   ```
   cd /var/mnt/ssd2/wip-apps/axie-infinity-card-explorer && riteward check
   ```

## Resultado da bateria

- Origem: docs/audits/test-results-task-002.txt
- Auditor: (a preencher após execução)
- Vereditos: (passo a passo: "1: ok" ou "3: falha — causa", um
  por linha)

## Aprovação do usuário

- [ ] Testes executados e aprovados pelo usuário — (citação
  literal, quem, data)
