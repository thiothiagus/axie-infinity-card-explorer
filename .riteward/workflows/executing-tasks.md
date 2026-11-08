# Workflow: executing-tasks

Guia operacional para agentes de código executarem o ciclo de uma tarefa governada pelo Riteward a partir do momento em que a tarefa já foi escolhida. A escolha (status, next) é coberta pela skill `.riteward/skills/using-riteward.md` e pelo `.riteward/riteward.md`; a triagem e o start estão na seção 0. SETUP. A CLI é a fonte de verdade para flags e valores (`riteward docs`, `riteward <comando> --help`); este arquivo diz **o que o agente deve fazer em cada etapa**.

## Convenções

- `<task-id>`: `task-001` (aceita `001`, `task-001`). A tarefa já chega escolhida; use `riteward task show <task-id>` só para ler detalhes.
- Todo `workflow advance/cancel/reopen` exige `--reason "motivo"`. Sem motivo, a CLI recusa.
- Transições para `FINALIZATION`, `COMPLETED` e `CANCELLED` pedem confirmação; use `--yes` / `-y` em modo não interativo. Exceção: com `permissions.review_approval: false` (modo autônomo), o avanço para `FINALIZATION` não pede confirmação.
- `status` (tarefa: `todo`, `in_progress`, `blocked`, `done`, `cancelled`) é diferente de `current_state` (workflow: `DISCOVERY` ... `CANCELLED`). O status sincroniza sozinho a cada transição; confira os dois com `riteward task show <task-id>`.
- Nunca execute `workflow start/advance/commit/cancel/push/reopen` na branch `main`/`master`. A CLI bloqueia. Crie branch isolada com nome da funcionalidade, não do ID: `feat/nome-curto`, `fix/nome-curto`.
- Não pule estados no fluxo padrão. Destinos válidos por estado: `DISCOVERY → PLANNING/IMPLEMENTATION/BLOCKED/CANCELLED`, `PLANNING → IMPLEMENTATION/BLOCKED/CANCELLED`, `IMPLEMENTATION → TESTING/BLOCKED/CANCELLED`, `TESTING → REVIEW/FINALIZATION/IMPLEMENTATION/BLOCKED/CANCELLED`, `REVIEW → FINALIZATION/IMPLEMENTATION/BLOCKED/CANCELLED`, `FINALIZATION → COMPLETED/IMPLEMENTATION/BLOCKED/CANCELLED`, `BLOCKED → origem ou CANCELLED`, `COMPLETED/CANCELLED → IMPLEMENTATION` (só via `reopen`).

## Fluxo Quickfix (Correções Simples e Pontuais)

**Correção pequena = `--quickfix`, sempre** — mesmo que o usuário não use a palavra "quick-fix". A decisão é sobre o **tamanho e a natureza da mudança**, não sobre o esforço de diagnóstico: um bug de 6 linhas já diagnosticado é quickfix, mesmo que a task anterior (a de investigação) tenha sido pesada.

Use o Quickfix para correções pequenas onde:
1. **Causa certa**: a causa raiz e o conserto são óbvios de imediato (ex.: typo, 1 linha de chamada incorreta, parâmetro faltante, fix de fixture).
2. **Escopo pontual**: diff menor que ~20 linhas em 1–2 arquivos.
3. **Zero incerteza de design**: há apenas uma forma correta de consertar, sem alternativas a ponderar nem tradeoffs que exijam aprovação de plano.

Use a task padrão (ciclo completo) quando **qualquer** item acima falhar: feature nova, refatoração, mudança de contrato (API, schema, estado/FSM, evento), trabalho multi-domínio — ou quando a **investigação** (e não a correção) for o trabalho principal. Em caso de dúvida, escolha o padrão — mas **diga no relatório final qual modo escolheu e por quê**, para o usuário corrigir em uma linha se discordar.

Ciclo do Quickfix (rápido e rastreável):
1. Branch: crie branch isolada (`git checkout -b fix/nome-curto`).
2. Task: registre com `riteward task create "fix: título" --quickfix` (cria `.riteward/tasks/task-<id>-*.md` enxuto com Problema, Correção e Verificação; `--priority` é opcional, default 70 — 70 é só âncora: calibre pelo custo/urgência para não inflar a fila com micro-correções).
3. Início: `riteward workflow start <task-id>` (inicia diretamente em `IMPLEMENTATION`, pulando DISCOVERY e PLANNING formais).
4. Código: faça a correção e ajuste/adicione o teste automatizado correspondente.
5. Testes: `riteward workflow advance <task-id> --to TESTING --reason "código corrigido"`.
6. Validação e avanço: rode `riteward check` e avance com `riteward workflow advance <task-id> --to FINALIZATION --reason "testes verdes"` (os quality gates rodam automaticamente no avanço, dispensando revisão manual).
7. Finalização: atualize docs/SemVer conforme necessário (`riteward version bump --level patch` para a versão do projeto-alvo) e finalize com `riteward workflow commit <task-id> --message "fix: resumo" --yes` (avança para `COMPLETED` e sincroniza status para `done`).
8. Encerramento: faça o merge local na `main` e delete a branch `fix/...`.

