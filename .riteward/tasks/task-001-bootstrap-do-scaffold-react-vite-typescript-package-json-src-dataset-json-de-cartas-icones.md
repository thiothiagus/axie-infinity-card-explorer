---
id: task-001
title: Bootstrap do scaffold React + Vite + TypeScript (package.json, src/,
  dataset JSON de cartas, ícones)
status: in_progress
priority: 80
created_at: 2026-11-08
---

# Bootstrap do scaffold React + Vite + TypeScript (package.json, src/, dataset JSON de cartas, ícones)

## Contexto

O projeto `axie-infinity-card-explorer` passou pela task-setup (governança
Riteward configurada, branch `main` com 5 commits). Agora entramos na
primeira task funcional: criar o scaffold React + Vite + TypeScript na raiz
do projeto. Decisões do usuário na conversa (2026-11-08):

- Stack: **React + Vite + TypeScript** (web)
- Gerações de cartas: **Axie Classic + Axie Origin v3**
- Fonte de dados: **JSON local em `src/data/`** (dataset inicial a construir)
- Ícones provisórios: 3 PNGs já na raiz (`Ícone Axie Explorador de Cartas.png`,
  `Mascote Detetive com Lupa e Carta.png`, `Explorador de Cartas Axie Infinity.png`)

## Descrição

Criar o scaffold React + Vite + TypeScript na raiz do projeto:

1. `package.json` (version 0.1.0, scripts: `dev`, `build`, `preview`,
   `test`, `lint`, `typecheck`)
2. `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`, `index.html`
3. `src/main.tsx`, `src/App.tsx` (componente raiz, renderiza a página de
   boas-vindas do Card Explorer)
4. Mover os 3 PNGs da raiz para `src/assets/`
5. Criar `src/data/` com dataset inicial de cartas Axie (Classic +
   Origin v3) em JSON — `cards.json` (lista de cartas com `id`, `name`,
   `generation`, `axieClass`, `part`, `tier`, `image`), `classes.json`
   (classes disponíveis por geração), `parts.json` (partes disponíveis por
   geração)
6. Atualizar `.riteward/config.yaml`:
   - `project.language: typescript` (já feito na task-setup)
   - `project.packageManager: npm` (já feito)
   - `project.scripts`: `test: "npm test"`, `lint: "npm run lint"`,
     `typecheck: "npm run typecheck"`
   - `quality_gates`: adicionar gates para `test`, `lint`, `typecheck`
   - `version_files`: adicionar `package.json`
7. Atualizar `README.md` com os comandos reais (não mais "pendentes")

## Escopo

**Dentro do escopo:**

- `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`,
  `index.html` (novos)
- `src/main.tsx`, `src/App.tsx`, `src/assets/` (novos; PNGs movidos da
  raiz)
- `src/data/cards.json`, `src/data/classes.json`, `src/data/parts.json`
  (novos — dataset inicial com 10–15 cartas como amostra, expandível na
  próxima task)
- `.gitignore` (adicionar `*.local`, `.vite/`, `coverage/` se necessário)
- `.riteward/config.yaml` (seções `project.scripts`, `quality_gates`,
  `version_files`)
- `README.md` (comandos reais)

**Fora do escopo:**

- UI de Card Explorer (grid, filtros, busca, detalhe de carta) — vira a
  próxima task
- Dataset completo de ~150 cartas — vira task separada de "expandir
  dataset"
- Deploy, CI, Docker — fora
- Testes automatizados além do mínimo (`npm test` com 1 teste smoke
  `App.tsx`) — o scaffold mínimo já inclui `vitest` como runner

## Critérios de aceitação

- [ ] `npm install` termina sem erro no diretório do projeto
- [ ] `npm run dev` inicia o dev server Vite em `localhost:5173` e a
      página exibe "Axie Infinity Card Explorer"
- [ ] `npm run build` termina sem erro e gera `dist/`
- [ ] `npm test` termina sem erro (1 smoke test passando)
- [ ] `npm run lint` termina sem erro
- [ ] `npm run typecheck` termina sem erro
- [ ] `src/data/cards.json`, `src/data/classes.json`,
      `src/data/parts.json` existem e são JSON válido
- [ ] Os 3 PNGs foram movidos de `*.png` (raiz) para `src/assets/`
- [ ] `.riteward/config.yaml` `quality_gates` tem 3 gates (`test`,
      `lint`, `typecheck`) e `riteward check` termina verde
- [ ] `.riteward/config.yaml` `version_files` declara `package.json`
- [ ] `README.md` lista os comandos reais (`npm install`, `npm run dev`,
      `npm run build`, `npm test`, `npm run lint`, `npm run typecheck`)
- [ ] `package.json` `version` é `0.1.0`

## Plano de testes manuais

Pré-requisitos: terminal aberto em
`/var/mnt/ssd2/wip-apps/axie-infinity-card-explorer`, Node.js 18+
instalado, `npm` disponível.

1. **Rodar `npm install`** — Esperado: `added N packages in Xs` (N>0,
   sem `npm ERR!`). Verificar:

   ```
   cd /var/mnt/ssd2/wip-apps/axie-infinity-card-explorer && npm install 2>&1 | tail -20
   ```

2. **Rodar `npm run typecheck`** — Esperado: `tsc` termina com exit 0,
   sem erros de tipo. Verificar:

   ```
   cd /var/mnt/ssd2/wip-apps/axie-infinity-card-explorer && npm run typecheck
   ```

3. **Rodar `npm run lint`** — Esperado: `eslint` termina com exit 0,
   sem warnings bloqueantes. Verificar:

   ```
   cd /var/mnt/ssd2/wip-apps/axie-infinity-card-explorer && npm run lint
   ```

4. **Rodar `npm test`** — Esperado: `vitest` roda 1 smoke test
   (`App.tsx` renderiza) e termina verde. Verificar:

   ```
   cd /var/mnt/ssd2/wip-apps/axie-infinity-card-explorer && npm test
   ```

5. **Rodar `npm run build`** — Esperado: `vite build` termina com
   `built in Xs`, gera `dist/` com `index.html` e `assets/`. Verificar:

   ```
   cd /var/mnt/ssd2/wip-apps/axie-infinity-card-explorer && npm run build && ls dist/
   ```

6. **Confirmar dataset JSON válido** — Esperado: `cards.json`,
   `classes.json`, `parts.json` em `src/data/` são parseáveis. Verificar:

   ```
   cd /var/mnt/ssd2/wip-apps/axie-infinity-card-explorer && for f in src/data/*.json; do echo "== $f =="; node -e "JSON.parse(require('fs').readFileSync('$f','utf8')); console.log('OK')"; done
   ```

7. **Confirmar PNGs movidos** — Esperado: os 3 PNGs estão em
   `src/assets/` e não mais na raiz. Verificar:

   ```
   cd /var/mnt/ssd2/wip-apps/axie-infinity-card-explorer && ls src/assets/ && ls *.png 2>&1 || echo "(nenhum PNG na raiz, ok)"
   ```

8. **Rodar `riteward check`** — Esperado: os 3 quality gates (`test`,
   `lint`, `typecheck`) passam. Verificar:

   ```
   cd /var/mnt/ssd2/wip-apps/axie-infinity-card-explorer && riteward check
   ```

9. **Confirmar `version_files`** — Esperado: `riteward version list`
   mostra `package.json`. Verificar:

   ```
   cd /var/mnt/ssd2/wip-apps/axie-infinity-card-explorer && riteward version list
   ```

## Notas

_Decisões relevantes viram registros via `riteward decision create`._
