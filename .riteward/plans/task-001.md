# Plano — Bootstrap do scaffold React + Vite + TypeScript (task-001)

- task: task-001
- author: Agnes (agente)
- created_at: 2026-11-08

## Contexto

O projeto está na fase zero: só governança Riteward + 3 PNGs + README.
A stack foi decidida pelo usuário (React + Vite + TS, web, dados em
JSON local, suporta Classic + Origin v3). Esta task cria o scaffold
mínimo para a próxima task (UI de Card Explorer) poder ser
implementada. O contexto de DISCOVERY (`task-001.md` em
`.riteward/contexts/`) mapeou os riscos: ordem de execução dos gates
(só após o scaffold existir), `tsconfig resolveJsonModule`, ESLint
flat config, e mover PNGs da raiz para `src/assets/`.

## Objetivo

Entregar um scaffold React + Vite + TypeScript funcional na raiz:
`package.json` (version 0.1.0) + configs (Vite/TS/ESLint/Vitest),
`index.html`, `src/main.tsx`, `src/App.tsx` (página de boas-vindas),
`src/assets/` com os 3 PNGs movidos, `src/data/` com dataset amostra
(10–15 cartas), `.riteward/config.yaml` com gates test/lint/typecheck
e `version_files: [package.json]`, e `README.md` com comandos reais.

## Abordagem

Escrever os arquivos do scaffold manualmente (não usar `npm create
vite`, que gera uma árvore vazia e exigiria renomear/ajustar). A
ordem dos passos é:

1. Criar todos os arquivos de config e código (`package.json`,
   `vite.config.ts`, `tsconfig*.json`, `index.html`, `src/*`,
   `eslint.config.js`, `.gitignore` incrementado).
2. `npm install` (resolve dependências; gera `package-lock.json`).
3. Validar: `npm run typecheck`, `npm run lint`, `npm test`,
   `npm run build` — cada um verde antes de prosseguir.
4. Mover PNGs da raiz para `src/assets/` + atualizar referências
   (`AGENTS.md`, `README.md`).
5. Criar `src/data/*.json` (dataset amostra).
6. Validar JSON: `node -e "JSON.parse(...)"` em cada arquivo.
7. Atualizar `.riteward/config.yaml`: `project.scripts`
   (test/lint/typecheck), `quality_gates` (3 gates), `version_files`
   (`package.json`).
8. `riteward check` (3 gates verdes) + `riteward version list`
   (mostra `package.json`).
9. Atualizar `README.md` com comandos reais.
10. Commit checkpoint por passo (1 passo = 1 commit).

## Alternativas consideradas

1. **Usar `npm create vite@latest . -- --template react-ts`** —
   rejeitada: o comando gera em `.` mas recusa diretório não vazio
   (há `.riteward/`, `AGENTS.md`, etc.). Exigiria mover arquivos para
   fora e de volta. Escrito manual é mais controlado e 10 arquivos
   não é muito.
2. **`quality_gates` com 5+ gates (incluindo `build`, `preview`)** —
   rejeitada: gates devem ser o mínimo para quality; `build` é
   coverage de integridade (já coberto pelo `typecheck` + `lint`),
   `preview` não faz sentido em CI. 3 gates (test, lint,
   typecheck) é o padrão.
3. **Dataset completo de ~150 cartas já nesta task** — rejeitada:
   estoura o escopo (a task diz "dataset inicial"). 10–15 cartas
   amostra (3–4 por geração, cobrindo as 6 classes e 6 partes de
   Origin v3) é suficiente para a próxima task (UI) ter dados para
   exibir. O dataset completo vira task separada.

## Componentes do recurso

A task cria superfície nova (scaffold). A superfície para tarefas
futuras:

- `src/main.tsx` — entry point (criado) — veredito: criado no
  escopo.
- `src/App.tsx` — componente raiz (criado) — veredito: criado no
  escopo.
- `src/assets/*.png` — ícones importáveis (criado + PNGs movidos da
  raiz) — veredito: afetado de propósito (PNGs saem da raiz,
  `AGENTS.md`/`README.md` atualizados para `src/assets/`).
- `src/data/*.json` — dataset importável (criado) — veredito:
  criado no escopo.
- `package.json` — version 0.1.0, scripts (criado) — veredito:
  criado no escopo.
- `tsconfig.json` — com `resolveJsonModule: true` (criado) —
  veredito: criado no escopo.
- `.riteward/config.yaml` — gates/version_files (editado) —
  veredito: corrigido no escopo.
- `README.md` — comandos reais (editado) — veredito: corrigido no
  escopo.
- `AGENTS.md` — referências de PNG (editado) — veredito: corrigido
  no escopo.

## Passos

1. **Criar `package.json`** — onde: raiz. Conteúdo: name
   `axie-infinity-card-explorer`, version `0.1.0`, type module,
   scripts `dev`/`build`/`preview`/`test`/`lint`/`typecheck`,
   deps `react@^18`/`react-dom@^18`, devDeps `vite@^5`,
   `@vitejs/plugin-react@^4`, `typescript@^5`, `vitest@^1`,
   `@testing-library/react@^15`, `jsdom@^24`, `eslint@^9`,
   `@eslint/js@^9`, `typescript-eslint@^8`, `eslint-plugin-react
   @^7`, `globals@^15`. Como verificar: `test -f package.json &&
   node -e "JSON.parse(require('fs').readFileSync('package.json'))
   && console.log('OK')"`.

