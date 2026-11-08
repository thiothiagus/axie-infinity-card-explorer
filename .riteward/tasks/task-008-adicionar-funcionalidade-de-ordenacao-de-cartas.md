---
id: task-008
title: Adicionar funcionalidade de ordenação de cartas
status: in_progress
priority: 60
created_at: 2026-11-08
---

# Adicionar funcionalidade de ordenação de cartas

## Contexto

Origem: gap de funcionalidade identificado durante desenvolvimento.

Situação atual: o projeto possui 198 cartas com sistema de filtros funcionando (busca por nome, filtro por geração/classe/parte via `useCardFilter`), mas sem opção de ordenação. As cartas aparecem na ordem original do JSON (`src/data/cards.json`). Usuários podem filtrar mas não podem reorganizar os resultados por critérios como nome alfabético, tier ou HP.

## Descrição

Origem: gap de funcionalidade — projeto tem 198 cartas com filtros (classe, parte, geração, busca) mas sem ordenação.

Escopo:
- Adicionar dropdown ou botões de ordenação na seção de controles
- Implementar ordenação por: nome (A-Z/Z-A), tier, HP (quando disponível)
- Manter ordenação ao aplicar filtros
- Adicionar testes para a nova funcionalidade

Valor: facilita navegação e descoberta de cartas por critérios além dos filtros existentes.

## Escopo

**Dentro do escopo:**

- Adicionar estado de ordenação no `App.tsx` (critério + direção)
- Criar novo componente `SortControl` na `src/components/`
- Adicionar lógica de ordenação no `useCardFilter` ou novo hook `useCardSort`
- Integrar controle de ordenação na seção `controls` do `App.tsx`
- Implementar ordenação por: nome (A-Z/Z-A), tier (quando disponível), HP (quando disponível)
- Manter ordenação ao aplicar/remover filtros
- Adicionar testes unitários para o novo componente e lógica de ordenação
- Atualizar tipos em `src/types/card.ts` se necessário

**Fora do escopo:**

- Alteração na estrutura de dados das cartas (`cards.json`)
- Ordenação por campos além de nome/tier/HP (ex.: energyCost, actionType)
- Persistência da ordenação escolhida (localStorage)
- Animação de transição ao reordenar

## Critérios de aceitação

- [ ] Controle de ordenação visível na seção de controles ao lado dos filtros
- [ ] Ordenação por nome A-Z ordena as cartas alfabeticamente crescente
- [ ] Ordenação por nome Z-A ordena as cartas alfabeticamente decrescente
- [ ] Ordenação por tier funciona corretamente (cartas sem tier aparecem no final)
- [ ] Ordenação por HP funciona corretamente (cartas sem HP aparecem no final)
- [ ] Ordenação persiste ao aplicar ou remover filtros de busca/geração/classe/parte
- [ ] Componente `SortControl` possui testes unitários cobrindo todas as opções
- [ ] Lógica de ordenação possui testes unitários cobrindo casos de borda (valores null, empates)

## Plano de testes manuais

1. **Abrir a aplicação**
   - Ação: Navegar para `http://localhost:2943` após rodar `npm run dev`
   - Esperado: Página carrega com todas as 198 cartas e controle de ordenação visível
   - Verificar: Controle de ordenação está presente na seção de controles

2. **Ordenar por nome A-Z**
   - Ação: Selecionar "Nome (A-Z)" no controle de ordenação
   - Esperado: Cartas reorganizadas em ordem alfabética crescente (primeira carta visível começa com letra inicial do alfabeto)
   - Verificar: Primeira carta da grid tem nome começando com letra inicial; última carta da grid tem nome começando com letra final

3. **Ordenar por nome Z-A**
   - Ação: Selecionar "Nome (Z-A)" no controle de ordenação
   - Esperado: Cartas reorganizadas em ordem alfabética decrescente
   - Verificar: Primeira carta da grid tem nome começando com letra final do alfabeto; última carta da grid tem nome começando com letra inicial

4. **Ordenar por tier**
   - Ação: Selecionar "Tier" no controle de ordenação
   - Esperado: Cartas reorganizadas por tier crescente (cartas sem tier aparecem no final)
   - Verificar: Primeiras cartas da grid possuem tier; cartas sem tier ficam no final

5. **Ordenar por HP**
   - Ação: Selecionar "HP" no controle de ordenação
   - Esperado: Cartas reorganizadas por HP decrescente (cartas sem HP aparecem no final)
   - Verificar: Primeiras cartas da grid possuem HP alto; cartas sem stats aparecem no final

6. **Ordenação persiste com filtros**
   - Ação: Ordenar por nome A-Z, depois filtrar por geração "Classic"
   - Esperado: Cartas filtradas mantêm ordenação alfabética
   - Verificar: Subset de cartas Classic está em ordem alfabética

7. **Testes unitários passam**
   - Ação: Rodar `npm test`
   - Esperado: Todos os testes passam incluindo novos testes de ordenação
   - Verificar: Saída do vitest mostra todos os testes verdes

## Notas

**SETUP - Memória consultada (2026-11-08):**
- Etiquetas consultadas: `docs/rules/` — nenhuma etiqueta de memória encontrada ainda
- Decisões consultadas: `riteward decision list` — nenhuma decisão registrada ainda
- Contexto: projeto novo sem memória acumulada; investigação começará do código existente

**DISCOVERY - Auditoria do corpo (2026-11-08T19:43):**
- Rodada 1: Completado Contexto, Escopo, Critérios de aceitação e Plano de testes manuais
- Rodada 2: Revisão completa — corpo perfeito, sem placeholders, descrição fiel, escopo fechado, critérios verificáveis, testes executáveis

**DISCOVERY - Investigação e contexto (2026-11-08T19:44-19:45):**
- Artefato criado: `.riteward/contexts/task-008.md`
- Código lido: `App.tsx`, `useCardFilter.ts`, `card.ts`, `CardGrid.tsx`, `FilterBar.tsx`, `SearchInput.tsx`
- Refactor scan: nenhum arquivo monolítico detectado
- Auditoria final: contexto completo, todas as seções preenchidas, sem placeholders, investigação registrada
- Pronto para avançar para PLANNING

_Notas sobre o progresso aqui; decisões relevantes viram registros via `riteward decision create`._
