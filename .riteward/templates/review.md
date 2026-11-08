# Revisão

Descreva a revisão usando esta estrutura. Metadados no topo:

- task: (ID da tarefa)
- reviewer: (quem revisou)
- type: (automated | critical)
- created_at: (data)

## Resumo

(O que foi revisado)

## Itens verificados

(Marque `[x]` em cada item verificado de verdade, nunca por "acho que funciona".)

- [ ] (Item 1 — descreva o que foi verificado e o resultado)
- [ ] (Item 2)

## Testes automatizados

(O que mudou nos testes: criados, alterados, removidos — cada um com o
motivo. Resultado da auditoria da TESTING: remoção, pulo, snapshot
atualizado ou expectativa reescrita sem motivo registrado é achado
bloqueante e volta para IMPLEMENTATION antes de apresentar esta revisão.)

## Problemas encontrados

(Nenhum | Listar cada problema com severidade: blocker | warning | info)

## Veredicto

( **Aprovado** | **Aprovado com ressalvas** | **Revisão necessária** —
com justificativa. Com ressalvas: liste as ressalvas e só avance após
incorporá-las e confirmar de novo com o usuário.)

## Próximo passo

(O que deve ser feito após esta revisão)

## Bateria de testes manuais

(Passos detalhados para o usuário validar a implementação, baseados no
"Plano de testes manuais" da tarefa. No modo padrão
(`permissions.review_approval: true`), a bateria é executada pelo
USUÁRIO: a execução prévia pelo agente é só confiança de
desenvolvimento, não substitui a execução do usuário e não aprova
nada. No modo autônomo (`permissions.review_approval: false`), o
próprio agente executa a bateria e registra o resultado — o usuário
não executa nem aprova. Regras de escrita:
cada passo = um comando único, completo e copiável, colado literalmente
no terminal — em bloco de código próprio, sem placeholders como
`<caminho>`, sem prefixos coláveis como "powershell:" e sem comandos
que dependam de sessão anterior; use caminhos concretos com existência
verificada no momento da escrita e redija o "Esperado" a partir da
saída real observada, sem reescrevê-lo depois para bater com a saída.
Declare os pré-requisitos (estado da máquina, diretório corrente,
arquivos exigidos) e, se a bateria altera o estado da máquina (instala,
desinstala, encerra processo), inclua um passo final de restauração.
Cada critério de aceitação da task deve estar coberto por pelo menos um
passo; o que não estiver coberto é assumido como não entregue. Não
avançe sem o usuário executar e aprovar no modo padrão; no modo autônomo,
não avance sem executar a bateria e registrar a auditoria.)

1. **(Ação)** — Esperado: (resultado esperado) — Verificar: (como conferir)

   ```
   (comando único e copiável)
   ```

2. (etc.)

## Resultado da bateria

(Auditoria da execução da bateria. No modo padrão, quem executa é o
usuário: quando ele enviar os resultados (transcrição em arquivo ou
texto no chat), audite passo a passo antes de falar em aprovação.
No modo autônomo (`permissions.review_approval: false`), a transcrição
é da execução do próprio agente e o auditor é o agente — o registro
continua obrigatório. Em ambos os modos: confirme que todos os passos
da bateria aparecem na transcrição, compare a saída de cada um com o
"Esperado" e classifique as falhas — erro do comando corrige a bateria
(nova rodada); erro do código volta para IMPLEMENTATION; erro de
ambiente é BLOCKED. Rodada parcial, com falha ou não auditada não pode
ser aprovada nem avançada.)

- Origem: docs/audits/test-results-<task-id>.txt
- Auditor: (quem auditou) — (data)
- Vereditos: (passo a passo: "1: ok" ou "3: falha — causa", um por linha)

## Aprovação do usuário

(Esta seção só é exigida no modo padrão
(`permissions.review_approval: true`). No modo autônomo
(`permissions.review_approval: false`), o checkbox é dispensado e não
há pergunta de aprovação — e merge/delete da branch NÃO são
autorizados. No modo padrão: aprovação é resposta afirmativa inequívoca
à pergunta feita pelo agente depois da auditoria da bateria, quando
todos os testes passarem.
A pergunta não é fixa: elabore uma pergunta contextualizada com a task
e o resultado da auditoria. Não é aprovação: relato de execução
("testes executados"), silêncio, dúvida ou pergunta, pedido paralelo,
mudança de assunto ou aprovação de aspecto isolado — diante de resposta
ambígua, pergunte de novo, nunca infira. Não peça aprovação em mensagens
que tratam de outro assunto (ex: pedir para refazer teste, reportar erro).
Marque o checkbox somente após resposta afirmativa inequívoca,
registrando a citação literal, quem aprovou e a data. Ao marcar, o merge
e o delete da branch da tarefa ficam autorizados e devem ser executados
pelo agente após `COMPLETED` confirmado, sem novo pedido. Se marcou por
engano e o usuário questionar, desmarque com trilha honesta do
ocorrido e suspenda o avanço.)

- [ ] Testes executados e aprovados pelo usuário — (citação literal, quem, data)