O ciclo leve remove a cerimônia (contexto de investigação, plano, revisão), não a confiança: `riteward check` completo, teste de regressão, CHANGELOG + bump de versão e lição na memória continuam obrigatórios. A seção `## Verificação` da task quickfix é gateada como critério de aceitação: item desmarcado bloqueia o `→ COMPLETED` (use `--force` só em último caso).

---

## 0. SETUP

Objetivo: sair da `main`, triar pendências e entrar em `DISCOVERY` com a task escolhida.

Agente deve executar nesta ordem:

1. Conferir a branch com `git rev-parse --abbrev-ref HEAD`; se for `main`/`master`, criar e trocar agora (`git checkout -b feat/...` ou `fix/...`, pelo nome da funcionalidade, não o ID). É proibido trabalhar na `main`. Conferir também `git status --porcelain`; se a árvore já vier suja de sessão anterior, reporte antes de continuar.
2. Rodar `riteward show notes`; se houver nota, antes de criar qualquer task confira se ela descreve um problema já resolvido: identifique o assunto, leia a etiqueta correspondente e procure a tarefa original (`riteward task list` inclui as concluídas). Se for reincidência, não crie task nova — retome a original (`riteward workflow reopen <task-id> --reason "reincidência: ..."`) ou registre a reincidência nela. Só crie se for problema novo: se for correção simples/pontual (typo, 1 linha de ajuste), crie com `riteward task create "fix: ..." --quickfix`; se for tarefa completa, use `riteward task create "Título" --priority <0-100>`, e apague a nota. Registre a origem no corpo da criada (`Origem: nota do usuário`, via `--description`). As criadas vão para o backlog; a atual continua sendo a escolhida.
3. Rodar `riteward logs check`; se houver erro real persistente em produção que mereça task, aplique a mesma triagem do passo 2 (etiqueta do assunto + tarefas concluídas): erro de problema já resolvido não vira task nova — vira retomada da original. Erros pontuais de teste devem ser ignorados ou resolvidos via quickfix. Só registre tasks de manutenção para erros novos de produção, anotando arquivo e trecho do erro no corpo de cada task gerada.
4. Reler a task escolhida com `riteward task show <task-id>` (descrição, escopo, critérios de aceitação, plano de testes manuais).
5. Consultar a memória do assunto antes de investigar: identifique o assunto da task (ex.: transcrição de áudio, janela/interface, salvamento de arquivos, renderização) e leia a etiqueta correspondente — as páginas de regras por tema (ex.: `docs/rules/*.md`) e os registros de decisão (`riteward decision list`). Anote em `## Notas` da task quais etiquetas consultou e o que já se sabia sobre o problema (a DISCOVERY transfere essa anotação para `## Memória consultada` do artefato de contexto). Não vasculhe as 200 tarefas antigas: a memória mora nas etiquetas, uma página por assunto.
6. Iniciar com `riteward workflow start <task-id>` (estado inicial `DISCOVERY`).
7. Confirmar com `riteward workflow show <task-id>`: esperado `current_state: DISCOVERY` com histórico de 1 entrada (`null → DISCOVERY`).

Não faça no SETUP:

- Não troque de task: fixe o `<task-id>` da escolhida no início; as tasks criadas a partir de notes/logs vão para o backlog, nunca assumem o lugar.
- Não crie task para problema já resolvido: notes e logs passam pela triagem dos passos 2–3 (etiqueta + tarefas concluídas) antes de virar task nova; reincidência retoma a original, não duplica.
- Não pule a consulta à memória do assunto: investigar sem ler a etiqueta é retrabalho — o passo 5 existe para reaproveitar o que o projeto já aprendeu.
- Não edite arquivos da task (não preencha placeholders): SETUP é só leitura; completar descrição, escopo, aceitação e testes manuais é trabalho de `DISCOVERY`.
- Não rode `start` em outro ID nem repita o `start`: exatamente 1x, sempre no `<task-id>` fixado.
- Não rode `logs check --create-tasks` sem antes ver erro real no `check` puro.
- Não avance estado nem antecipe gates: sem `advance`, sem `check`/`refactor scan`/commit, sem `init`/`update`. SETUP termina no `workflow show`.

## 1. DISCOVERY

Objetivo: entender o problema antes de propor solução — e registrar esse entendimento no artefato de contexto, que a PLANNING consumirá.

Agente deve executar nesta ordem:

