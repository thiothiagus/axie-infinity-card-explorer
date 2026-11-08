# Plano

Descreva o plano técnico usando esta estrutura. Metadados no topo:

- task: (referência ao ID da tarefa)
- author: (quem escreveu)
- created_at: (data)

## Contexto

(Descrição do cenário atual e por que este plano é necessário)

## Objetivo

(O que este plano visa alcançar)

## Abordagem

(Estratégia técnica escolhida e por quê)

## Alternativas consideradas

1. (Alternativa A — descrição e por que não foi escolhida)
2. (Alternativa B — descrição e por que não foi escolhida)

## Componentes do recurso

(Todos os lugares que compõem o recurso tocado pela task — não só o arquivo dono: call sites que instanciam o componente, props/flags com default ou valor por modo e engines/providers que mudam o comportamento. Para cada um, registre se a mudança deixa o recurso inacessível em algum modo de uso. Se a task não remove nem migra affordance, registre: "Nenhum componente afetado".)

- (Call site — arquivo e modo em que monta o recurso — veredito: mantido / afetado de propósito / corrigido no escopo)

## Passos

1. (Passo concreto — onde: arquivos — como verificar)
2. (Segundo passo concreto — onde: arquivos — como verificar)
   (etc.)

## Riscos

- (Risco identificado e mitigação)

## Critérios de sucesso

(Cada critério de aceitação da task deve estar coberto aqui ou nos Passos.)

- [ ] (Critério verificável 1)
- [ ] (Critério verificável 2)

## Revisões

(Revise o próprio plano quantas vezes forem necessárias até considerá-lo completo:
contexto claro, passos concretos e ordenados, riscos com mitigação, critérios
verificáveis e escopo fechado. Registre cada iteração abaixo.)

- (Iteração 1 — o que foi revisto e ajustado)

## Aprovação

(Auto-audite o plano antes de marcar: confirme que todos os critérios da task estão cobertos, arquivos e comandos citados existem, alternativas foram pesadas e não restam placeholders. O checkbox é exigido no modo padrão (`permissions.plan_approval: true` ou ausente); com `permissions.plan_approval: false` no `.riteward/config.yaml`, o checkbox é dispensado, mas a auto-auditoria continua obrigatória.)

- [ ] Plano auto-auditado (critérios mapeados, arquivos verificados e sem placeholders)
