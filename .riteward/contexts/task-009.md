# Contexto — Expandir dataset com cartas Axie Classic reais via API GraphQL (task-009)

Registre a investigação da tarefa usando esta estrutura. É o artefato da
DISCOVERY: criado no início da etapa, preenchido durante ela e congelado ao
avançar para PLANNING — o plano consome este registro em vez de re-derivar o
contexto. Metadados no topo:

- task: task-009
- author: Kiro (agente de código)
- created_at: 2026-11-08

## Problema

**Origem**: Task criada no backlog do projeto (prioridade 80).

**Situação atual evidenciada**:
```bash
$ jq '[.[] | select(.generation == "classic")] | length' src/data/cards.json
6
```

O dataset `src/data/cards.json` contém apenas **6 cartas fictícias de Axie Classic** (Plant, Bird, Aquatic, Bug, Reptile, Beast). Exemplo de estrutura atual de carta fictícia:

```json
{
  "id": "axie-classic-plant-mossy-leaf",
  "name": "Mossy Leaf",
  "generation": "classic",
  "axieClass": "Plant",
  "part": null,
  "tier": "B",
  "image": null,
  "stats": { "HP": 15, "MOV": 5, "ATK": 5, "DEF": 5 },
  "skills": []
}
```

Problemas identificados nas cartas fictícias atuais:
- `skills` vazio (sem habilidades descritas)
- `part` null (não especifica parte do corpo: Horn, Mouth, Back, Tail)
- `image` null (sem referência a assets visuais)
- Apenas 6 cartas, uma por classe — insuficiente para explorador de cartas

## Memória consultada

**SETUP**: Consultei `riteward decision list` (nenhuma decisão encontrada) e `docs/rules/*.md` (nenhum arquivo encontrado). Projeto novo, sem histórico prévio sobre integração de API ou estrutura de dados de cartas.

## Código lido

- **`src/data/cards.json`** (2209 linhas, 198 cartas): Dataset principal com 6 cartas Classic fictícias e 192 cartas Origin v3 reais. Estrutura Classic usa `stats: {HP, MOV, ATK, DEF}` e `skills: []`, enquanto Origin v3 usa `stats: null` e `part: "Horn"|"Mouth"|etc.` com `image: "<hash>"`.

- **`src/types/card.ts`** (27 linhas): Define tipos TypeScript do projeto.
  - `Generation = 'classic' | 'origin-v3'`
  - `Card` interface com propriedades: `id, name, generation, axieClass, part, tier, image, stats, skills, description?, energyCost?, actionType?`
  - `Stats` interface com `HP, MOV, ATK, DEF`
  - `skills` é array de strings (não há interface complexa para habilidades)

- **`src/App.tsx`** (79 linhas): Ponto de entrada da aplicação. Importa `cardsData from './data/cards.json'` (linha 11) e faz cast para `Card[]` (linha 15). Não há chamada de API em tempo real — apenas consumo do JSON estático.

- **`src/hooks/useCardFilter.ts`**: Hook de filtragem que opera sobre o array de cartas carregado do JSON.

- **`src/utils/generation.ts`**: Utilitários `getAvailableClasses()` e `getAvailableParts()` que derivam opções de filtro a partir do dataset.

## Superfície de composição

Nenhum componente afetado. A task apenas expande o dataset JSON estático (`src/data/cards.json`). A estrutura de tipos (`Card`, `Stats`, `Generation`) permanece inalterada. O carregamento do dataset em `src/App.tsx` (linha 11-15) continua idêntico — apenas o conteúdo do JSON muda, não a interface de consumo.

## Dívida e riscos

**Resultado do `riteward refactor scan src/data/`**:
```
Nenhum arquivo monolítico detectado.
```

**Riscos mapeados**:

1. **API GraphQL do Axie Infinity bloqueada para introspection**  
   **Evidência**: Tentativa de query `__schema` retornou:
   ```json
   {"errors": [{"message": "introspection has been disabled", "extensions": {"code": "INTROSPECTION_DISABLED"}}]}
   ```
   Tentativa de query `cards` retornou:
   ```json
   {"errors": [{"message": "parsing error: no field `cards` in type `Query`", "extensions": {"code": "PARSING_ERROR"}}]}
   ```
   **Impacto**: Não é possível extrair dados diretamente da API GraphQL sem documentação do schema.