1. Completar o corpo da task — editar `.riteward/tasks/task-<id>-*.md`: descrição real, escopo dentro/fora, aceitação verificável (sem `Critério de aceitação N`, sem `(parênteses)`, sem vazio), plano de testes manuais com ação/esperado/verificar. Regra: completar lacunas, nunca apagar conteúdo existente. Fazer isso agora evita retrabalho: a CLI cobra corpo sem placeholders na saída.
2. Auditar o corpo em loop até perfeito: releia o arquivo inteiro a cada rodada e só pare quando não houver mais nada a melhorar (descrição fiel ao problema, escopo fechado, critérios verificáveis, testes executáveis), registrando cada rodada em `## Notas`.
3. Criar o artefato de contexto com `riteward context create <task-id>` (gera `.riteward/contexts/<task-id>.md` a partir de `.riteward/templates/context.md`), antes de investigar o código. Ele é o registro da investigação desta etapa — problema, memória consultada, código lido, superfície de composição, riscos, perguntas — e é o que o plano consumirá. Achados de investigação moram nele, não em `## Notas` da task.
4. Preencher o contexto com a investigação: ler o código e docs das áreas citadas na tarefa, junto com o que a memória do assunto já dizia (etiquetas consultadas no SETUP passo 5 — transfira a anotação de `## Notas` para `## Memória consultada` do contexto) e registre cada área aberta em `## Código lido` (só o que você abriu de verdade). Mapear riscos e incertezas. Não varrer o repositório inteiro. Quando a task remove, migra ou muda um affordance (CTA, prop, handler), mapear a superfície de composição em `## Superfície de composição` do contexto (vira a seção `## Componentes do recurso` do plano): todos os call sites que instanciam o componente, props/flags com default ou valor por modo (sim/dev/prod, default vs. prop explícito) e engines/providers que variam por modo (mock vs. real). Se a solução reaproveita aprendizado anterior, cite a fonte no contexto (etiqueta, decisão ou task de origem) em vez de redescobrir em silêncio. O que só o usuário pode responder vai em `## Perguntas em aberto` — e, se bloquear o progresso, é `BLOCKED`, não premissa inventada.
5. Rodar `riteward refactor scan` nas áreas que vai tocar para mapear dívida monolítica (a saída agrupa novos que bloqueiam, dívida antiga e dívida registrada — `--new-only` lista só o que bloqueia) e registrar o resultado em `## Dívida e riscos` do contexto: riscos mapeados (viram a seção `## Riscos` do plano) e monolíticos do scan (dívida candidata — o plano decide se vira task de refatoração).
6. Fechar o contexto: preencher `## Problema` (origem + evidência copiada, não parafraseada) e `## Conclusão da investigação` (o que se sabe, o que segue incerto, o que a PLANNING deve considerar), e auditar em loop contexto + task lado a lado até todas as seções preenchidas e sem placeholders do template. Ao avançar para PLANNING o contexto congela: descobertas posteriores viram `## Notas` da task ou registro via `riteward decision create`, nunca edição silenciosa do contexto congelado.

Regra da etapa: em qualquer ponto, se faltar informação que só o usuário tem (requisito ambíguo, acesso, decisão de produto), vá para `BLOCKED` com o motivo em vez de inventar premissa.

Não faça no DISCOVERY:

- Não escreva código nem faça commit: implementação é trabalho de `IMPLEMENTATION`.
- Não crie plano nem revisão: `plan create` é de `PLANNING`, `review create` é de `REVIEW`; `context create` é daqui — crie-o antes de investigar, não no fim da etapa.
- Não despeje a investigação em `## Notas` da task: achados da DISCOVERY moram no artefato de contexto (`.riteward/contexts/`); `## Notas` é só progresso.
- Não ignore a memória do assunto: se a etiqueta já descrevia o problema ou a solução, siga por ela e cite a fonte no contexto — redescobrir o que já se sabia é retrabalho.
- Saída só via `--to PLANNING` (ou `BLOCKED`/`CANCELLED` com motivo).

Gate de saída: a CLI bloqueia `DISCOVERY → PLANNING` enquanto o corpo da tarefa tiver placeholders do template (complete descrição, escopo, critérios e testes manuais no passo 1) e enquanto o artefato de contexto não existir ou tiver placeholders do template (`--force` contorna apenas os placeholders de corpo e contexto, com aviso; a existência do contexto não é contornada). Só avance quando estiver tudo pronto: corpo perfeito + contexto completo (problema, memória citada, áreas lidas, riscos listados, scan registrado, conclusão fechada). Avance com `riteward workflow advance <task-id> --to PLANNING --reason "descoberta concluída"`.

## 2. PLANNING

Objetivo: plano técnico completo e auto-auditado pelo agente. Sem pausa humana obrigatória. A exigência do checkbox de `## Aprovação` depende de `permissions.plan_approval` no `.riteward/config.yaml`: `true` (padrão) exige o checkbox; `false` dispensa o checkbox.

Agente deve executar nesta ordem:

