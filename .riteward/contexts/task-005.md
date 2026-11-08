# Contexto — Adicionar testes unitários para componentes e hooks não cobertos (task-005)

Registre a investigação da tarefa usando esta estrutura. É o artefato da
DISCOVERY: criado no início da etapa, preenchido durante ela e congelado ao
avançar para PLANNING — o plano consome este registro em vez de re-derivar o
contexto. Metadados no topo:

- task: task-005
- author: Kiro (agente de código)
- created_at: 2026-11-08

## Problema

**Origem:** Diagnóstico de cobertura de testes do projeto.

**Evidência:**
- Cobertura atual: 28 testes em 5 arquivos
  - `src/App.test.tsx` (7 testes)
  - `src/components/CardDetail.test.tsx` (7 testes)
  - `src/components/FilterBar.test.tsx` (6 testes)
  - `src/components/SearchInput.test.tsx` (5 testes)
  - `src/components/CardGrid.test.tsx` (3 testes)

**Áreas sem cobertura direta:**
1. `src/components/Card.tsx` (83 linhas): funções `getInitials` e `getClassColor` + renderização condicional
2. `src/hooks/useCardFilter.ts` (42 linhas): função `filterCards` e hook `useCardFilter`
3. `src/App.tsx` (linhas 24-38): funções `getAvailableClasses` e `getAvailableParts`

**Problema:** Essas funções executam lógica de negócio importante mas dependem apenas de testes de integração para cobertura, tornando mais difícil detectar regressões específicas e diagnosticar falhas.

## Memória consultada

**Etiquetas verificadas:** `docs/rules/` (diretório não existe)

**Decisões verificadas:** `riteward decision list` retornou nenhuma decisão encontrada

**Conclusão:** Nenhuma memória prévia sobre testes unitários. Este é o primeiro trabalho estruturado em testes unitários no projeto — sem histórico prévio para reaproveitar.

## Código lido

- **`src/components/Card.tsx`** (83 linhas): Componente de apresentação de carta individual. Contém duas funções auxiliares não testadas:
  - `getInitials(name: string)`: extrai iniciais do nome (até 2 letras, uppercase)
  - `getClassColor(axieClass: string)`: mapeia classe para cor CSS com fallback '#888'
  - Renderização condicional: mostra `card.image` ou iniciais baseado na presença de imagem
  - Uso de memo para otimização
  
- **`src/hooks/useCardFilter.ts`** (42 linhas): Hook e função pura de filtragem de cartas. Exporta:
  - `filterCards(cards, filters)`: função pura que aplica filtros (generation, axieClass, part, search)
  - `useCardFilter(cards, filters)`: hook que usa useMemo para memoizar resultado
  - Normalização de busca: trim + lowercase + includes
  
- **`src/App.tsx`** (linhas 24-38): Duas funções helper no corpo do componente principal:
  - `getAvailableClasses(generation)`: retorna classes disponíveis por geração
  - `getAvailableParts(generation)`: retorna partes disponíveis por geração
  - Ambas lidam com `generation === 'all'` (dedup com Set) e lookups específicos
  
- **`src/components/SearchInput.test.tsx`**: Padrão de teste do projeto:
  - Usa vitest + @testing-library/react
  - Testes de renderização, interação (fireEvent), acessibilidade (roles, aria-labels)
  - Funções mock com `vi.fn()`
  
- **`vite.config.ts`**: Configuração de testes:
  - Ambiente: jsdom
  - Setup: `src/test/setup.ts` que importa '@testing-library/jest-dom'
  - Globals habilitados

- **`src/data/classes.json`** e **`src/data/parts.json`**: Fonte de dados para as funções helper (estrutura: `[{ generation, classes/parts }]`)

## Superfície de composição

Nenhum componente afetado.

## Dívida e riscos

**Resultado do `riteward refactor scan`:**
```
Nenhum arquivo monolítico detectado.
```

**Riscos mapeados:**

1. **Extração de helpers do App.tsx**: as funções `getAvailableClasses` e `getAvailableParts` estão dentro do componente App. Precisam ser extraídas para um módulo separado (`src/utils/generation.ts`) para serem testáveis isoladamente.
   - Evidência: funções definidas em linhas 24-38 de `src/App.tsx`
   - Mitigação: criar módulo utils, extrair funções, atualizar imports no App.tsx

2. **Funções não exportadas em Card.tsx**: `getInitials` e `getClassColor` não são exportadas.
   - Evidência: funções definidas nas linhas 15-26 de `src/components/Card.tsx` sem `export`
   - Mitigação: precisamos testá-las indiretamente via testes de renderização do componente Card, ou exportá-las explicitamente. Opção 1 (indireta) mantém o encapsulamento, opção 2 (exportar) facilita testes unitários puros.

3. **Dependência de dados JSON**: os testes de `generation.ts` dependerão dos dados reais em `classes.json` e `parts.json`.
   - Evidência: `getAvailableClasses` e `getAvailableParts` consomem `classesByGeneration` e `partsByGeneration` carregados desses arquivos
   - Mitigação: importar os dados reais nos testes ou mockear (preferência: dados reais para garantir integração correta)

**Dívida candidata:** Nenhuma dívida técnica detectada no scan.

## Perguntas em aberto

Nenhuma.

## Conclusão da investigação

**O que se sabe:**

- O projeto tem infraestrutura de testes funcionando (vitest + @testing-library/react + jsdom)
- Padrão de testes estabelecido: describe/it/expect, testes de renderização e interação
- Três áreas sem cobertura unitária direta identificadas:
  1. Card.tsx: 2 funções auxiliares + renderização condicional
  2. useCardFilter.ts: função pura de filtragem exportada
  3. App.tsx: 2 funções helper que precisam ser extraídas

**O que segue incerto:**

- Nada bloqueia o progresso. A decisão de exportar as funções privadas de Card.tsx foi tomada (Opção A).

**O que a PLANNING deve considerar:**

1. **Refatoração necessária**: extrair `getAvailableClasses` e `getAvailableParts` de App.tsx para novo módulo `src/utils/generation.ts`
2. **Exportação**: adicionar `export` às funções `getInitials` e `getClassColor` em Card.tsx para possibilitar testes diretos
3. **Quantidade mínima de testes**: Card.test.tsx (8+ testes), useCardFilter.test.ts (6+ testes), generation.test.ts (4+ testes)
4. **Padrão de testes**: seguir o estilo existente (vitest, @testing-library, describe/it/expect)
5. **Dados de teste**: usar dados reais de classes.json e parts.json nos testes de generation.ts para garantir integração correta
6. **Verificação**: todos os quality gates devem passar (test, typecheck, lint)
