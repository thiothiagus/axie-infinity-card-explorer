# Workflow: creating-new-tasks

Guia operacional para agentes de código quando não há tarefa pendente no projeto-alvo. A escolha do dia a dia (status, next) é coberta pela skill `.riteward/skills/using-riteward.md` e pelo `.riteward/riteward.md`; o ciclo de tarefa está em `.riteward/workflows/executing-tasks.md` e a manutenção do Riteward em `.riteward/workflows/updating-riteward.md`. A CLI é a fonte de verdade para flags e valores (`riteward docs`, `riteward <comando> --help`); este arquivo diz **o que o agente deve fazer quando o backlog esvazia**.

## Convenções

- `Vazio` = `riteward task next` retorna `none` **e** `riteward task list --status blocked` não lista nada. `blocked`, `done` e `cancelled` nunca são retornadas pelo `next` — `blocked` é pendência e exige checagem separada; `done`/`cancelled` são histórico.
- Todo `task create` exige `--priority <0-100>` (decimais permitidos; âncoras legadas: low=25, medium=50, high=75). Sem default: escolha o número que faz a proposta encaixar na fila futura. Exceção: `task create --quickfix` (correção pequena, ciclo reduzido) aceita `--priority` omitido — o default é 70.
- `permissions.new_tasks_review` em `.riteward/config.yaml` define o modo: `true` (padrão) = propõe e aguarda aprovação explícita antes de criar; `false` = cria direto após a triagem e relata. A chave vale só neste workflow — não afeta `task create` manual nem `--create-tasks` fora daqui.
- Converse como um desenvolvedor sênior: relate o que encontrou, proponha com fundamento, nunca anuncie mecanismo interno (não mencione skills, workflows ou arquivos de governança pelo nome na conversa com o usuário).
- Fique onde está: não crie branch, não troque de branch. Branch isolada só existe depois, no SETUP do `executing-tasks.md`. Tipicamente este workflow roda na `main` — e é por isso que ele nunca executa comandos de workflow (a CLI os recusa fora de branch de trabalho).
- Se o usuário já trouxe o que fazer na conversa, não dispare este workflow: crie a task com `riteward task create` (pedido direto não passa pela aprovação de `new_tasks_review`) e siga o `executing-tasks.md` com ela.

## 0. PROVA DE VAZIO

Objetivo: confirmar que o vazio é real antes de propor qualquer coisa.

Agente deve executar nesta ordem:

1. Rodar `riteward status` e `riteward task next`, nesta ordem. Anote os dois resultados.
2. Rodar `riteward task list --status blocked`: bloqueadas não aparecem no `next` mas são pendência — a existência de `blocked` encerra este workflow no gate (conversa de desbloqueio com o usuário), nunca vira varredura. Vazio só se a lista vier vazia.
3. Só siga com `next = none`. Com `single` ou `tie`, este workflow não se aplica: volte para o `executing-tasks.md` com a task indicada. Se `next` der `none` mas o `status` contar `todo`/`in_progress` acima de zero, há task malformada ou inconsistência — siga e trate como inconsistência no DIAGNÓSTICO (passo 6), não como vazio.

Não faça na PROVA DE VAZIO:

- Não pule para a varredura sem a prova: sem `status` + `next` + `blocked`, não há base para declarar vazio.
- Não trate `blocked` como vazio: bloqueada é pendência, não ausência de trabalho.
- Não crie branch nem task aqui: prova é só leitura.

Gate de saída: só avance para o DIAGNÓSTICO com `next = none` confirmado e sem `blocked` pendente. Sem isso, encerre e siga o caminho da task indicada; com `blocked`, discuta o desbloqueio com o usuário — a transição em si (`BLOCKED → origem`) é comando de workflow e pertence ao `executing-tasks.md`, em branch de trabalho.

## 1. DIAGNÓSTICO

Objetivo: varredura read-only do que um sênior checaria num projeto sem backlog — saúde, governança e conhecimento. Não se contente com gates verdes: testes que passam podem estar testando o errado, ou não estar testando nada. Ideia de produto não vem da varredura: vem do usuário, no RELATO.

Agente deve executar nesta ordem:

1. `riteward show notes` (canal de captura; quase sempre vazio — isso é normal).
2. `riteward logs check` (puro, sem `--create-tasks`). Anote só erros reais novos; `INFO`/`WARN`/`DEBUG` e linhas de teste/simulação são ignorados. O check avança o offset dos logs: todo erro real visto aqui precisa chegar ao RELATO com o trecho copiado — o próximo `logs check` não o verá de novo.
3. `riteward refactor scan` (puro, sem `--create-tasks`, sem `--refresh-lines`). Anote novos que bloqueariam REVIEW, dívida que cresceu, dívida antiga e registrada.
4. `riteward check` e `riteward config validate`. `check` vermelho sem task aberta é candidata a task, não conserto direto. Se `check` estiver verde, **não** encerre o diagnóstico: prossiga para os passos 5 e 6 antes de concluir que o projeto está saudável.
5. Leia os arquivos de teste do projeto:
   - Identifique funções e métodos da base de código que não têm teste correspondente (arquivos de teste ausentes ou funções sem cobertura nos arquivos existentes).
   - Verifique se os testes existentes realmente exercitam comportamento real, e não só mocks, stubs ou assertivas triviais (ex: `expect(true).toBe(true)`).
   - Procure por TODOs, FIXMEs, `// @ts-ignore`, `// eslint-disable-next-line` e comentários de "temporário" no código-fonte.
   - Procure por código morto (funções exportadas nunca importadas, arquivos órfãos).
   - Anote cada gap com caminho + linhas.