1. Criar com `riteward plan create <task-id>` (gera `.riteward/plans/<task-id>.md` a partir de `.riteward/templates/plan.md`).
2. Preencher contexto (fundamentado na `## Conclusão da investigação` do artefato de contexto congelado — consuma o registro, não re-derivede da memória), objetivo, abordagem, passos ordenados e concretos, riscos com mitigação, critérios de sucesso verificáveis e escopo fechado. Registre ao menos uma alternativa considerada e o motivo do descarte. Incorpore os riscos e a dívida candidata do artefato de contexto congelado (`.riteward/contexts/`, vindos do `DISCOVERY`); escopo restrito ao da task — se estourou, ajuste a task em vez de embutir. Cada critério de aceitação da task deve estar coberto por pelo menos um passo ou critério de sucesso; o que não estiver coberto não será feito. Preveja passos de criação/atualização de testes quando a task ou as convenções exigirem — ao mudar um affordance, cada modo relevante mapeado na superfície deve ter ao menos um teste que monte o componente pelo caminho real. Preencha a seção `## Componentes do recurso` (superfície de composição registrada em `## Superfície de composição` do contexto) com veredito por call site: mantido / afetado de propósito / corrigido no escopo.
3. Fundamentar cada passo no código real e na documentação do projeto antes de fechar: todo arquivo citado deve existir e ter sido aberto; todo comando citado deve existir; todo padrão citado deve seguir as convenções do projeto. Nenhum passo pode referenciar algo que você não verificou.
4. Auditar o plano em loop até perfeito: releia plano + task lado a lado a cada rodada e só pare quando estiver completo (contexto claro, passos concretos e ordenados, riscos com mitigação, critérios verificáveis, superfície de composição com veredito por call site, escopo fechado e sem nenhum placeholder), registrando cada rodada na seção `## Revisões` do plano.
5. Apresentar um resumo executivo do plano no chat para visibilidade do usuário (o que será feito, abordagem escolhida e arquivos afetados), sem pausar para aguardar resposta.
6. Marcar o checkbox em `## Aprovação` (`- [x] Plano auto-auditado...`) — exceto com `permissions.plan_approval: false`, que dispensa o checkbox (a auto-auditoria dos passos 3–4 continua obrigatória). Em ambos os modos, avançar imediatamente com `riteward workflow advance <task-id> --to IMPLEMENTATION --reason "plano auto-auditado"`. Aprovado, o plano congela: divergência relevante na implementação volta ao usuário (`BLOCKED` ou conversa), nunca improvisada em silêncio.

Não faça no PLANNING:

- Não escreva código: implementação é trabalho de `IMPLEMENTATION`, mesmo que pareça "um ajuste rápido".
- Não edite o contexto congelado (`.riteward/contexts/`): descobertas novas viram `## Notas` da task ou registro via `riteward decision create`.
- Nunca marque o checkbox sem ter verificado o código real e sem ter removido todos os placeholders do template.
- Saída só via `--to IMPLEMENTATION` (ou `BLOCKED`/`CANCELLED` com motivo).

Gate de saída: a CLI bloqueia `PLANNING → IMPLEMENTATION` se o plano não existir, se não tiver o checkbox marcado ou se contiver placeholders do template (`--force` contorna apenas placeholders com aviso; o checkbox não é contornado por `--yes`/`--force`). Com `permissions.plan_approval: false` o checkbox deixa de ser exigido — o plano existente e completo continua obrigatório. Só avance com o plano completo e auto-auditado.

## 3. IMPLEMENTATION

Objetivo: implementar exatamente o plano aprovado, passo a passo e com checkpoint por passo.

Agente deve executar nesta ordem:

1. Reler o plano congelado (`.riteward/plans/<task-id>.md`) e a task (`riteward task show <task-id>`) antes de tocar código; conferir `git status --porcelain` e confirmar que não está na `main`/`master` (branch era para ter sido criada no SETUP; se estiver na `main`, pare e reporte). Se a árvore já vier suja, reporte antes de continuar. Não escreva código sem o plano relido.
2. Executar os passos do plano na ordem, seguindo as convenções do projeto — testes novos previstos no plano se criam aqui, como qualquer outro passo; após cada passo, verificação leve antes de seguir: releia o arquivo editado, confira imports/tipos e faça um smoke rápido do trecho. `check` completo é trabalho de `TESTING`, não rode aqui.
3. Fidelidade total: todo desvio do plano, por menor que seja, anexe em `## Notas` da task (append, sem reescrever o resto) com o que mudou vs o plano + motivo. Se envolveu tradeoff, caminho descartado ou fuga relevante, registre também com `riteward decision create "Título"`.
4. Fazer checkpoint ao concluir cada passo do plano: `riteward workflow commit <task-id> --message "feat: resumo curto no imperativo"`. Mensagem curta, no imperativo, no padrão do histórico (`feat:`/`fix:`). Regra 1 passo = 1 commit, sem acumular passos e sem commitar quebrado. Checkpoint é commit de verdade: vale a lista never-commit da FINALIZATION. Checkpoint não muda o estado.
5. Manter critérios de aceitação atualizados no arquivo da task (`.riteward/tasks/task-<id>-*.md`); só marque `[x]` no critério que você executou e verificou de verdade, nunca por "acho que funciona".
6. Antes de sair, revise o diff completo contra o plano: `git status --porcelain`, `git diff` e `riteward workflow commit <task-id> --dry-run` para conferir o escopo. Checklist: sem escopo extra, sem arquivo indevido/temporário, sem debug/TODO temporário/código comentado, sem divergência não registrada em `## Notas`.

Regra da etapa: em qualquer ponto, se faltar informação que só o usuário tem ou travar por dependência externa, vá para `BLOCKED` com o motivo em vez de inventar premissa ou improvisar divergência em silêncio.

Não faça no IMPLEMENTATION:

- Sem escopo extra nem refactor oportunista ("já que estou aqui..."): fora do plano, fora do commit.
- Commits sempre via `workflow commit`, nunca `git commit` direto (pula escopo exibido, avisos e pós-commit).
- Não rode `check` completo aqui; não saia com árvore suja ou passo sem commit.
- Não edite o plano congelado sem o protocolo de plano B; não edite a task para justificar desvio.
- Não crie plano nem revisão: `plan create` é de `PLANNING`, `review create` é de `REVIEW`.
- Saída só via `--to TESTING` (ou `BLOCKED`/`CANCELLED` com motivo).

