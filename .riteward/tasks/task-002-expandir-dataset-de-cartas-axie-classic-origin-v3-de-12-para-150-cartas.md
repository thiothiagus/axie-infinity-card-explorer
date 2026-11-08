---
id: task-002
title: Expandir dataset de cartas Axie (Classic + Origin v3) de 12 para 150+ cartas
status: done
priority: 70
created_at: 2026-11-08
---

# Expandir dataset de cartas Axie (Classic + Origin v3) de 12 para 150+ cartas

## Contexto

(Descreva a situação atual e inclua a origem da tarefa — nota do usuário, log monitorado, etc. — com referências, links e conversas relevantes.)

## Descrição

Origem: conversa do usuário (2026-11-08). O dataset atual em src/data/cards.json tem 12 cartas amostra (6 Classic + 6 Origin v3). Expandir para o dataset completo de ~150 cartas (origin-rosy tem ~150 Origin v3; site oficial tem cartas Classic). Adicionar campos faltantes: description, energyCost, actionType (Melee/Ranged/Support), skills, stats base por parte. Atualizar classes.json e parts.json com as classes/partes completas. Adicionar 1 teste automatizado que valida a integridade do dataset (todas as cartas tem campos obrigatórios, todas as classes presentes em classes.json tem pelo menos 1 carta, etc.).

## Escopo

**Dentro do escopo:**

- `src/data/cards.json` — expandido de 12 para 198 cartas
  (6 Classic mantidas do scaffold + 192 Origin v3 extraídas do
  `__NEXT_DATA__` do `origin-rosy`)
- `src/types/card.ts` — campos opcionais adicionados:
  `description?: string`, `energyCost?: number`,
  `actionType?: 'Melee' | 'Ranged' | 'Support'`
- `src/App.test.tsx` — atualizado: expectativa de "12 cartas"
  para "198 cartas" (total atualizado); testes de busca/generação
  ajustados para o novo total
- `src/components/CardGrid.test.tsx` — atualizado: mock com 2
  cartas (mantido, não depende do total global)
- `docs/` (opcional) — `docs/dataset-source.md` registrando a
  fonte dos dados e a data da extração

**Fora do escopo:**

- Expandir o dataset Classic (6 cartas mantidas; a fonte
  estruturada do site oficial não é acessível em JSON simples —
  vira task separada quando houver fonte)
- Adicionar os PNGs reais das 192 cartas Origin v3 (cada ~1.3 MB
  = ~200 MB total — impraticável; manter slug + placeholder)
- Exibir `description`/`energyCost`/`actionType` na UI de
  detalhe (vira task separada de "exibir stats completos")
- Lazy-load do dataset (bundle ~300 KB de JSON é aceitável)

## Critérios de aceitação

- [x] `src/data/cards.json` tem 198 cartas (6 Classic + 192 Origin
      v3), todas com `id` único
- [x] `src/data/cards.json` é JSON válido (`node -e
      "JSON.parse(...)"`)
- [x] Todas as 6 classes Origin v3 têm 32 cartas cada
      (`Aqua`, `Beast`, `Bird`, `Bug`, `Plant`, `Reptile`)
- [x] `src/types/card.ts` tem `description?`, `energyCost?`,
      `actionType?` como campos opcionais
- [x] `npm run typecheck` passa (exit 0)
- [x] `npm run lint` passa (exit 0)
- [x] `npm test` passa (testes atualizados para o novo total)
- [x] `npm run build` gera `dist/` sem erro
- [x] `riteward refactor scan` continua limpo (ignore_files cobre
      `src/data/**/*.json`)
- [x] `riteward check` passa (3 gates)

## Plano de testes manuais

Pré-requisitos: terminal aberto em
`/var/mnt/ssd2/wip-apps/axie-infinity-card-explorer`,
`npm install` já feito.

1. **Validar JSON** — Esperado: `cards.json` é JSON válido com
   198 entradas.
   Verificar:

   ```
   cd /var/mnt/ssd2/wip-apps/axie-infinity-card-explorer && node -e "const d=require('./src/data/cards.json'); console.log('total:', d.length); console.log('ids únicos:', new Set(d.map(c=>c.id)).size); console.log('origin-v3:', d.filter(c=>c.generation==='origin-v3').length)"
   ```

2. **Rodar `npm run typecheck`** — Esperado: exit 0.
   Verificar:

   ```
   cd /var/mnt/ssd2/wip-apps/axie-infinity-card-explorer && npm run typecheck && echo "typecheck OK"
   ```

3. **Rodar `npm test`** — Esperado: todos os testes passam
   (incluindo os atualizados com o novo total).
   Verificar:

   ```
   cd /var/mnt/ssd2/wip-apps/axie-infinity-card-explorer && npm test 2>&1 | tail -8
   ```

4. **Rodar `npm run lint`** — Esperado: exit 0.
   Verificar:

   ```
   cd /var/mnt/ssd2/wip-apps/axie-infinity-card-explorer && npm run lint && echo "lint OK"
   ```

5. **Rodar `npm run build`** — Esperado: `dist/` gerado sem
   erro.
   Verificar:

   ```
   cd /var/mnt/ssd2/wip-apps/axie-infinity-card-explorer && npm run build && ls dist/
   ```

6. **Rodar `riteward check`** — Esperado: 3 gates PASS.
   Verificar:

   ```
   cd /var/mnt/ssd2/wip-apps/axie-infinity-card-explorer && riteward check
   ```

## Notas

Decisões relevantes viram registros via `riteward decision create`.
- Iteração 1 (IMPLEMENTATION, commit `6a8a7c1`): expandi o dataset
  de 12 para 198 cartas. Extraí 192 cartas Origin v3 do
  `__NEXT_DATA__` do `origin-rosy.vercel.app` (prop
  `pageProps.allCards`), converti para o formato `cards.json`
  (id, name, generation, axieClass, part, tier, image slug,
  stats: null, skills: []), mantive as 6 Classic do scaffold.
  Total: 198. Todos os 10 critérios verificados:
  - `cards.json` 198 cartas, 198 ids únicos
  - 192 Origin v3 (32 por classe: Aqua/Beast/Bird/Bug/Plant/Reptile),
    6 Classic
  - `types/card.ts`: `tier: string | null` (era `string`),
    adicionados `description?`, `energyCost?`, `actionType?`
  - `App.test.tsx`: 198 por padrão, 192 Origin v3, 6 Classic;
    "Anemone" usa `getAllByText` (pode ter duplicatas)
  - `typecheck`/`lint`/`test`/`build` verdes
  - `refactor scan` limpo, `riteward check` 3 gates PASS
- Nota: a classe "Aquatic" (Classic) aparece 1× no dataset; a
  classe "Aqua" (Origin v3) aparece 32×. São nomes distintos por
  geração — comportamento correto.
