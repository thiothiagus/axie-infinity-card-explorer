---
description: "Cria tasks a partir das notas quando o backlog está vazio: prova de vazio + workflow creating-new-tasks.md."
---

Execute a sequência abaixo, nesta ordem:

1. Rode `riteward show notes`, `riteward status` e `riteward task next`.
2. Se `task next` apontar uma task (ou houver `blocked` pendente), não crie nada: relate a situação e encerre — o caminho é `/execute-task` (ou a conversa de desbloqueio).
3. Só siga se o backlog vier vazio: abra `.riteward/workflows/creating-new-tasks.md` e siga dele (diagnóstico read-only, triagem contra a memória do assunto, relato ao usuário e criação das tasks).

Regras do fluxo:

- Todo `riteward task create` exige `--priority <0-100>`; escolha o número que encaixa a proposta na fila.
- Exceção: correção pequena vira `riteward task create "fix: ..." --quickfix` (sem `--priority`, default 70). A regra de decisão quickfix vs. padrão está em `.riteward/skills/using-riteward.md`.
- O modo de aprovação é definido por `permissions.new_tasks_review` em `.riteward/config.yaml`: `true` (padrão) propõe e aguarda aprovação explícita; `false` cria direto e relata.
- Se o usuário trouxe um pedido direto nesta conversa, não dispare o workflow: crie a task diretamente com `riteward task create "Título" --priority <n>` e siga `/execute-task` com ela.