2. **Criar `vite.config.ts`** — onde: raiz. Conteúdo: plugin
   react, test config (vitest com `environment: 'jsdom'`,
   `globals: true`). Como verificar: `test -f vite.config.ts`.

3. **Criar `tsconfig.json` + `tsconfig.node.json`** — onde: raiz.
   Conteúdo: `target: ES2020`, `module: ESNext`, `moduleResolution:
   bundler`, `jsx: react-jsx`, `strict: true`, `resolveJsonModule:
   true`, `noEmit: true`, `types: ["vite/client"]`.
   `tsconfig.node.json`: para o `vite.config.ts` (module ESNext,
   moduleResolution bundler). Como verificar: `test -f
   tsconfig.json && test -f tsconfig.node.json && node -e "
   JSON.parse(require('fs').readFileSync('tsconfig.json')) &&
   console.log('OK')"`.

4. **Criar `eslint.config.js`** (flat config) — onde: raiz.
   Conteúdo: `@eslint/js recommended` + `typescript-eslint
   recommended` + `react` + `react-hooks`. Como verificar:
   `test -f eslint.config.js`.

5. **Criar `index.html`** — onde: raiz. Conteúdo: div `#root`,
   script module `/src/main.tsx`, title "Axie Infinity Card
   Explorer". Como verificar: `test -f index.html && grep -q
   'id="root"' index.html`.

6. **Criar `src/main.tsx` + `src/App.tsx`** — onde: `src/`.
   `main.tsx`: `createRoot` monta `<App />`. `App.tsx`: renderiza
   `h1` "Axie Infinity Card Explorer" + `p` de boas-vindas +
   import dos 3 PNGs de `./assets/` (para exercitar
   `resolveJsonModule` não é, mas `import url from
   './assets/x.png'` funciona via Vite). Como verificar: `test -f
   src/main.tsx && test -f src/App.tsx`.

7. **Criar `src/assets/` e mover 3 PNGs** — onde: `src/assets/`.
   `mkdir -p src/assets && git mv "Ícone Axie Explorador de Cartas
   .png" "Mascote Detetive com Lupa e Carta.png" "Explorador de
   Cartas Axie Infinity.png" src/assets/`. Atualizar `AGENTS.md` e
   `README.md` (referências `src/assets/`). Como verificar:
   `ls src/assets/*.png` (3 arquivos) && `ls *.png 2>/dev/null ||
   echo "(nenhum PNG na raiz)"`.

8. **Criar `src/data/cards.json`** — onde: `src/data/`. Conteúdo:
   array de 12 cartas amostra, cada uma com `id` (slug), `name`,
   `generation` ("classic" | "origin-v3"), `axieClass`, `part`,
   `tier` (string, ex. "S"/"A"/"B" ou null), `image` (nome do
   arquivo em `src/assets/` ou placeholder). Escolher 6 cartas
   Classic (Plant/Bird/Aquatic/Bug/Reptile/Beast, 1 de cada) + 6
   cartas Origin v3 (Aqua/Beast/Bird/Bug/Plant/Reptile, 1 de cada).
   Como verificar: `node -e "JSON.parse(require('fs').readFile
   Sync('src/data/cards.json','utf8')); console.log('OK')"`.

9. **Criar `src/data/classes.json`** — onde: `src/data/`.
   Conteúdo: array de classes por geração: `[{ "generation":
   "classic", "classes": ["Plant","Bird","Aquatic","Bug",
   "Reptile","Beast"] }, { "generation": "origin-v3", "classes":
   ["Aqua","Beast","Bird","Bug","Plant","Reptile"] }]`. Como
   verificar: `node -e "JSON.parse(...)"`.

10. **Criar `src/data/parts.json`** — onde: `src/data/`.
    Conteúdo: array de partes por geração: `[{ "generation":
    "origin-v3", "parts": ["Ears","Eyes","Tail","Horn","Mouth",
    "Back"] }]` (Classic não tem partes nomeadas no dataset
    inicial). Como verificar: `node -e "JSON.parse(...)"`.

11. **`npm install`** — onde: raiz. `npm install` gera
    `node_modules/` + `package-lock.json`. Como verificar:
    `test -d node_modules && test -f package-lock.json`.

12. **Validar scaffold**: `npm run typecheck` (exit 0),
    `npm run lint` (exit 0), `npm test` (1 smoke test verde),
    `npm run build` (gera `dist/`). Como verificar: cada comando
    exit 0.

13. **Criar `src/App.test.tsx`** — onde: `src/`. Conteúdo: 1
    smoke test `@testing-library/react`: renderiza `<App />`,
    verifica `screen.getByText(/Axie Infinity Card Explorer/i)`.
    Como verificar: `npm test` passa (1 teste).