Gate de saída: só avance com tudo commitado + critérios verificados + diff revisado. Avance com `riteward workflow advance <task-id> --to TESTING --reason "implementação concluída"`. Se o plano se mostrar inviável, execute o protocolo de plano B: pause o código e apresente 2+ caminhos alternativos com tradeoffs (opções, não perguntas); escolhido um, registre em `## Revisões` do plano, desmarque o checkbox de aprovação, reapresente e só continue após nova aprovação explícita + remarcar.

## 4. TESTING

Objetivo: provar que a mudança passa nos gates do projeto, com `check` verde e tudo commitado.

Agente deve executar nesta ordem:

1. Rodar `riteward check` e corrigir toda falha em loop até verde: leia a saída, corrija a causa raiz, rode de novo. Não avance com vermelho.
2. Se mudou scripts, devDependencies ou configs de qualidade, sincronizar `quality_gates` em `.riteward/config.yaml`, validar com `riteward config validate` e rodar `riteward check` de novo até verde.
3. Commitar as correções via `riteward workflow commit <task-id> --message "feat: resumo curto no imperativo"`. Mensagem curta, no imperativo, no padrão do histórico (`feat:`/`fix:`). Checkpoint aqui também não muda o estado. Só avance com tudo commitado + `check` verde.
4. Se o `advance` travar em arquivo monolítico: dívida criada pelo próprio diff desta task se refatora agora (volte com `riteward workflow advance <task-id> --to IMPLEMENTATION --reason "motivo"`); `riteward refactor scan --create-tasks` é para dívida pré-existente, quando refatorar for fora do escopo. Se travar por dívida registrada que **cresceu desde o registro**, o esperado é refatorar o crescimento; só aceite com `riteward refactor scan --refresh-lines` quando o crescimento for inevitável e com motivo registrado em `## Notas` da task. Baseline se ajusta com motivo, nunca para acomodar o próprio diff.
5. Antes de avançar, audite os arquivos de teste: confira `git status --porcelain` e o diff dos caminhos de teste; cada teste criado, alterado ou removido precisa ter motivo em `## Notas` da task. Registre a auditoria feita (o que foi conferido e o resultado). Sem trilha, sem avanço.

Regra da etapa: falha que exige código novo → volte para `IMPLEMENTATION` com o motivo; dependência externa ou informação só do usuário → `BLOCKED`. Nunca mascare falha afrouxando gate ou baseline para ficar verde. Teste que expõe bug real se corrige no código, nunca silenciando o teste; teste obsoleto porque o comportamento mudou por decisão do plano pode ser atualizado, mas com o motivo registrado em `## Notas` da task.

Não faça no TESTING:

- Não avance com `check` vermelho; nunca force (`--force` não fura esse gate).
- Não afrouxe `quality_gates` ou baseline só para passar; sincronize só o que a mudança real exigiu.
- Não delete, pule (`skip`), comente nem esvazie teste para ficar verde; não atualize snapshots nem reescreva expectativas para bater com a saída atual, salvo comportamento mudado por decisão do plano (com motivo em `## Notas`).
- Não cale gate com supressão (`ts-ignore`/`any`/`eslint-disable`) nem atalho de shell (`|| true`); o verde que vale é o do `check` completo, não o de execução parcial de um arquivo/pasta.
- Não edite o plano congelado; não crie plano nem revisão aqui.
- Saída só via `--to REVIEW` (ou `IMPLEMENTATION`/`BLOCKED`/`CANCELLED` com motivo).

Gate de saída: o `advance` roda `quality gates` + `refactor scan` automaticamente; se falhar, o avanço é recusado mesmo que o `check` manual estivesse verde. Só avance com tudo commitado + `check` verde + nenhum teste criado/alterado/removido sem motivo registrado em `## Notas`. Avance com `riteward workflow advance <task-id> --to REVIEW --reason "testes verdes"`. Se falhar e precisar codar de novo, volte com `--to IMPLEMENTATION --reason "motivo"`.

## 5. REVIEW

Objetivo: revisão crítica + bateria de testes executada e auditada. Dois modos, definidos por `permissions.review_approval` no `.riteward/config.yaml` — confira a chave antes de agir. Modo padrão (`true`): bateria executada pelo usuário + aprovação explícita. Pausa obrigatória. Modo autônomo (`false`): o próprio agente executa a bateria, registra a auditoria e avança sem pausa, sem checkbox e sem pergunta de aprovação.

Agente deve executar nesta ordem:

