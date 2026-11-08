# Workflow: updating-riteward

Guia operacional para agentes de código atualizarem a estrutura do Riteward num projeto-alvo a partir do momento em que o `riteward status` acusa versão defasada ou o usuário pede a atualização. A escolha do que fazer no dia a dia é coberta pela skill `.riteward/skills/using-riteward.md` e pelo `.riteward/riteward.md`; o ciclo de tarefa está em `.riteward/workflows/executing-tasks.md`. A CLI é a fonte de verdade para flags e valores (`riteward docs`, `riteward <comando> --help`); este arquivo diz **o que o agente deve fazer em cada etapa**.

## Convenções

- `CLI (global)`: versão instalada na máquina (`riteward --version`, fonte: `package.json` do Riteward). `Local (.riteward/)`: versão registrada em `.riteward/manifest.json`. Defasagem = `local != CLI`.
- Todo `update` sem conflito tem efeito colateral: reescreve o `manifest.json` com a versão da CLI e os hashes atuais. `manifest.json` deve ser commitado junto ao projeto-alvo.
- `exit 1` no `update` significa decisão pendente (há conflitos), não erro fatal. `[aviso, não bloqueia o trabalho]` no `status` nunca impede o trabalho na task.
- `--dry-run` simula sem gravar nada: nem arquivos, nem `manifest`, nem `.bak`.
- `--force` / `-f` sobrescreve conflitos e exige autorização explícita do usuário, sempre. Sem caminhos, é tudo-ou-nada (todos os conflitos de uma vez). Com caminhos (`--force <caminho>`, repetível, separados por espaço), sobrescreve só os arquivos indicados — os demais conflitos permanecem pendentes. Caminho precisa ser arquivo gerenciado (confira no `status`).
- `.riteward/pending/<caminho>`: em conflito, a CLI estagia o template novo lá (o conflito indica o caminho e o comando exato de aceite) para diff com a edição do usuário; a cópia é apagada sozinha quando o conflito se resolve. Nunca edite nem commite esse diretório.
- `owned` (`riteward.md`, `skills/using-riteward.md`) é 100% ferramenta: sempre regenerado, sem conflito (mas com `.bak` se havia edição). `notes.md` nunca conflita: só é criado se ausente.
- Branch isolada obrigatória: `chore/update-riteward-<versão-da-CLI>`. A CLI trava `main`/`master` só nos comandos de workflow (`start/advance/commit/cancel/push/reopen`) — no `update`/`status` não há trava, por isso a branch é disciplina deste workflow, não da ferramenta.
- Árvore limpa: update em cima de trabalho não commitado mistura manutenção com ciclo da task. Só avance com `git status --porcelain` limpo ou autorização explícita assumindo a mistura.
- Rollback: antes do commit, desfazer é `git restore` nos arquivos ou apagar a branch isolada; depois do commit, reverta com `git revert`, nunca editando por cima.
- Nunca apague `.riteward/` e re-rode `init` para "atualizar". Nunca rode `init` num projeto já instalado.

## 0. DIAGNÓSTICO

Objetivo: confirmar que há o que atualizar e mapear o risco antes de tocar em arquivo.

Agente deve executar nesta ordem:

1. Conferir a branch com `git rev-parse --abbrev-ref HEAD` e a árvore com `git status --porcelain`. Se estiver na `main`/`master`, crie e troque agora (`git checkout -b chore/update-riteward-<versão-da-CLI>`, com a versão da CLI lida no passo 2). É proibido atualizar na `main`. Se a árvore já vier suja, reporte antes de continuar: update em cima de trabalho em andamento mistura manutenção com ciclo.
2. Rodar `riteward status` e ler as três seções que importam: `Versão da CLI (global)` vs `Estrutura local (.riteward/)`, `Arquivos gerenciados modificados manualmente (conflitarão no próximo 'riteward update')` e `Inconsistências detectadas`. Aproveite a seção `Workflows ativos`: se houver task com trabalho em andamento, avise o usuário que os guias vão mudar no meio do ciclo e só prossiga com o ok dele.
3. Se `local == CLI` e não há lista de modificados, pare aqui e reporte: nada a atualizar. Só siga se houver defasagem, modificados listados ou pedido explícito do usuário.
4. Anotar quais arquivos aparecem como modificados: cada um deles será um conflito futuro (salvo `owned`, que o `status` já exclui da lista e o `update` regenera sozinho).

Não faça no DIAGNÓSTICO:

- Não rode `update` sem `status`: o `status` é o que diz se há defasagem e onde estão as edições do usuário.
- Não rode `update` real nem `--force` na `main`/`master`: saia para a branch isolada primeiro (leitura — `status`, `dry-run` — pode acontecer antes da troca, escrita nunca).
- Não misture o update com trabalho de task em andamento sem decisão do usuário.
- Não atualize com workflow ativo sem avisar o usuário.
- Não trate `[aviso, não bloqueia o trabalho]` como impedimento: ele informa, não trava o ciclo da task.
- Não leia os gerenciados um por um para adivinhar diff: o `update --dry-run` fará isso na etapa 1.

