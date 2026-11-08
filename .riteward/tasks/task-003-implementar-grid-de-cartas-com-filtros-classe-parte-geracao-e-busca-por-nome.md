---
id: task-003
title: Implementar grid de cartas com filtros (classe, parte, geração) e busca por nome
status: todo
priority: 80
created_at: 2026-11-08
---

# Implementar grid de cartas com filtros (classe, parte, geração) e busca por nome

## Contexto

(Descreva a situação atual e inclua a origem da tarefa — nota do usuário, log monitorado, etc. — com referências, links e conversas relevantes.)

## Descrição

Origem: conversa do usuário (2026-11-08). Implementar a UI principal do Card Explorer: grid de cartas (importando src/data/cards.json + src/assets/), filtros por geração (Classic/Origin v3), classe (6 classes por geração), parte (Ears/Eyes/Tail/Horn/Mouth/Back em Origin v3), busca por nome. Componentes: CardGrid, Card, FilterBar (chips de classe/partes), SearchInput. Estilizar com CSS puro ou CSS modules. Adicionar testes de renderização e filtragem. O mascote detetive (src/assets/mascote-detetive-com-lupa-e-carta.png) deve aparecer na página (ex.: cabeçalho ou empty state). Ao clicar numa carta, exibir detalhe (modal ou rota). Estado: usar useState/useMemo React puro (sem estado global por enquanto).

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