1. Fazer revisão crítica própria em loop até sem achado bloqueante: escopo, edge cases, regressões, legibilidade, incluindo o diff dos testes automatizados (remoção, pulo, snapshot atualizado ou expectativa reescrita sem motivo registrado é achado bloqueante). Para task que toca affordance, revisar a superfície, não só o diff: cada call site da seção `## Componentes do recurso` do plano precisa de veredito honrado (mantido / afetado de propósito / corrigido no escopo) e nenhum modo de uso pode ficar com o recurso inacessível — modo órfão é achado bloqueante. Achado bloqueante → volte para `IMPLEMENTATION` com o motivo antes de criar a revisão; só crie revisão com diff limpo.
2. Criar com `riteward review create <task-id>` (gera `.riteward/reviews/<task-id>.md` a partir de `.riteward/templates/review.md`).
3. Preencher resumo, itens verificados, problemas com severidade e veredicto. Preencher a bateria de testes manuais passo a passo (ação, resultado esperado, como verificar), baseada no "Plano de testes manuais" da tarefa, com as regras de escrita: cada passo = um comando único, completo e copiável, em bloco de código próprio — sem placeholders (`<exe>`, `<caminho>`), sem prefixos coláveis (`powershell:`) e sem comandos que dependem de sessão anterior; caminhos concretos com existência verificada no momento da escrita; "Esperado" redigido a partir da saída real observada (a execução prévia pelo agente serve exatamente para isso); pré-requisitos declarados por passo (estado da máquina, diretório corrente, arquivos exigidos); passo final de restauração quando a bateria altera o estado da máquina (instala, desinstala, encerra processo). Cada critério de aceitação da task deve estar coberto por pelo menos um passo da bateria; o que não estiver coberto é assumido como não entregue. Preencher a seção `## Resultado da bateria` com o caminho padrão: `- Origem: docs/audits/test-results-<task-id>.txt`.
4. **Modo padrão** — entregar ao usuário o resumo + o que mudou nos testes automatizados + a bateria. A bateria é executada pelo USUÁRIO, sempre: a execução prévia pelo agente é confiança de desenvolvimento, não substitui a execução do usuário e não aprova nada. O resultado da execução deve ser salvo em `docs/audits/test-results-<task-id>.txt` (caminho padrão do projeto).
5. **Modo padrão** — auditar a execução antes de falar em aprovação: quando o usuário confirmar que executou os testes, procure o resultado em `docs/audits/test-results-<task-id>.txt`. Se o arquivo não existir, pergunte onde salvou. Confirme que todos os passos da bateria aparecem, compare a saída de cada um com o "Esperado" e classifique as falhas — erro do comando corrige a bateria e pede nova rodada; erro do código volta para `IMPLEMENTATION` com motivo; erro de ambiente é `BLOCKED`. Registre a auditoria em `## Resultado da bateria` da revisão (origem, veredito por passo, auditor e data). Rodada parcial, com falha ou não auditada não pode ser aprovada.
6. **Modo padrão** — somente após a auditoria da bateria e com todos os testes passando, formular a pergunta de aprovação ao usuário. A pergunta não é fixa: elabore uma pergunta contextualizada com a task e o resultado da auditoria, que faça sentido para o que foi feito. A aprovação é resposta afirmativa inequívoca a essa pergunta. Não é aprovação: relato de execução ("testes executados"), silêncio, dúvida ou pergunta, pedido paralelo, mudança de assunto ou aprovação de aspecto isolado. Diante de resposta ambígua, pergunte de novo — nunca infira. Não peça aprovação em mensagens que tratam de outro assunto (ex: pedir para refazer teste, reportar erro) — a pergunta de aprovação só faz sentido depois da auditoria, quando todos os testes passarem.
7. **Modo padrão** — só após aprovação inequívoca, marcar o checkbox em `## Aprovação do usuário` com a citação literal da resposta, quem aprovou e a data, e avançar com `riteward workflow advance <task-id> --to FINALIZATION --reason "revisão aprovada"`. A aprovação marcada autoriza o agente a fazer o merge e o delete da branch da tarefa depois de `COMPLETED` confirmado — sem novo pedido. Se marcou por engano e o usuário questionar, desmarque com trilha honesta do ocorrido e suspenda o avanço (o merge/delete autorizado cai junto). Se o usuário aprovar com ressalvas, incorpore-as e confirme de novo com ele antes de marcar. Se o usuário reprovar, volte com `riteward workflow advance <task-id> --to IMPLEMENTATION --reason "motivo da reprovação"`; o retrabalho refaz o ciclo (`IMPLEMENTATION → TESTING → REVIEW`), nunca direto para `REVIEW`.
8. **Modo autônomo (`review_approval: false`)** — executar a bateria você mesmo, passo a passo, salvando a transcrição em `docs/audits/test-results-<task-id>.txt`. Audite a própria execução com o mesmo rigor do passo 5 (todos os passos executados, saída comparada com o "Esperado"; erro do comando corrige a bateria e repete a rodada; erro do código volta para `IMPLEMENTATION` com motivo; erro de ambiente é `BLOCKED`) e registre a auditoria em `## Resultado da bateria` com você como auditor. Com a bateria verde e auditada, avance direto com `riteward workflow advance <task-id> --to FINALIZATION --reason "bateria executada e auditada pelo agente"`, sem pausa, sem checkbox e sem pergunta de aprovação. Neste modo, merge e delete da branch NÃO estão autorizados: exigem autorização explícita do usuário.

Regra da etapa: no modo padrão, REVIEW é espera, não execução — a bateria executa quem aprova (o usuário), a auditoria da execução vem antes da pergunta de aprovação e o avanço exige aprovação explícita (resposta afirmativa inequívoca à pergunta direta). Silêncio do usuário não é aprovação. No modo autônomo, REVIEW é execução: o agente roda a bateria, audita o resultado e avança sem checkbox nem pergunta. Nos dois modos, conserto de código é trabalho de `IMPLEMENTATION`, nunca aqui.

