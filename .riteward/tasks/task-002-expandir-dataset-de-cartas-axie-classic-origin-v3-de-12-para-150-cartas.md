---
id: task-002
title: Expandir dataset de cartas Axie (Classic + Origin v3) de 12 para 150+ cartas
status: todo
priority: 70
created_at: 2026-11-08
---

# Expandir dataset de cartas Axie (Classic + Origin v3) de 12 para 150+ cartas

## Contexto

(Descreva a situação atual e inclua a origem da tarefa — nota do usuário, log monitorado, etc. — com referências, links e conversas relevantes.)

## Descrição

Origem: conversa do usuário (2026-11-08). O dataset atual em src/data/cards.json tem 12 cartas amostra (6 Classic + 6 Origin v3). Expandir para o dataset completo de ~150 cartas (origin-rosy tem ~150 Origin v3; site oficial tem cartas Classic). Adicionar campos faltantes: description, energyCost, actionType (Melee/Ranged/Support), skills, stats base por parte. Atualizar classes.json e parts.json com as classes/partes completas. Adicionar 1 teste automatizado que valida a integridade do dataset (todas as cartas tem campos obrigatórios, todas as classes presentes em classes.json tem pelo menos 1 carta, etc.).

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
