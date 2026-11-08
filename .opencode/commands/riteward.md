---
description: "Ponto de entrada da sessão: lê a governança do projeto, roda riteward status + task next e apresenta o estado e a próxima task."
---

Execute a sequência abaixo, nesta ordem:

1. Leia `.riteward/riteward.md` (regras operacionais) e `.riteward/constitution.md` (princípios e políticas).
2. Rode `riteward status` e `riteward task next`.
3. Apresente ao usuário o estado atual do projeto e a próxima task indicada.

Ação final:

- Se `riteward task next` apontou uma task, ofereça iniciar a execução com `/execute-task`.
- Se não apontou nenhuma e não há `blocked` pendente, indique o uso de `/new-task`.
- Se houver `blocked`, relate a situação e pergunte ao usuário como desbloquear.

Não edite código nesta etapa: o próximo passo, quando houver task, é `/execute-task`, que segue o workflow completo.
