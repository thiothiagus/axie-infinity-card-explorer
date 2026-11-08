---
name: using-riteward
description: 'Use ao trabalhar em projeto-alvo governado pelo Riteward (possui diretório .riteward/). NÃO usar no repositório-fonte do Riteward.'
---

# Using Riteward

## QUANDO USAR

- Sessão em projeto com diretório `.riteward/`.

## Regras do projeto

- As regras operacionais vivem em `.riteward/riteward.md` (+ `.riteward/constitution.md`); o `AGENTS.md` é só o índice. Leia os dois antes de agir.

## Conflitos entre fontes

- Ordem: instrução do usuário na mensagem atual > `.riteward/riteward.md` + esta skill > `AGENTS.md` / `.hermes.md` do projeto > memória > outras skills.
- Se memória ou outra skill divergir do ritual, pare, declare o conflito e pergunte qual seguir. Não invente workflows ou fases.

## Comandos (fora do ciclo da task)

- `riteward status` — estado do projeto; já mostra a próxima tarefa.
- `riteward task create "título" [--priority <p>] [--quickfix]` — cria uma task. Use `--quickfix` para correção pequena (regra abaixo); sem `--quickfix`, `--priority` é obrigatório.
- `riteward version list` / `riteward version bump --level <patch|minor|major>` — arquivos que guardam a versão do projeto e bump SemVer (usado na FINALIZAÇÃO).
- Caminho rápido "qual é a próxima task?": `riteward status` → `riteward task next` → `riteward task show <task-id>`. Não varra o repositório para descobrir o que fazer; só leia o código do arquivo-alvo depois de escolher a task.
- `riteward --help` / `<comando> --help` — descubra o comando certo aqui, não adivinhe.
- `riteward --version` / `-v` — versão da CLI instalada.
- `riteward docs` — guia completo embutido (conceitos, fluxo, comandos).
- `riteward init` — instala `.riteward/` num projeto novo; aqui já está instalado, nunca re-rode.
- `riteward add` — cria o arquivo de instrução do agente; setup, fora do ciclo.
- `riteward remove` — desinstala o Riteward do projeto; setup, fora do ciclo.
- `riteward config validate` — valida `config.yaml` (diagnóstico).
- `riteward show notes` — lê o canal de captura; vira task depois.
- `riteward logs check` — lê logs monitorados; `--create-tasks` gera tasks (só erros reais viram tasks; `INFO`/`WARN`/`DEBUG` e linhas de teste/simulação são ignorados).
- `riteward refactor scan` — acha monolíticos agrupados por situação (novos / cresceram após registro / dívida antiga / registrada); `--new-only` lista só os que bloqueiam; `--create-tasks` gera tasks; `--refresh-lines` aceita explicitamente crescimento de dívida registrada.

## Correção pequena → quickfix (sempre)

**Correção pequena = `--quickfix`, sempre** — mesmo que o usuário não use a palavra "quick-fix".

Use `riteward task create "…" --quickfix` quando a mudança:
- couber em 1–2 arquivos e ~≤ 15 linhas de código de produção;
- não alterar contrato (API, schema, estado/FSM, evento), arquitetura nem dependências;
- não exigir migração, refatoração de dívida ou decisão de produto;
- for verificável com o ferramental existente (teste unitário + `riteward check`).

Use a task padrão (ciclo completo) quando **qualquer** item acima falhar: feature nova, refatoração, mudança de contrato, trabalho multi-domínio — ou quando a **investigação** (e não a correção) for o trabalho principal.

O critério é sobre **o tamanho e a natureza da mudança**, não sobre o esforço de diagnóstico: um bug de 6 linhas já diagnosticado é quickfix, mesmo que a task anterior (a de investigação) tenha sido pesada.

O ciclo leve remove a cerimônia (contexto de investigação, plano, revisão), não a confiança: `riteward check`, teste de regressão, CHANGELOG + bump de versão e lição na memória continuam obrigatórios.

No quickfix o `--priority` é opcional (default 70) — 70 é só âncora, não regra: calibre pelo custo/urgência da correção para não inflar a fila com micro-correções.

Em caso de dúvida, escolha o padrão — mas **diga no relatório final qual modo escolheu e por quê**, para o usuário corrigir em uma linha se discordar.

## O resto mora em outro lugar

- Ciclo da task (`task`, `context/plan/review create`, `workflow`, `decision`, `check`) → `.riteward/workflows/executing-tasks.md` (workflow de tarefa). É a fonte normativa do passo a passo, do SETUP (branch, notes, logs, `task show`, memória do assunto, `start`, `show`) ao encerramento; em divergência com `.riteward/riteward.md`, vale o `executing-tasks.md`.
- Manutenção (`update`, `changelog`) → `.riteward/workflows/updating-riteward.md` (workflow de update).
- Sem pendências (`task next` retorna `none` e não há `blocked` a desbloquear) → `.riteward/workflows/creating-new-tasks.md` (diagnóstico read-only, relato ao usuário e criação de novas tasks, gated por `permissions.new_tasks_review`).

## Memória por assunto

- Não vasculhe tarefas antigas: o conhecimento mora nas etiquetas — páginas de regras por tema (ex.: `docs/rules/*.md`) e decision records (`riteward decision list`), uma página por assunto.
- Antes de investigar, identifique o assunto e leia a etiqueta correspondente; registre em `## Memória consultada` do artefato de contexto (`riteward context create <task-id>`, na DISCOVERY).
- Ao concluir, registre na etiqueta o que aprendeu, citando a task de origem. Com `permissions.knowledge_review: true`, só após aprovação explícita do usuário; no padrão, guarde direto.
