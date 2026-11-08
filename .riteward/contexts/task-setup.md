# Contexto — Configuração inicial do Riteward (task-setup)

- task: task-setup
- author: Agnes (agente)
- created_at: 2026-11-08

## Problema

O projeto recém-criado acabou de ter o Riteward instalado (`riteward init` em 2026-11-08). A
task-setup gerada pelo instalador pede a finalização da configuração:
enriquecer `AGENTS.md` com contexto do projeto, ativar monitoramento de logs,
configurar o refactor scan, sincronizar quality gates e versionar o
diretório `.riteward/` com `.gitignore` correto.

Evidência: saída de `riteward status` após o init —
```
Projeto: axie-infinity-card-explorer
Configuração: válida
Versão da CLI (global): 0.37.0
Estrutura local (.riteward/): 0.37.0
Workflow: task
Quality gates (0):

Tarefas (1):
  todo: 1
Próxima tarefa: task-setup [75] Configuração inicial do Riteward
```

## Memória consultada

Nenhuma etiqueta encontrada. O diretório `docs/rules/` não existe ainda
(projeto recém-criado, sem código). `riteward decision list` retorna vazio.

## Código lido

- `AGENTS.md` — contém apenas o bloco delimitado do Riteward (linhas 1–4),
  sem contexto do projeto. A etapa 1 da task-setup pede adicionar o contexto
  **abaixo** do bloco.
- `.riteward/config.yaml` — bloco `project` com `language: null`,
  `packageManager: null`, `scripts.test/lint/typecheck: null`,
  `quality_gates: []` (vazio). Blocos `permissions`, `refactor` e `logs`
  presentes; `logs` comentado, `refactor.max_lines: 500`,
  `refactor.ignore_dirs: ["node_modules","dist",".git",".riteward"]`.
- `.riteward/riteward.md`, `.riteward/constitution.md` — gerados pelo init;
  não devem ser editados à mão.
- Arquivos existentes na raiz (3 PNGs + `.directory`): ainda não há
  `package.json`, `src/`, `README.md`, `CHANGELOG.md`, `docs/` nem `.gitignore`.
- Arquivos de `.riteward/` criados pelo init (16 arquivos listados na saída
  do `riteward init`), incluindo `manifest.json`, `state/`, `tasks/task-setup.md`.

## Superfície de composição

Nenhum componente afetado. A task-setup não toca código de produto —
apenas configura o scaffold de governança (`AGENTS.md`, `.riteward/config.yaml`,
`.gitignore`, `logs/`).

## Dívida e riscos

- `refactor scan` (2026-11-08, `riteward refactor scan`): `Nenhum arquivo
  monolítico detectado.` — esperado: o projeto ainda não tem código.
- `quality_gates: []` está vazio porque ainda não existe `package.json` no
  projeto. A etapa 4 da task-setup pede sincronizar gates com os scripts do
  projeto, mas como o projeto React/Vite ainda não foi criado (decisão de
  stack foi tomada na conversa, mas a bootstrap não foi feita), a ação
  correta é manter `quality_gates` vazio por enquanto e registrá-lo como
  pendência da próxima task (bootstrap do scaffold). O `riteward check`
  com 0 gates termina verde trivialmente.
- `refactor.max_lines: 500` é o default do template; o template da task-setup
  sugere 300. Para um projeto de dados (muitos arquivos JSON de cartas), o
  default de 500 é mais adequado — os arquivos de dados não precisam ser
  refatorados por linhas, e o `ignore_files` pode excluir `src/data/**/*.json`.
- Logs: o projeto ainda não tem logs em execução (SPA local, sem backend).
  A etapa 2 da task-setup cria `logs/` e configura o bloco. Como não há
  `logs/errors.log` ainda, o `riteward logs check` reporta "Nenhum log
  configurado". Para satisfazer o critério de aceitação ("bloco logs
  configurado com validação bem-sucedida"), preciso criar `logs/` (vazio com
  `.gitkeep` ou um placeholder) e ativar o bloco `logs` no config apontando
  para um arquivo que exista (ex.: `logs/errors.log` criado vazio).
- Git: o repositório local foi criado (`git init` + `remote add origin
  https://github.com/thiothiagus/axie-infinity-card-explorer.git`) mas ainda
  não tem commit. A task-setup termina em `COMPLETED` com um commit que
  inclui `.riteward/`, `AGENTS.md`, `.gitignore`, `logs/` e os assets PNG —
  esse commit será o "commit inicial" do repositório.

## Perguntas em aberto

- Nenhuma. A stack (React + Vite, web, dados locais, suporta Classic +
  Origin v3) foi decidida pelo usuário na conversa. A task-setup em si não
  precisa decidir stack — só configura a governança.

## Conclusão da investigação

A task-setup é autocontida e operável: enriquecer `AGENTS.md` com o contexto
do projeto (Card Explorer Axie, stack React+Vite, dados em JSON local,
suporta Classic + Origin v3), criar `logs/` com um arquivo placeholder e
ativar o bloco `logs`, manter `refactor.max_lines: 500` com
`ignore_files: ["package-lock.json", "src/data/**/*.json", "*.png"]`,
manter `quality_gates` vazio (sem package.json ainda), e criar `.gitignore`
que ignora apenas `.riteward/state/`, `logs/`, `node_modules/`, `dist/` e
`.gitkeep` opcional. O `.riteward/` é versionado; apenas o state é ignorado.
A PLANNING deve consumir este contexto sem re-derivar.