Não faça no REVIEW:

- Não escreva comandos da bateria com placeholders (`<exe>`, `<caminho>`), prefixos coláveis (`powershell:`) ou dependência de sessão anterior.
- Não execute a bateria no lugar do usuário nem trate a própria execução como aprovação (modo padrão; no modo autônomo a execução pelo agente é o fluxo esperado, mas não dispensa a auditoria registrada).
- Não interprete relato de execução ("testes executados"), silêncio, dúvida ou pedido paralelo como aprovação.
- Não avance com bateria parcial, com falha ou não auditada.
- Não reescreva o "Esperado" de um passo para bater com a saída observada.
- Não avance por conta própria nem marque o checkbox sem o usuário ter aprovado de verdade (modo padrão).
- No modo autônomo, não avance sem ter executado a bateria de verdade e registrado a auditoria; não faça merge nem delete da branch sem autorização explícita do usuário.
- Não peça aprovação em mensagens que tratam de outro assunto (ex: pedir para refazer teste, reportar erro). A pergunta de aprovação só faz sentido depois da auditoria da bateria, quando todos os testes passarem.
- Não escreva código nem faça commit aqui: conserto volta para `IMPLEMENTATION` com motivo.
- Não edite o veredito do usuário nem apresente revisão com achado bloqueante conhecido.
- Não crie plano aqui: `plan create` é de `PLANNING`.
- Saída só via `--to FINALIZATION` (ou `IMPLEMENTATION`/`BLOCKED`/`CANCELLED` com motivo).

Gates de entrada e saída:

- Entrada (`TESTING → REVIEW`): ver Gate de saída da `TESTING` (a CLI roda `quality gates` + `refactor scan` automaticamente no `advance`).
- Saída (`REVIEW → FINALIZATION`): bloqueada sem review existente, com comandos da bateria não copiáveis (placeholders/prefixos coláveis) ou com a auditoria de `## Resultado da bateria` não preenchida — essa checagem é contornável com `--force`, com aviso. No modo padrão, o checkbox de `## Aprovação do usuário` marcado é obrigatório e não é contornado por `--yes`/`--force`; com `permissions.review_approval: false`, o checkbox e a confirmação interativa são dispensados. Revisão criada com template antigo (sem as seções novas) só gera aviso. Se o usuário reprovar, volte com `--to IMPLEMENTATION --reason "motivo da reprovação"`.

## 6. FINALIZATION

Objetivo: documentar a entrega, versionar o projeto, entregar commit final limpo e encerrar com merge.

Agente deve executar nesta ordem:

1. Limpar temporários da sessão (scratch, dumps, logs locais).
2. Atualizar a documentação do projeto-alvo sobre o que esta task entregou e fazer o bump de versão — antes do pré-commit, para entrar no commit final. Vale só o projeto-alvo (nunca o `.riteward/` nem o bloco do Riteward no `AGENTS.md`):
   - Docs: auto-detectar `README.md`, `CHANGELOG.md` e o diretório `docs/` na raiz do alvo; atualizar o pertinente à task (o que mudou, como usar, o que migrou) ou criar a entrada/arquivo quando não existir. Descreva só o escopo desta task específica; sem reescrever histórico nem varrer docs alheios. Sem doc pertinente no projeto, registre em `## Notas` da task e siga.
   - Versão: auto-detectar o arquivo de versão do alvo (`package.json`, `Cargo.toml`, `pyproject.toml` ou equivalente) e aplicar SemVer pelo que a task fez: correção (`fix:`) → patch, funcionalidade compatível (`feat:`) → minor, quebra/incompatibilidade ou migração obrigatória → major. Sem arquivo de versão versionado, registre em `## Notas` e siga.