6. Confira `git status --porcelain` e a branch atual (`git rev-parse --abbrev-ref HEAD`): árvore suja é trabalho não commitado em risco; branch de trabalho esquecida após merge é sobra de sessão anterior. Anote ambos para o RELATO e sugira a limpeza ao usuário; não commite, não restaure, não descarte, não troque de branch.
7. Releia a seção de avisos do `status` já rodado: workflows ativos largados, órfãs (proponha `riteward task repair <task-id>` ao usuário — reparo de governança, só executa com ok; com a task recuperada de volta ao backlog, este workflow encerra: siga o `executing-tasks.md` com ela), inconsistências, gerenciados editados, `local != CLI` (só reporte; `update` pertence ao `updating-riteward.md`, nunca a este workflow).
8. Higiene de conhecimento e docs: etiquetas por assunto (páginas de regras por tema, ex.: `docs/rules/*.md`, `riteward decision list`), `README.md`/`CHANGELOG.md`/`docs/` com drift da última entrega, `docs/audits/` faltando. Não vasculhe tasks antigas uma por uma: a memória mora nas etiquetas, uma página por assunto.
9. Para cada achado, aplique a triagem antes de propor: identifique o assunto, leia a etiqueta correspondente e confira `riteward task list` (inclui concluídas). Problema já resolvido não vira task nova — vira retomada da original, marcada para o RELATO como proposta de retomada (o `reopen` em si nunca roda aqui). Só problema novo vira proposta.

Não faça no DIAGNÓSTICO:

- Não rode `--create-tasks` em `logs check` nem em `refactor scan`: neste workflow toda criação passa por `task create` (gated por `new_tasks_review`), nunca pelos atalhos — é o que mantém a chave com escopo exclusivo.
- Não rode `--refresh-lines`, `--force`, `update`, `init`, `add` ou `remove`.
- Não execute `workflow start/advance/commit/cancel/push/reopen`, não escreva código, não faça commit.
- Não crie branch: este workflow é read-only até a decisão de criação.
- Não edite `owned` (`.riteward/riteward.md`, `.riteward/skills/using-riteward.md`) nem `state/` na mão.
- Não invente severidade: sem evidência (linha de log, arquivo + linhas, gap de doc, dor relatada), não há proposta.

Gate de saída: só avance para o RELATO com a lista de achados triados (novos vs reincidências descartadas) em mãos. Sem achado, o relato é "projeto saudável, nada a propor" — ainda assim reporte, não suma em silêncio.

## 2. RELATO E PROPOSTA

Objetivo: conversa natural com o usuário — dizer que o backlog está vazio, mostrar o que encontrou e propor próximos passos com fundamento. O agente propõe com base no diagnóstico; não pergunte ao usuário o que ele quer fazer.

Agente deve executar nesta ordem:

1. Relate em linguagem natural: backlog vazio confirmado (cite `status` + `next`), `blocked` existentes se houver, e o resumo do diagnóstico (saúde dos gates, logs, monolíticos, árvore suja, governança, docs, gaps de teste encontrados).
2. Apresente cada proposta com: título curto no imperativo, porquê (valor para o projeto-alvo), fonte/evidência (nota, trecho de log, caminho + linhas, gap de doc) e score `--priority` sugerido com justificativa de ordenação (por que este número encaixa antes/depois do resto futuro). Como âncora de consistência, use as pontuações dos geradores nativos: erro de log 70–80; monolítico conforme o excesso de linhas (50–95); gate vermelho puxa para o topo (90+); gap de teste 60–85; drift de doc 20–40. Vale qualquer tipo que faça sentido no alvo: bug, refactor, docs, DX, teste, dependência, produto. Sem teto de quantidade, sem categoria proibida — mas cada item precisa de evidência.
3. **Proponha ao menos uma melhoria ou funcionalidade real do projeto-alvo:** antes de encerrar a lista, sugira pelo menos uma implementação que torne o projeto mais completo, mais útil ou que remova uma limitação óbvia do que já existe. Não invente do nada: baseie-se no que encontrou no diagnóstico (tipo do projeto, gaps, pontos fracos, funcionalidades ausentes que fazem sentido para esse domínio). Exemplo: se o projeto é uma API REST sem endpoint de saúde, proponha "adicionar endpoint /health"; se não tem paginação em listagens, proponha paginação. A proposta precisa de título, porquê, fonte/evidência e prioridade sugerida, como as demais.
4. **Agrupe antes de propor:** itens triviais e similares (mudança de uma linha no README, pequenos ajustes de estilo, correções de changelog, atualizações pontuais de doc) não vira uma task cada. Junte-os em uma única task de limpeza com título composto (ex.: "Corrigir pequenos problemas de documentação") e liste cada sub-item no corpo da task. Problemas de código, lógica ou comportamento complexos vira cada um uma task separada. Não crie task só para mudar uma linha no README.
4. Não mencione skills, workflows, templates ou chaves de config pelo nome. Fale do trabalho ("encontrei X, proponho Y com prioridade Z porque..."), não do mecanismo.
5. Com `permissions.new_tasks_review: true` (padrão), pare aqui e aguarde decisão explícita: o usuário pode aprovar tudo, aprovar por item, ajustar prioridade/escopo, ou dispensar. Pausa obrigatória — silêncio, dúvida, relato paralelo ou mudança de assunto não são aprovação. Sem ela, nada é criado.
6. Com `permissions.new_tasks_review: false`, não pause: siga direto para a CRIAÇÃO e entregue diagnóstico, propostas e tasks criadas em um único relato. A resposta do usuário a qualquer proposta vira task depois, como pedido direto, sem pausar a criação de agora.

