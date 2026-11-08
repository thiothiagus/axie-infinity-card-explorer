---
description: "Executa a task indicada (ou a próxima, se não for informada): riteward task show + workflow executing-tasks.md do SETUP ao encerramento."
---

Execute a sequência abaixo, nesta ordem:

1. Se o comando trouxer um ID de task (ex.: `task-007`), use ele. Caso contrário, rode `riteward task next` e use a task indicada. Se o `next` retornar `none`, não execute nada: use `/new-task` em vez disso.
2. Rode `riteward task show <task-id>` para reler a task escolhida.
3. Abra `.riteward/workflows/executing-tasks.md` e siga do SETUP ao encerramento — ele é a fonte normativa do passo a passo (SETUP → DISCOVERY → PLANNING → IMPLEMENTATION → TESTING → REVIEW → FINALIZATION → COMPLETED).

Restrições que não podem ser violadas:

- Nunca execute `riteward workflow start/advance/commit/cancel/push/reopen` na branch `main`/`master`: o SETUP cria a branch isolada.
- O SETUP é só leitura: não edite os arquivos da task e não avance estado antes do `workflow show` confirmar `DISCOVERY`.
- Use `--yes` / `-y` em modo não interativo nos comandos do workflow.
- Não troque de task no meio do ciclo: fixe o `<task-id>` no início.
