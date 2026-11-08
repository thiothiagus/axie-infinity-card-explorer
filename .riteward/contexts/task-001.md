# Contexto — Bootstrap do scaffold React + Vite + TypeScript (package.json, src/, dataset JSON de cartas, ícones) (task-001)

- task: task-001
- author: Agnes (agente)
- created_at: 2026-11-08

## Problema

O projeto `axie-infinity-card-explorer` está na fase zero: só existem
3 PNGs (ícones provisórios), `.directory` (KDE desktop entry), o
scaffold do Riteward (`.riteward/`) e o `AGENTS.md` com contexto do
projeto. Não há `package.json`, código, `src/`, `README.md` com
comandos reais, nem `.gitignore` com entradas para Vite/Node. A
task-setup finalizou a governança do Riteward, mas o scaffold React +
Vite + TypeScript ainda não foi criado — é o primeiro passo para
qualquer funcionalidade do Card Explorer.

Evidência: `ls` na raiz mostra `.directory`, `.gitignore`,
`.riteward/`, `AGENTS.md`, 3 PNGs, `README.md`. Não há `package.json`,
`node_modules/`, `src/`, `index.html` nem `vite.config.ts`.

## Memória consultada

Nenhuma etiqueta específica para "bootstrap React+Vite".
`riteward decision list` está vazio. `task-setup` (concluída) é a
task anterior — seu contexto (`task-setup.md` em `.riteward/contexts/`)
decidiu manter `quality_gates` vazio por falta de `package.json`,
deixando a sincronização de gates para a task que cria o scaffold
(esta, task-001). O `README.md` criado na task-setup lista comandos
como "pendentes do bootstrap" — esta task os torna reais.

## Código lido

- `AGENTS.md` (raiz) — seção `# Projeto` adicionada na task-setup
  lista a stack (React + Vite + TS) e comandos "a definir no
  bootstrap". É o documento que o `README.md` deve refletir.
- `.riteward/config.yaml` — seções a atualizar nesta task:
  - `project.scripts`: `test: null`, `lint: null`, `typecheck: null`
    (mantidas null até o scaffold ter `package.json` com scripts)
  - `quality_gates: []` (vazio; precisa 3 gates: test, lint,
    typecheck)
  - `version_files` (comentado; precisa ativar com `package.json`)
  - `refactor.ignore_files`: já tem `package-lock.json`,
    `src/data/**/*.json`, `*.png` — adequado
- `README.md` (raiz) — seção "Como rodar" tem "O scaffold React +
  Vite ainda não foi criado (próxima task)". Esta task atualiza
  para os comandos reais.
- `task-setup.md` (`riteward/tasks/`) — contexto da task anterior:
  `refactor.max_lines: 500`, `ignore_dirs` com `node_modules`/`dist`,
  `quality_gates` vazios, `.gitignore` versionando `.riteward/`
  ignorando `state/` e `logs/`.

## Superfície de composição

Nenhum componente de produto afetado (scaffold novo, sem call sites
existentes). A superfície que a task-001 cria para tarefas futuras:

- `src/main.tsx` — entry point, monta `App` em `#root` (definido em
  `index.html`)
- `src/App.tsx` — componente raiz, renderiza a página de boas-vindas
- `src/assets/*.png` — ícones importáveis por componentes (ex.:
  `<img src={mascoteUrl} />`)
- `src/data/*.json` — importáveis por módulos de dados (`import
  cards from "../data/cards.json"`); o `tsconfig.json` precisa
  `resolveJsonModule: true`

## Dívida e riscos

- `refactor scan` (2026-11-08, `riteward refactor scan`): `Nenhum
  arquivo monolítico detectado.` — esperado: ainda não há código.
- **Risco**: `package.json` com scripts `test`/`lint`/`typecheck`
  referenciando pacotes não instalados. **Mitigação**: o passo
  `npm install` deve ser o primeiro a rodar; os gates `riteward check`
  só são validados após o install. Dependências mínimas:
  `react`, `react-dom`, `vite`, `@vitejs/plugin-react`,
  `typescript`, `vitest`, `@testing-library/react` (para o smoke
  test), `eslint` + plugins. O `npm install` resolve.
- **Risco**: `npm run lint` com ESLint sem config. **Mitigação**:
  criar `.eslintrc.json` (ou `eslint.config.js` flat) com extensão
  React + TS. O `npm install` de `eslint` + `eslint-plugin-react` +
  `@typescript-eslint/*` fornece; a config é parte do scaffold.
- **Risco**: mover PNGs da raiz para `src/assets/` quebra
  referências em `.directory` (KDE desktop entry) e em `AGENTS.md`
  (que lista os nomes dos PNGs na raiz). **Mitigação**: `.directory`
  é ignorado pelo `.gitignore` (noise de SO) e não é versionado;
  `AGENTS.md` será atualizado para apontar `src/assets/`. O
  `README.md` também.
- **Risco**: `tsconfig.json` sem `resolveJsonModule` quebra o import
  de `src/data/*.json`. **Mitigação**: o `tsconfig.json` do scaffold
  Vite já inclui `"resolveJsonModule": true` (template padrão).
  Verificar.
- **Risco**: `quality_gates` no `.riteward/config.yaml` com 3 gates
  antes do `package.json` existir → `riteward check` falha.
  **Mitigação**: a ordem dos passos é: (1) criar `package.json` +
  configs, (2) `npm install`, (3) validar que `npm test`/`lint`/
  `typecheck` passam, (4) ATUALIZAR `.riteward/config.yaml` com os
  gates, (5) `riteward check` verde. Os gates só são ativados após
  o scaffold existir e rodar.

## Perguntas em aberto

- Nenhuma. O usuário já decidiu: stack React+Vite+TS, gerações
  Classic+Origin v3, dados em JSON local, ícones provisórios na raiz
  (a mover). O tamanho do dataset inicial (10–15 cartas) é uma
  escolha técnica que a PLANNING pode calibrar; não bloqueia.

## Conclusão da investigação

A task-001 é um bootstrap autocontido: criar `package.json`
(version 0.1.0) + configs de Vite/TS/ESLint/Vitest, `index.html`,
`src/main.tsx`, `src/App.tsx`, mover 3 PNGs para `src/assets/`,
criar `src/data/` com `cards.json`/`classes.json`/`parts.json`
(dataset amostra 10–15 cartas), atualizar `.riteward/config.yaml`
(gates test/lint/typecheck + version_files) e `README.md`
(comandos reais). O `refactor scan` está limpo. Os riscos são
todos de ordem de execução (gates só após scaffold existir) e de
configuração (tsconfig `resolveJsonModule`, ESLint flat config) —
todos mitigáveis no plano. A PLANNING deve consumir este contexto e
definir a ordem exata dos passos, o conteúdo dos 3 JSON de dados
(escolher 10–15 cartas representativas de Classic e Origin v3) e as
dependências do `package.json`.