Não faça no RELATO E PROPOSTA:

- Não crie tasks no modo `true` antes da aprovação explícita.
- Não peça aprovação em mensagem que trata de outro assunto: a pergunta de criação só faz sentido com a lista de propostas na mesa e o diagnóstico verde.
- Não reescreva a evidência para caber na proposta: sem fonte, o item cai da lista.
- Não empurre `update` do Riteward como proposta deste workflow: defasagem `local != CLI` se reporta e se delega ao `updating-riteward.md` com o ok do usuário, nunca criada como task de produto.
- Não re-proponha na mesma conversa o que o usuário já dispensou; só retome com achado novo ou a pedido dele.

Gate de saída: modo `true` exige decisão explícita registrada (o que criar, o que descartar, ajustes de prioridade); modo `false` avança livre. Sem decisão no modo `true`, o trabalho encerra no relato. Pedido novo do usuário durante a conversa encerra este workflow: crie a task pedida com `riteward task create` (pedido direto não exige a aprovação de `new_tasks_review`) e siga o `executing-tasks.md` com ela.

## 3. CRIAÇÃO

Objetivo: transformar propostas aprovadas (ou triadas, no modo autônomo) em tasks bem formadas no backlog.

Agente deve executar nesta ordem:

1. Confirme o modo pela config: confira `permissions.new_tasks_review` em `.riteward/config.yaml` antes de agir. Em dúvida, assuma `true`.
2. No modo `true`, confira que há aprovação explícita para cada item (ou global para a lista). Sem ela, pare e reporte — não crie.
3. Para cada item aprovado (ou triado, no modo `false`), rode `riteward task create "Título" --priority <n> --description "Origem: <fonte/evidência>"`. `--priority` é obrigatório: escolha o número que ordena a fila futura, sem inflar tudo para o topo. Registre a origem no corpo via `--description`. Task vinda de nota: apague a nota em seguida (protocolo do canal de captura). Exceção: se o item for uma **correção pequena** (regra de decisão em `.riteward/skills/using-riteward.md`), crie com `riteward task create "fix: Título" --quickfix --description "Origem: ..."` — o `--priority` é opcional (default 70) e o ciclo é reduzido.
4. Reincidência confirmada na triagem nunca vira task nova: relate a retomada (task original + motivo) e deixe o `riteward workflow reopen <task-id> --reason "reincidência: ..."` para o início da execução dela — nunca aqui, pois este workflow tipicamente roda na `main`, onde a CLI recusa comandos de workflow. Só problema novo vira `task create`.
5. Após criar, rode `riteward task list` para conferir o backlog resultante e reporte: IDs criados, prioridades, o que foi descartado e porquê. Não inicie nenhuma task aqui: a escolha volta para `riteward task next` + `executing-tasks.md` na próxima sessão — ou agora, se o usuário pedir para seguir.

Não faça na CRIAÇÃO:

- Não use `logs check --create-tasks` nem `refactor scan --create-tasks` como atalho: a criação deste workflow é só via `task create`, para que `new_tasks_review` valha.
- Não rode `reopen` (nem `start`/`advance`/`commit`/`cancel`/`push`): comandos de workflow são recusados na `main`; a retomada de reincidência pertence ao início da execução.
- Não crie task para problema já resolvido: triagem primeiro, sempre.
- Não crie branch nem escreva código: criar backlog não é executar backlog.
- Não crie tasks no modo `true` além do aprovado: global só com aceite para tudo; por item só os itens aprovados.
- Não crie uma task separada para cada item trivial: use a task de limpeza agrupada definida no RELATO.

## Referência rápida

```bash
riteward status
riteward task next
riteward task list --status blocked
riteward show notes
riteward logs check
riteward refactor scan
riteward check
riteward config validate
git status --porcelain
git rev-parse --abbrev-ref HEAD
riteward task list
riteward task create "Título no imperativo" --priority 70 --description "Origem: ..."
riteward task create "fix: Título da correção pequena" --quickfix --description "Origem: ..."
```
