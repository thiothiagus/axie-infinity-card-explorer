<!-- ARQUIVO GERADO PELO RITEWARD — NÃO EDITE MANUALMENTE. Alterações serão perdidas no `riteward update`. -->

# riteward.md

Este projeto usa o Riteward para governança de workflow e qualidade.

Este arquivo é o coração da governança neste projeto: a autoridade operacional. Todo caminho passa por aqui — o bloco no `AGENTS.md` da raiz e a skill `using-riteward` existem para trazer o agente até ele. Ele diz o que fazer antes de começar uma task e delega o resto: o passo a passo do ciclo vive em `.riteward/workflows/executing-tasks.md` e os princípios e políticas vivem em `.riteward/constitution.md`. Em divergência sobre o passo a passo do ciclo, vale o `executing-tasks.md`.

## Referência de uso

Este arquivo orienta o início da sessão. A referência completa e autoexplicativa é a própria CLI:

- `riteward docs` — guia embutido: conceitos de estado, dúvidas frequentes e referência de comandos com flags, valores aceitos e exemplos.
- `riteward <comando> --help` — uso específico de cada comando (ex.: `riteward task update --help`).
- `riteward changelog` — novidades entre a versão do Riteward instalada neste projeto e a versão da CLI.

Não é necessário ler código-fonte do Riteward para operá-lo: o help e as mensagens de erro listam os valores válidos.

## Como trabalhar neste projeto

Antes de qualquer alteração, entenda o contexto. Não edite código ainda:

1. Leia `.riteward/constitution.md` para conhecer as regras e políticas.
2. Execute `riteward status` para ver o estado atual do projeto, tarefas e workflows ativos. Ele já indica a próxima tarefa; só siga para o passo 3 se a indicação estiver ambígua ou empatada.
3. Se precisar escolher, descubra o que fazer agora com `riteward task next`: ele retorna a tarefa em andamento (para retomar) ou a pendente de maior pontuação. Se houver empate, o comando lista as empatadas — analise cada uma com `riteward task show <task-id>` e escolha uma. Para detalhes de qualquer tarefa, use `riteward task show <task-id>`; para ver o backlog, `riteward task list` (com `--status <status>` para filtrar).
   **Não leia os arquivos de `.riteward/tasks/` um por um para escolher o que fazer** — a ordem já está na pontuação (0–100, em que low=25, medium=50 e high=75 são apenas âncoras). **Não varra o repositório para descobrir o que fazer** — use a CLI. Não leia código ainda: o `executing-tasks.md` dirá quando e o quê ler. Ao criar tarefa com `riteward task create`, informar `--priority` é obrigatório para tarefas normais; para correções simples e pontuais de poucas linhas, use `riteward task create "fix: ..." --quickfix` (ciclo reduzido sem burocracia) — a regra de decisão quickfix vs. padrão está em `.riteward/skills/using-riteward.md`.

Pare aqui. Com a tarefa escolhida, abra **`.riteward/workflows/executing-tasks.md`** e siga do SETUP ao encerramento — trabalhar numa task sem ler o `executing-tasks.md` é operar fora da governança. Não crie branch ainda: o SETUP manda criar branch isolada (`feat/...` ou `fix/...`); nunca trabalhe na `main`/`master`.

Se `riteward task next` não apontar tarefa nenhuma e não houver `blocked` a desbloquear, abra **`.riteward/workflows/creating-new-tasks.md`** em vez do `executing-tasks.md` — ele cobre o diagnóstico read-only, o relato ao usuário e a criação de novas tasks (gated por `permissions.new_tasks_review`).

## Ciclo da task

Com a tarefa escolhida, siga **`.riteward/workflows/executing-tasks.md`** do SETUP ao encerramento (sequência: SETUP → DISCOVERY → PLANNING → IMPLEMENTATION → TESTING → REVIEW → FINALIZATION → COMPLETED). Ele é a fonte normativa do passo a passo; este arquivo não repete essas instruções.

## Registros

É aqui que os artefatos moram (o quando criar cada um está no `executing-tasks.md`): contextos em `.riteward/contexts/`, planos em `.riteward/plans/`, revisões em `.riteward/reviews/`, decision records em `.riteward/records/` e resultados de testes em `docs/audits/` — todos conteúdo do usuário, que o Riteward não sobrescreve. Os arquivos de `.riteward/state/` são o oposto: gerenciados pelo workflow, nunca edite na mão. A memória por assunto mora nas etiquetas: páginas de regras por tema (ex.: `docs/rules/*.md`) e decision records — uma página por assunto, não as tarefas antigas. Antes de investigar qualquer problema, o agente identifica o assunto e lê a etiqueta correspondente (registrando em `## Memória consultada` do artefato de contexto da task em execução); ao concluir, registra nela o que aprendeu, citando a task de origem. Com `permissions.knowledge_review: true` no `.riteward/config.yaml`, o registro na etiqueta exige aprovação explícita do usuário; no padrão (`false` ou ausente), o agente guarda direto. Decision records devem usar `.riteward/templates/decision.md` como modelo; para migrar ADRs existentes, use `riteward decision create "Título" --from-file caminho/para/arquivo.md` — o corpo é importado e o frontmatter é gerado.

## Qualidade

Execute `riteward check` quando o `executing-tasks.md` mandar. Ele roda os quality gates configurados em `.riteward/config.yaml` (execuções repetidas sem mudanças são reaproveitadas automaticamente). Manter os gates sincronizados é regra da constituição; o procedimento vive no `TESTING` do `executing-tasks.md`.

## Monitoramento de Logs

**Não leia arquivos de log manualmente.** Execute `riteward logs check` quando o `executing-tasks.md` mandar (só erros novos; `--create-tasks` cria as tasks de manutenção). Sem logs configurados, o comando não faz nada.
