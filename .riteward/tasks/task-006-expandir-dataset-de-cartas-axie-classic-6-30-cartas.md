---
id: task-006
title: Expandir dataset de cartas Axie Classic (6 → 30+ cartas)
status: todo
priority: 55
created_at: 2026-11-08
---

# Expandir dataset de cartas Axie Classic (6 → 30+ cartas)

## Contexto

(Descreva a situação atual e inclua a origem da tarefa — nota do usuário, log monitorado, etc. — com referências, links e conversas relevantes.)

## Descrição

Origem: disparidade de cobertura no dataset — src/data/cards.json tem 6 cartas Classic vs 192 Origin v3 (conforme README.md linha 67).

Escopo:
- Adicionar 24+ cartas Classic distribuídas pelas 6 classes (Plant, Bird, Aquatic, Bug, Reptile, Beast)
- Incluir variedade de tiers e stats
- Atualizar testes de integração (App.test.tsx linha 34) se o total de Classic mudar significativamente

Valor: balancear a cobertura entre gerações, tornando o explorador mais útil para jogadores de Axie Classic.

## Escopo

(Liste arquivos e áreas; seja explícito no que fica de fora.)

**Dentro do escopo:**

-

**Fora do escopo:**

-

## Critérios de aceitação

(Exemplo de critério verificável: - [ ] Buscar "acao" encontra "ação")

- [ ] Critério de aceitação 1
- [ ] Critério de aceitação 2

## Plano de testes manuais

(Como o usuário valida esta tarefa. Cada passo no formato Ação — Esperado — Verificar.
É a base da bateria de testes apresentada na etapa de REVIEW: escreva cada passo como
um comando único e copiável em bloco de código próprio, sem placeholders e sem
prefixos coláveis como "powershell:", porque o usuário vai executar a bateria colando
os comandos no terminal.)
(Exemplo: 1. Rodar a busca — Esperado: encontra "ação" — Verificar: task list)

1.

## Notas

_Notas sobre o progresso aqui; decisões relevantes viram registros via `riteward decision create`._