14. **Atualizar `.riteward/config.yaml`** — onde:
    `.riteward/config.yaml`. Edições:
    - `project.scripts`: `test: "npm test"`, `lint: "npm run
      lint"`, `typecheck: "npm run typecheck"`
    - `quality_gates`: `["npm test", "npm run lint", "npm run
      typecheck"]` (3 gates)
    - `version_files`: `["package.json"]` (descomentar/atualizar)
    Como verificar: `riteward config validate` && `riteward check`
    (3 gates verdes) && `riteward version list` (mostra
    `package.json`).

15. **Atualizar `README.md`** — onde: raiz. Remover "O scaffold
    React + Vite ainda não foi criado (próxima task). Quando
    existir, os comandos serão:"; substituir por comandos reais
    (`npm install`, `npm run dev`, `npm run build`, `npm test`,
    `npm run lint`, `npm run typecheck`). Como verificar:
    `grep -c "npm install" README.md` ≥ 1; `grep -c "próxima task"
    README.md` = 0.

16. **Atualizar `.gitignore`** — onde: raiz. Adicionar
    `node_modules/` (já tem), `dist/` (já tem), `coverage/`,
    `*.local`, `.vite/`. Como verificar: `grep -q "coverage"
    .gitignore`.

## Riscos

- **Risco**: `npm install` com versões incompatíveis (ex.: Vite 5
  + Vitest 1). **Mitigação**: as versões no `package.json` (passo 1)
  são compatíveis (Vite ^5, Vitest ^1, @testing-library/react ^15
  com jsdom ^24). O `npm install` resolve; se houver conflito, o
  passo 12 (validar) pega.
- **Risco**: ESLint flat config sem `globals` → `no-undef` em
  `React`/`console`. **Mitigação**: o `eslint.config.js` (passo 4)
  inclui `globals` (passo 1 adiciona a dep `globals@^15`).
- **Risco**: `tsconfig.json` sem `resolveJsonModule` quebra import
  de `src/data/*.json`. **Mitigação**: passo 3 inclui
  `"resolveJsonModule": true`.
- **Risco**: `git mv` com nomes de PNG com acento/espaço falha.
  **Mitigação**: passo 7 aspas os nomes; se falhar, `mv` simples
  (o Git detecta rename no commit).
- **Risco**: `riteward check` com 3 gates antes do `npm install`
  → `npm test` falha (sem `node_modules`). **Mitigação**: a ordem
  dos passos é `npm install` (11) → validar (12) → atualizar
  `config.yaml` com gates (14). Os gates só são ativados no passo
  14, após o scaffold rodar.
- **Risco**: `quality_gates` com `npm test`/`npm run lint`/`npm run
  typecheck` mas o `riteward check` roda do CWD errado.
  **Mitigação**: o `riteward check` roda na raiz do projeto (CWD);
  os comandos `npm` herdam o CWD. Confirmar no passo 14.

## Critérios de sucesso

- [ ] `npm install` termina sem erro (node_modules + package-lock
      existem)
- [ ] `npm run dev` inicia o dev server Vite em `localhost:5173` e
      a página exibe "Axie Infinity Card Explorer"
- [ ] `npm run build` termina sem erro e gera `dist/`
- [ ] `npm test` termina sem erro (1 smoke test passando)
- [ ] `npm run lint` termina sem erro
- [ ] `npm run typecheck` termina sem erro
- [ ] `src/data/cards.json`, `src/data/classes.json`,
      `src/data/parts.json` existem e são JSON válido
- [ ] Os 3 PNGs estão em `src/assets/` e não mais na raiz
- [ ] `.riteward/config.yaml` `quality_gates` tem 3 gates e
      `riteward check` termina verde
- [ ] `.riteward/config.yaml` `version_files` declara
      `package.json`
- [ ] `README.md` lista os comandos reais (sem "próxima task")
- [ ] `package.json` `version` é `0.1.0`

## Revisões

- Iteração 1 (2026-11-08): auto-auditoria inicial — confirmei que
  os 12 critérios de aceitação da task estão mapeados nos passos
  1–16; os comandos citados (`npm install`, `npm run typecheck`,
  `npm run lint`, `npm test`, `npm run build`, `node -e
  "JSON.parse"`, `riteward config validate`, `riteward check`,
  `riteward version list`) existem; os arquivos citados
  (`package.json`, `vite.config.ts`, `tsconfig.json`,
  `tsconfig.node.json`, `eslint.config.js`, `index.html`,
  `src/main.tsx`, `src/App.tsx`, `src/App.test.tsx`,
  `src/assets/`, `src/data/*.json`, `.riteward/config.yaml`,
  `README.md`, `.gitignore`) existem ou serão criados; alternativas
  foram pesadas (npm create vite, 5+ gates, dataset completo) e
  descartadas com motivo; nenhum placeholder restante. O `npm run
  dev` no critério de sucesso é um teste manual (não automático),
  então o passo 12 valida build/typecheck/lint/test (automáticos) e
  o `dev` é coberto pelo `build` (que compila o mesmo bundle).

## Aprovação

- [x] Plano auto-auditado (critérios mapeados, arquivos verificados
      e sem placeholders)
