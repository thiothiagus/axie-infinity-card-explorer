---
id: task-009
title: Expandir dataset com cartas Axie Classic reais via API GraphQL
status: in_progress
priority: 80
created_at: 2026-11-08
---

# Expandir dataset com cartas Axie Classic reais via API GraphQL

## Contexto

**Situação atual**: O dataset `src/data/cards.json` contém apenas **6 cartas fictícias de Axie Classic** (Plant, Bird, Aquatic, Bug, Reptile, Beast) com estrutura básica (stats HP/MOV/ATK/DEF, skills vazias, sem imagens reais, sem part específica). As 192 cartas restantes no dataset são de **Axie Origin v3**, com estrutura diferente (image hash, part específica, sem stats).

**Origem**: Task criada no backlog do projeto, prioridade 80.

**Referências úteis**:
- Card Explorer oficial Axie Classic: https://classic.axieinfinity.com/explorer/cards
- Repositório com recursos da comunidade: https://github.com/StephanAkkerman/axie-infinity-extras
- API Sky Mavis (Origins): https://api-gateway.skymavis.com/origins/v2/ (requer API key)
- GraphQL Gateway: https://graphql-gateway.axieinfinity.com/graphql (introspection desabilitada)

## Descrição

Substituir as 24 cartas fictícias por dados reais extraídos da API GraphQL do Axie Infinity. Usar o endpoint https://graphql-gateway.axieinfinity.com/graphql ou API oficial da Sky Mavis para obter cartas Classic autênticas com stats, habilidades e metadados corretos.

## Escopo

**Dentro do escopo:**

- Expandir o dataset `src/data/cards.json` com cartas reais de Axie Classic
- Investigar fontes de dados disponíveis (APIs públicas, datasets estáticos, Card Explorer oficial)
- Extrair dados autênticos de cartas Classic: nome, classe, parte do corpo, stats (HP/ATK/DEF/Speed), habilidades, tier, energia
- Manter compatibilidade com a estrutura atual do TypeScript (`src/types/index.ts`)
- Documentar a fonte de dados escolhida e o método de extração

**Fora do escopo:**

- Cartas de Axie Origin v3 (já estão no dataset com 192 cartas)
- Alteração da estrutura de tipos TypeScript existente
- Implementação de API em tempo real (foco em dataset estático JSON)
- Imagens das cartas (apenas metadados e stats)
- Funcionalidades de UI/filtros (coberto por outras tasks)

## Critérios de aceitação

- [ ] Dataset `src/data/cards.json` contém pelo menos 20 cartas de Axie Classic com dados reais (expansão de 6 para 20+)
- [ ] Cada carta Classic inclui: id, name, generation ("classic"), axieClass, part (tipo da parte do corpo), stats (HP/MOV/ATK/DEF), tier
- [ ] Cartas incluem habilidades (skills) com descrição, damage, shield e efeitos quando aplicável
- [ ] Todas as 6 classes Classic estão representadas (Plant, Bird, Aquatic, Bug, Reptile, Beast)
- [ ] Dados são autênticos e correspondem ao jogo oficial (verificável via Card Explorer)
- [ ] Estrutura JSON mantém compatibilidade com tipos TypeScript existentes em `src/types/index.ts`
- [ ] Arquivo `src/data/README.md` documenta a fonte dos dados e data da extração

## Plano de testes manuais

1. **Verificar quantidade de cartas Classic no dataset**

```bash
jq '[.[] | select(.generation == "classic")] | length' src/data/cards.json
```

**Esperado**: Retorna número >= 20 (expansão bem-sucedida)  
**Verificar**: Comparar com valor inicial de 6 cartas

2. **Verificar estrutura e completude das cartas Classic**

```bash
jq '[.[] | select(.generation == "classic")] | .[0] | keys | sort' src/data/cards.json
```

**Esperado**: Retorna array com chaves: ["axieClass", "generation", "id", "image", "name", "part", "skills", "stats", "tier"]  
**Verificar**: Todas as propriedades necessárias estão presentes

3. **Verificar distribuição por classes**

```bash
jq '[.[] | select(.generation == "classic")] | group_by(.axieClass) | map({class: .[0].axieClass, count: length})' src/data/cards.json
```

**Esperado**: Todas as 6 classes (Plant, Bird, Aquatic, Bug, Reptile, Beast) aparecem com pelo menos 3 cartas cada  
**Verificar**: Distribuição balanceada entre classes

4. **Verificar presença de habilidades nas cartas**

```bash
jq '[.[] | select(.generation == "classic" and (.skills | length) > 0)] | length' src/data/cards.json
```

**Esperado**: Retorna número >= 15 (maioria das cartas com habilidades)  
**Verificar**: Cartas não estão com skills vazias

5. **Validar tipagem TypeScript do dataset**

```bash
npm run typecheck
```

**Esperado**: Saída sem erros de tipo  
**Verificar**: Dataset é compatível com `src/types/index.ts`

6. **Verificar documentação da fonte**

```bash
cat src/data/README.md | grep -i "fonte\|source\|extração\|extraction"
```

**Esperado**: Arquivo existe e documenta fonte dos dados e data da extração  
**Verificar**: Rastreabilidade dos dados garantida

## Notas

**SETUP (2026-11-08)**: Consultei memória do assunto (dados de jogo, API externa, dataset JSON). Nenhuma decisão (`riteward decision list`) nem regra (`docs/rules/*.md`) encontrada — projeto novo, sem histórico prévio sobre integração de API ou estrutura de dados de cartas.

**DISCOVERY - Auditoria corpo da task (2026-11-08 23:04)**: Corpo completo e sem placeholders. Descrição fiel ao problema (expansão de 6 para 20+ cartas Classic reais), escopo fechado (foca em dataset estático, exclui UI e Origin v3), critérios verificáveis (quantidade, estrutura, classes, skills, tipagem, documentação) e testes executáveis (6 comandos copiáveis com jq/npm). Pronto para criar artefato de contexto.

**DISCOVERY - Investigação concluída (2026-11-08 23:19)**: Contexto preenchido com:
- Problema evidenciado (6 cartas fictícias, skills vazias)
- Código lido: `src/data/cards.json`, `src/types/card.ts`, `src/App.tsx`, hooks e utils
- Superfície: nenhum componente afetado (apenas expansão de dados)
- Riscos: APIs oficiais bloqueadas/autenticadas, endpoints secundários indisponíveis
- Decisões do usuário: curadoria manual via Card Explorer oficial, dataset estático, todas as cartas Classic existentes (~100-200)
- Contexto auditado em loop, completo e sem placeholders. Pronto para PLANNING.

_Notas sobre o progresso aqui; decisões relevantes viram registros via `riteward decision create`._
