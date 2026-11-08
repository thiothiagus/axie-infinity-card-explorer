---
description: "Atualiza a estrutura do Riteward no projeto: riteward status + workflow updating-riteward.md (branch isolada, dry-run, conflito com ok do usuário)."
---

Execute a sequência abaixo, nesta ordem:

1. Rode `riteward status` e compare `Versão da CLI (global)` com `Estrutura local (.riteward/)`; anote também a seção de arquivos gerenciados modificados.
2. Se as versões estiverem iguais e não houver modificados, pare aqui e relate: nada a atualizar.
3. Se houver defasagem, abra `.riteward/workflows/updating-riteward.md` e siga dele:
   - branch isolada `chore/update-riteward-<versão-da-CLI>` (nunca na `main`/`master`);
   - `riteward update --dry-run` antes de qualquer gravação;
   - relatar os conflitos ao usuário; `--force` exige autorização explícita, item a item ou global;
   - se houver workflow de task ativo, avisar o usuário antes de prosseguir.

Nunca apague `.riteward/` e rode `init` de novo para atualizar.