3. Guardar o aprendizado na memória do assunto: se a task ensinou algo reutilizável (causa-raiz confirmada, solução que funcionou, beco sem saída a evitar, diferença de ambiente como Windows vs. Linux), registre na etiqueta do assunto — a página de regras por tema (ex.: `docs/rules/*.md`) para regras e lições, ou um registro via `riteward decision create "Título"` para decisões. Cite a task de origem e a data. Com `permissions.knowledge_review: true` no `.riteward/config.yaml`, apresente a anotação ao usuário e só guarde após aprovação explícita; no padrão (`false` ou ausente), guarde direto.
4. Marcar critérios de aceitação (`- [x]`) na tarefa e remover placeholders — só `[x]` no que foi executado e verificado de verdade, nunca para forçar verde. Critério não entregue → volte para a etapa dona em vez de marcar. A CLI bloqueia commit final e `→ COMPLETED` com pendência (só `--force` contorna, com aviso explícito).
5. Pré-commit: `riteward check` verde + `riteward workflow commit <task-id> --dry-run` para conferir o escopo. Nessa ordem: marcar critérios e os passos 2–4 sujam a árvore, então o verde só vale depois deles. O commit leva tudo da árvore (`add -A`), então ler o `dry-run` é obrigatório: nunca commite segredos (`.env`, chaves `*.pem`/`*.key`, credenciais, tokens), estado do workflow (`.riteward/state/`), dependências (`node_modules/`), lixo de SO/IDE nem logs/dumps — e confira o `.gitignore` do projeto. Achou item proibido → remova da árvore (e garanta no `.gitignore`) antes de commitar; segredo que já vazou precisa ser trocado, não basta tirar do commit. Por fim, abra o diff (`git diff`) e confira que o conteúdo é só o planejado + docs/versão/memória + atualizações de task/review, sem sobra de debug, marcador de conflito ou edição acidental.
6. Commit final: `riteward workflow commit <task-id> --message "feat: resumo curto no imperativo" --yes`. Mensagem curta, no imperativo, no padrão do histórico (`feat:`/`fix:`). A CLI sincroniza a task para `done` antes do git e avança sozinha para `COMPLETED` depois do commit. Se o commit falhar, o estado permanece em `FINALIZATION`.
7. Pós-commit, espelhando o pré-commit: confira `git log -1` (mensagem certa, commit existe), `git show --stat HEAD` (arquivos commitados batem com o `dry-run`, sem item proibido) e `git status --porcelain` (deve estar limpo — a sincronização já foi incluída no commit); reporte qualquer arquivo indevido. Se sobrar sujeira do próprio arquivo da task em `COMPLETED`, rode `riteward workflow commit <task-id> --message "chore: sincroniza status da task" --yes` (modo limpeza, sem mudar o estado). Se item proibido entrou no commit, pare e reporte ao usuário em vez de seguir (segredo → precisa ser trocado; sem push). Por fim, confirme `riteward workflow show <task-id>` (esperado `COMPLETED`, status `done`); se não chegou lá, reporte em vez de fingir entrega.
8. Merge e delete da branch após `COMPLETED` confirmado — no modo padrão, já autorizados pela aprovação do REVIEW, sem novo pedido; no modo autônomo (`review_approval: false`), NÃO autorizados: peça autorização explícita do usuário antes de executar. A CLI não faz merge (só `riteward workflow push <task-id> --yes`, que exige `permissions.push` habilitado). Com a conclusão confirmada, prefira PR quando houver hospedagem; sem hospedagem, merge local na `main`/`master`. Delete a branch da tarefa só após merge confirmado. Push continua exigindo pedido explícito do usuário. Encerre reportando ao usuário: o que foi entregue (incluindo docs atualizados e nova versão), estado da branch (mergeado/deletado) e push (feito/pendente de pedido).

Regra da etapa: FINALIZATION não conserta nada — qualquer falha volta para a etapa dona (`check` vermelho → `TESTING`, código → `IMPLEMENTATION`, aprovação → `REVIEW`), nunca improvisada aqui.

Não faça no FINALIZATION:

- Nunca marque critério não verificado nem use `--force` para furar o gate de aceitação.
- Não escreva código nem refatore aqui, salvo docs/versão do passo 2: conserto volta para a etapa dona com motivo.
- Não emende nada após o commit final; pós-commit sujo se reporta, não se esconde.
- Sem push sem pedido explícito do usuário; merge e delete da branch após `COMPLETED` já estão autorizados pela aprovação do REVIEW (modo padrão) — no modo autônomo, exigem autorização explícita do usuário.
- A saída é o próprio commit final (avança sozinho para `COMPLETED`); `advance` aqui é só para voltar à etapa dona, com motivo.

## 7. COMPLETED, CANCELLED e BLOCKED

- `COMPLETED`: fim. Nada a fazer além de reportar.
- `BLOCKED`: use ao encontrar impedimento (`riteward workflow advance <task-id> --to BLOCKED --reason "o que falta"`). Ao resolver, a CLI só aceita voltar à origem ou ir para `CANCELLED`. Se o plano falhou e o usuário não tem a solução, execute o protocolo de plano B (alternativas com tradeoffs → revisa plano → desmarca e re-aprova); se nenhum caminho for viável, vá para `CANCELLED` com o motivo documentado em vez de apodrecer em `BLOCKED`.
- `CANCELLED`: para encerrar sem concluir (`riteward workflow cancel <task-id> --reason "motivo" --yes`). Não cancele `COMPLETED` nem `CANCELLED` de novo.
- `reopen`: para retomar `COMPLETED`/`CANCELLED` (`riteward workflow reopen <task-id> --reason "motivo"`). Volta para `IMPLEMENTATION` com status ressincronizado. Reabertura de estado não-final é recusada.

## Referência rápida

```bash
git checkout -b feat/nome-curto
riteward show notes
riteward logs check
riteward task show task-001
# memória do assunto: ler a etiqueta (docs/rules/*, riteward decision list) e anotar em ## Notas
riteward workflow start task-001
riteward workflow show task-001
riteward workflow advance task-001 --to PLANNING --reason "..."
riteward context create task-001
riteward plan create task-001
riteward workflow advance task-001 --to IMPLEMENTATION --reason "plano aprovado"
riteward workflow advance task-001 --to TESTING --reason "..."
riteward check
riteward workflow advance task-001 --to REVIEW --reason "..."
riteward review create task-001
riteward workflow advance task-001 --to FINALIZATION --reason "..." --yes
riteward workflow commit task-001 --dry-run
riteward workflow commit task-001 --message "feat: ..." --yes
riteward workflow show task-001
```