2. **API REST da Sky Mavis requer autenticação**  
   **Evidência**: Tentativa de acesso a `https://api-gateway.skymavis.com/origins/v2/cards` retornou:
   ```json
   {"message": "No API key found in request"}
   ```
   **Impacto**: Necessário obter API key via Ronin Developer Console para acessar dados via REST.

3. **Endpoints de documentação não oficial estão indisponíveis**  
   **Evidência**: 
   - `https://axie-graphql.web.app/` retornou 404
   - `https://storage.googleapis.com/axie-cdn/game/cards/card-abilities.json` retornou erro de conexão
   **Impacto**: Fontes secundárias de dados não estão acessíveis em 2026.

4. **Estrutura de `skills` como array de strings é limitada**  
   **Evidência**: `src/types/card.ts` linha 19: `skills: string[]`  
   **Impacto**: Se extrairmos habilidades com metadados complexos (damage, shield, effects), precisaremos simplificar para strings ou propor mudança de tipo (fora do escopo atual).

5. **Card Explorer oficial não expõe API pública**  
   **Evidência**: `https://classic.axieinfinity.com/explorer/cards` é interface web interativa, sem endpoint de dados JSON público descoberto.
   **Impacto**: Scraping seria necessário, mas viola ToS e é frágil.

**Alternativas viáveis identificadas**:

- Buscar datasets estáticos da comunidade (ex.: repositórios GitHub com dumps de cartas)
- Obter API key da Sky Mavis via Ronin Developer Console (requer cadastro)
- Criar dataset manualmente com base no Card Explorer oficial (20-30 cartas principais) — trabalhoso mas controlado

## Perguntas em aberto

**Resolvidas pelo usuário (2026-11-08 23:19)**:

1. **Fonte de dados**: ✅ Curadoria manual (Opção C) — controle total, sem dependências de APIs externas ou cadastros
2. **Arquitetura**: ✅ Dataset JSON estático — snapshot local, sem fetch em tempo real
3. **Quantidade**: ✅ Todas as cartas Classic existentes — dataset completo (~100-200 cartas conforme disponibilidade no Card Explorer oficial)

Nenhuma pergunta em aberto restante.

## Conclusão da investigação

**O que se sabe**:
- Dataset atual tem apenas 6 cartas Classic fictícias, estrutura TypeScript está definida e estável
- API GraphQL oficial bloqueou introspection e não expõe campo `cards` conhecido
- API REST da Sky Mavis requer autenticação com API key
- Fontes secundárias (CDN, docs não oficiais) estão indisponíveis em 2026
- Aplicação consome dataset como JSON estático importado em `src/App.tsx`, sem chamadas de API em tempo real
- Estrutura de tipos permite `skills: string[]`, mas não interface complexa para habilidades
- **Card Explorer oficial** disponível em https://classic.axieinfinity.com/explorer/cards (interface web)

**Decisões do usuário (2026-11-08 23:19)**:
- ✅ **Fonte**: Curadoria manual via Card Explorer oficial — controle total, sem dependências externas
- ✅ **Arquitetura**: Dataset JSON estático — snapshot local, atualização manual futura se necessário
- ✅ **Escopo**: Todas as cartas Classic existentes — dataset completo (~100-200 cartas conforme disponibilidade)

**O que a PLANNING deve considerar**:
- Processo de extração: acessar Card Explorer oficial, categorizar por classe/parte, transcrever dados estruturados
- Estrutura de cada carta: id, name, generation ("classic"), axieClass, part (Horn/Mouth/Back/Tail), tier, stats (HP/MOV/ATK/DEF), skills (array de descrições textuais), energyCost, actionType (Melee/Ranged/Support)
- Simplificação de `skills` para array de strings (descrição textual da habilidade) — compatível com tipo atual
- Validação: todas as 6 classes representadas (Plant, Bird, Aquatic, Bug, Reptile, Beast) com distribuição balanceada
- Documentação obrigatória: criar `src/data/README.md` com fonte (Card Explorer oficial), método (curadoria manual), data da extração e contagem por classe
- Qualidade: dados autênticos verificáveis contra Card Explorer oficial, estrutura JSON válida conforme `Card` interface