Gate de saída: só avance para a SIMULAÇÃO em branch isolada, com árvore limpa (ou aceite explícito da mistura), sem workflow ativo desavisado e com defasagem confirmada ou pedido explícito. Sem isso, o trabalho se encerra no reporte.

## 1. SIMULAÇÃO

Objetivo: ver exatamente o que mudaria, sem gravar nada.

Agente deve executar nesta ordem:

1. Rodar `riteward update --dry-run` e interpretar os grupos: `Criados` (ausentes ou novos na versão), `Atualizados` (intocados que vão para o template novo), `Conflitos (nada foi alterado)` (editados, pulados), `Inalterados: N`, mais `Novidades de <from> para <to>`.
2. Conferir o rodapé: esperado `Dry-run: nenhuma alteração foi gravada.` Confirmar que nenhum `.bak` foi criado e que o `manifest.json` segue na versão antiga.
3. Se houver `Conflitos`, levar a lista para a REVISÃO. Se não houver, pular direto para a APLICAÇÃO.

Não faça na SIMULAÇÃO:

- Não rode `update` real aqui nem `--force`: simulação é só leitura.
- Não edite arquivos para "adiantar" o update: edição agora vira conflito depois.
- Não ignore a seção `Novidades`: ela diz o que a nova versão traz e fundamenta a decisão do usuário.

Gate de saída: só avance com o relatório do `dry-run` lido e classificado (com ou sem conflitos). Sem isso, não há base para pedir decisão.

## 2. REVISÃO

Objetivo: decisão informada do usuário sobre cada conflito. Pausa obrigatória se houver conflito.

Agente deve executar nesta ordem:

1. Rodar `riteward changelog` (novidades entre a instalada e a CLI; `--from <versão>` ou `--all` só se precisar de contexto maior).
2. Para cada arquivo em `Conflitos`, apresentar ao usuário: o que o template novo muda (via `Novidades` + `dry-run`), a cópia estagiada em `.riteward/pending/<caminho>` para diff, que há edição manual preservada no disco e que aceitar o template gera `<arquivo>.bak`.
3. Aguardar a decisão explícita por arquivo ou global: aceitar template, manter edição (resolver manual depois) ou abortar. Pausa obrigatória — não presuma aceite.
4. Se a decisão for manter edições ou abortar, encerre sem `update real` e reporte o estado (defasagem mantida, sem gravação).

Não faça na REVISÃO:

- Não rode `--force` sem autorização explícita: silêncio do usuário não é aceite. A decisão pode ser por arquivo (`--force <caminho>`, repetível) ou global (`--force`).
- Não rode `--force` para caminhos fora do que o usuário aprovou: aceite só o que foi decidido na revisão.

Gate de saída: sem conflitos, avanço livre para a APLICAÇÃO. Com conflitos, só avance com autorização explícita registrada (o que aceitar, o que manter).

## 3. APLICAÇÃO

Objetivo: aplicar o update preservando edições do usuário.

Agente deve executar nesta ordem:

1. Rodar `riteward update` (sem flags). Efeito esperado por tipo: ausente→`Criados`; intocado→`Atualizados`; editado→`Conflitos (nada foi alterado)`, disco preservado e template novo estagiado em `.riteward/pending/<caminho>`; `owned`→`Atualizados` (com `.bak` se havia edição); `notes.md` só criado se ausente; legados `workflows/feature.md` e `workflows/task.md` removidos (`.bak` só se editados); migrações `inbox.md → notes.md` e `.riteward/AGENTS.md → riteward.md` aplicadas; `config.yaml` com merge aditivo (valores existentes preservados, `feature → task` migrado); `AGENTS.md` da raiz só com o bloco garantido no topo (resto intocado, backup em `AGENTS.md.riteward.bak` quando alterado).
2. Ler a saída: conferir `Criados/Atualizados/Conflitos`, `Novidades` e o rodapé `.riteward/manifest.json atualizado (riteward <versão>)`.
3. Se `exit 1` com conflitos, ir para CONFLITOS. Se sem conflitos, ir para a VERIFICAÇÃO.

Não faça na APLICAÇÃO:

- Não use `--force` aqui: esta etapa é sem flags, por definição preserva edições.
- Não edite gerenciados no meio do update: o `manifest` é rebuilt do disco após a escrita; edição concorrente corrompe o registro.
- Não rode `init`, `add` ou `remove` como parte do update.

Gate de saída: `manifest.json` na versão da CLI. Com conflitos pendentes, a saída é ir para CONFLITOS com a lista exata; sem conflitos, ir para a VERIFICAÇÃO.

## 4. CONFLITOS

Objetivo: resolver pendências só com autorização, sem perder edição do usuário.

Agente deve executar nesta ordem:

1. Confirmar que há autorização explícita para `--force`. Sem ela, pare e reporte (defasagem parcial mantida, disco intacto).
2. Com autorização, rodar `riteward update --force` (todos os conflitos de uma vez) ou `riteward update --force <caminho> ...` (repitível — só os arquivos aprovados). Efeito nos conflitos alvo: sobrescritos pelo template novo, cada edição salva em `<arquivo>.bak`; `config.yaml` com `YAML inválido substituído (--force)` ou `merge aplicado com --force`; `task-setup` obsoleta regenerada. Conflitos fora do escopo do comando permanecem pendentes (o `update` continua com `exit 1`).
3. Para cada `.bak` gerado, fazer `diff` contra o novo, mesclar manualmente o que for edição real do usuário (não ruído) e só então apagar o `.bak`. `config.yaml` não tem `.bak`: revisar o merge no próprio arquivo.
4. Se algum conflito for `YAML inválido` ou `workflow.default ainda é feature`, corrigir no arquivo ou aceitar a migração com `--force`, conforme a decisão da REVISÃO.

Regra da etapa: `.bak` é backup, não lixo nem entrega — nunca commite `.bak`, nunca o deixe para trás sem decisão. Segredo vazado num `.bak` precisa ser trocado, não basta apagar.

Não faça em CONFLITOS:

- Não rode `--force` para caminhos fora da autorização dada: global só com aceite para tudo; seletivo só com os arquivos aprovados.
- Não apague `.riteward/` nem re-rode `init` para "limpar" conflitos.
- Não mescle em silêncio divergência relevante: volte ao usuário em vez de improvisar.

Gate de saída: só avance com zero conflitos pendentes (novo `update` limpo) + `.bak` triados + `.riteward/pending/` vazio (a CLI apaga as cópias sozinha; sobra só se o conflito seguir pendente). Com tudo limpo, ir para a VERIFICAÇÃO.

## 5. VERIFICAÇÃO

Objetivo: provar que o Riteward atualizado funciona, com fumaça dos próprios comandos — sobretudo o que a nova versão trouxe. Tudo aqui é só leitura.

Agente deve executar nesta ordem:

1. Rodar `riteward update --dry-run` de novo: esperado tudo `Inalterados`, zero conflitos. Prova idempotência: os hashes do `manifest` batem com o disco.
2. Rodar `riteward changelog`: esperado `Nenhuma alteração registrada depois de <versão>`. Prova o bump do `manifest` e o wiring do changelog.
3. Rodar `riteward config validate`: esperado configuração válida. Prova que o merge aditivo não quebrou a config.
4. Rodar `riteward docs` e `riteward task list` (ou `task next` se houver dúvida): prova docs embutidos intactos e stores legíveis após as migrações.
5. Se as `Novidades` anunciaram comando novo, rodar `<novo-comando> --help`: prova que o comando está ligado na CLI.

Não faça na VERIFICAÇÃO:

- Nada de `--force` nem escrita aqui: fumaça é só leitura; conserto pertence à etapa dona.
- Não pule a verificação porque "o update foi limpo": update limpo prova escrita, não funcionamento.

Gate de saída: só avance para o PÓS-UPDATE com os cinco pontos verdes. Falha em 1 volta para CONFLITOS (conflito residual); falha em 3 volta para correção manual da config; falha em 2, 4 ou 5 se reporta ao usuário em vez de commitar.

## 6. PÓS-UPDATE

Objetivo: provar que a estrutura está sã e entregar commit limpo.

Agente deve executar nesta ordem:

1. Rodar `riteward status`: esperado `local == CLI`, sem seção de modificados (salvo edição feita após o update) e sem aviso de versão.
2. Conferir `git status --porcelain`: esperado gerenciados atualizados + `manifest.json` na nova versão, sem `.bak` pendente, sem `state/` editado na mão, sem segredos. `.bak` triado se apaga do disco; nunca commita. Confirmar que segue na branch isolada criada no DIAGNÓSTICO, nunca na `main`/`master`.
3. Commitar a atualização nesta branch isolada (mensagem no padrão do projeto, ex.: `chore: atualiza estrutura riteward para <versão>`) e reportar: versão anterior → atual, arquivos criados/atualizados, conflitos resolvidos e `.bak` triados, estado da branch/push (merge, push e delete só com pedido explícito; com pedido, prefira PR).

Regra da etapa: PÓS-UPDATE não conserta produto — falha de gate do projeto (`check` vermelho, teste quebrado) pertence ao ciclo da task (`executing-tasks.md`), nunca a este workflow.

Não faça no PÓS-UPDATE:

- Não commite `.bak`, `state/`, segredos (`.env`, `*.pem`/`*.key`, tokens) nem dependências.
- Não faça merge, push nem delete de branch sem pedido explícito do usuário.
- Não reabra conflito já resolvido editando gerenciados após o commit sem novo `status`.

## Referência rápida

```bash
git checkout -b chore/update-riteward-<versão-da-CLI>
riteward status
riteward update --dry-run
riteward changelog
riteward update
riteward update --force
riteward update --force ".riteward/constitution.md"
riteward update --dry-run
riteward changelog
riteward config validate
riteward task list
```
