# Contexto

Registre a investigação da tarefa usando esta estrutura. É o artefato da
DISCOVERY: criado no início da etapa, preenchido durante ela e congelado ao
avançar para PLANNING — o plano consome este registro em vez de re-derivar o
contexto. Metadados no topo:

- task: (referência ao ID da tarefa)
- author: (quem investigou)
- created_at: (data)

## Problema

(O problema investigado e sua origem — nota do usuário, log monitorado,
conversa, auditoria — com a evidência copiada: trecho de log, mensagem de
erro, caminho e linhas. Não parafraseie a evidência: copie.)

## Memória consultada

(Etiquetas do assunto lidas antes de investigar — páginas de regras por
tema, decisões e tasks de origem, anotadas no SETUP. Ex.:
`docs/rules/backend-pipeline.md (lição 26)`, `decision-031`, `task-246`.
Se a etiqueta já descrevia o problema, cite-a em vez de redescobrir. Se o
assunto ainda não tem etiqueta, registre: "Nenhuma encontrada".)

## Código lido

(Cada área ou arquivo aberto durante a investigação, com o que é relevante
para a tarefa: ponto de entrada, fluxo de dados, dependências, convenções.
Não liste arquivo que você não abriu.)

- (Arquivo/área — o que ele faz e por que importa para a tarefa)

## Superfície de composição

(Se a task remove, migra ou muda um affordance (CTA, prop, handler): todos
os call sites que instanciam o componente, props/flags com default ou valor
por modo (sim/dev/prod) e engines/providers que variam por modo (mock vs.
real). Se a task não toca affordance, registre: "Nenhum componente
afetado".)

- (Call site — arquivo e modo em que monta o recurso — observação)

## Dívida e riscos

(Riscos e incertezas mapeados, cada um com a evidência que o sustenta, e o
resultado do `riteward refactor scan` nas áreas que a tarefa vai tocar —
dívida candidata a task de refatoração.)

- (Risco ou dívida — evidência)

## Perguntas em aberto

(O que só o usuário pode responder e ainda não foi perguntado. Se alguma
pergunta bloquear o progresso, a tarefa deve ir para BLOCKED em vez de
seguir com premissa inventada. Se não houver, registre: "Nenhuma".)

- (Pergunta — por que importa)

## Conclusão da investigação

(Síntese curta: o que se sabe, o que segue incerto e o que a PLANNING deve
considerar. É o resumo que o plano consome.)
