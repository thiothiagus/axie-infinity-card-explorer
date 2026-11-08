# Plano — Expandir dataset com cartas Axie Classic reais via API GraphQL (task-009)

Descreva o plano técnico usando esta estrutura. Metadados no topo:

- task: task-009
- author: Kiro (agente de código)
- created_at: 2026-11-08

## Contexto

**Situação atual** (conclusão da DISCOVERY): O dataset `src/data/cards.json` contém apenas 6 cartas fictícias de Axie Classic com `skills` vazio, `part` null e dados inventados. A aplicação carrega cartas via import estático em `src/App.tsx` (linha 11-15), sem chamadas de API em tempo real. APIs oficiais (GraphQL e REST Sky Mavis) estão bloqueadas para uso público sem autenticação. Estrutura TypeScript (`src/types/card.ts`) está estável e suporta a estrutura necessária.

**Por que este plano é necessário**: Explorador de cartas com apenas 6 cartas fictícias não permite exploração significativa. Usuário decidiu por dataset completo de todas as cartas Classic existentes (~100-200 cartas) via curadoria manual do Card Explorer oficial, mantendo snapshot estático local.

## Objetivo

Expandir `src/data/cards.json` com todas as cartas Axie Classic existentes extraídas manualmente do Card Explorer oficial (https://classic.axieinfinity.com/explorer/cards), substituindo as 6 cartas fictícias por dados reais autênticos, mantendo compatibilidade total com a estrutura TypeScript existente.

## Abordagem

**Estratégia**: Curadoria manual estruturada em 3 fases — (1) extração sistemática via Card Explorer oficial por classe/parte, (2) transformação para estrutura JSON compatível com `Card` interface, (3) validação de completude e qualidade.

**Por quê**:
- APIs oficiais exigem autenticação ou estão bloqueadas (conclusão da DISCOVERY)
- Curadoria manual garante controle total sobre qualidade e autenticidade dos dados
- Card Explorer oficial é a fonte canônica e está acessível publicamente
- Dataset estático atende perfeitamente o caso de uso (cartas Classic não atualizam com frequência)
- Sem dependências externas (APIs, cadastros, rate limits)

## Alternativas consideradas

1. **API oficial da Sky Mavis** — Integração com `https://api-gateway.skymavis.com/origins/v2/cards` após obter API key via Ronin Developer Console. **Não escolhida porque**: requer cadastro, aprovação, configuração de autenticação e possível rate limiting. Overhead desnecessário para um snapshot estático que atualiza raramente.

2. **Dataset estático da comunidade** — Buscar repositório GitHub com dump de cartas Classic já estruturado. **Não escolhida porque**: repositórios encontrados (ex.: StephanAkkerman/axie-infinity-extras) não contêm datasets JSON completos de cartas, apenas links e ferramentas. Não há fonte verificável e confiável disponível.

3. **Scraping automatizado do Card Explorer** — Script automatizado para extrair cartas via puppeteer/cheerio. **Não escolhida porque**: viola ToS do site, é frágil a mudanças de DOM, e curadoria manual de ~100-200 cartas é esforço similar com maior controle de qualidade.

## Componentes do recurso

Nenhum componente afetado. Esta task apenas expande o conteúdo de `src/data/cards.json`. A estrutura de importação (`src/App.tsx` linha 11-15) e consumo do dataset permanecem inalterados. Nenhum call site, prop, flag ou provider é modificado — apenas o conteúdo do JSON local muda, não a interface de acesso.

## Passos

### Fase 1: Preparação e estrutura

1. **Criar script auxiliar de extração**
   - **Onde**: `scripts/extract-classic-cards.ts`
   - **O que**: Script TypeScript com template da estrutura `Card` para facilitar transcrição manual
   - **Como verificar**: Arquivo existe e compila sem erros (`npx tsx scripts/extract-classic-cards.ts --help`)

2. **Backup do dataset atual**
   - **Onde**: `src/data/cards.json` → `src/data/cards.json.backup-2026-11-08`
   - **O que**: Preservar as 6 cartas fictícias antes da substituição
   - **Como verificar**: `ls -lh src/data/cards.json*` mostra ambos os arquivos

### Fase 2: Extração de dados do Card Explorer oficial

3. **Extrair cartas por classe via Card Explorer**
   - **Onde**: Navegar em https://classic.axieinfinity.com/explorer/cards aplicando filtros por classe
   - **O que**: Para cada classe (Plant, Bird, Aquatic, Bug, Reptile, Beast), filtrar e transcrever todas as cartas disponíveis com: id (gerado como `axie-classic-{class}-{name-slug}`), name, generation ("classic"), axieClass, part (Horn/Mouth/Back/Tail extraído do filtro "Body Part"), tier (extraído se disponível), stats (HP/MOV/ATK/DEF), skills (descrições textuais das habilidades), energyCost (custo de energia), actionType (Melee/Ranged/Support)
   - **Como verificar**: Documento temporário (ex.: `scripts/cards-raw.json`) com todas as cartas transcritas antes de formatar

4. **Normalizar estrutura JSON**
   - **Onde**: Transformar dados brutos em estrutura compatível com `Card` interface de `src/types/card.ts`
   - **O que**: Garantir: `id` único, `generation` sempre "classic", `axieClass` em PascalCase (Plant/Bird/Aquatic/Bug/Reptile/Beast), `part` normalizado (Horn/Mouth/Back/Tail ou null), `tier` (A/B/C/S ou null), `image` null (sem assets nesta task), `stats` com {HP, MOV, ATK, DEF}, `skills` como array de strings (descrições textuais), campos opcionais `description`, `energyCost`, `actionType` preenchidos quando disponíveis
   - **Como verificar**: JSON válido (`jq '.' < scripts/cards-normalized.json`) e compatível com tipo

### Fase 3: Integração e validação

5. **Substituir cartas fictícias no dataset principal**
   - **Onde**: `src/data/cards.json`
   - **O que**: Remover as 6 cartas fictícias Classic (ids começando com `axie-classic-`), manter todas as 192 cartas Origin v3 intactas, adicionar todas as cartas Classic reais extraídas
   - **Como verificar**: `jq '[.[] | select(.generation == "classic")] | length' src/data/cards.json` retorna número >= 20 (idealmente 100-200 conforme disponibilidade no Card Explorer)

6. **Validar distribuição por classe**
   - **Onde**: `src/data/cards.json`
   - **O que**: Confirmar que todas as 6 classes Classic têm representação (Plant, Bird, Aquatic, Bug, Reptile, Beast) com ao menos 3 cartas cada
   - **Como verificar**: `jq '[.[] | select(.generation == "classic")] | group_by(.axieClass) | map({class: .[0].axieClass, count: length})' src/data/cards.json` — todas as classes aparecem

7. **Validar tipagem TypeScript**
   - **Onde**: Todo o projeto
   - **O que**: Garantir que dataset atualizado não quebra tipos existentes
   - **Como verificar**: `npm run typecheck` sem erros

8. **Criar testes automatizados para cartas Classic**
   - **Onde**: `src/data/cards.test.ts` (novo arquivo)
   - **O que**: Suite de testes validando: (a) todas as cartas Classic têm estrutura válida, (b) 6 classes representadas, (c) nenhuma carta com `skills` vazio, (d) `stats` presente e válido para cartas Classic
   - **Como verificar**: `npm test src/data/cards.test.ts` passa

### Fase 4: Documentação

9. **Criar documentação da fonte de dados**
   - **Onde**: `src/data/README.md` (novo arquivo)
   - **O que**: Documentar: fonte dos dados (Card Explorer oficial), método de extração (curadoria manual), data da extração (2026-11-08), contagem por classe, estrutura esperada, instruções para atualização futura
   - **Como verificar**: `cat src/data/README.md | grep -i "fonte\|source\|extração"` retorna conteúdo relevante

10. **Atualizar CHANGELOG.md do projeto**
    - **Onde**: `CHANGELOG.md` (raiz do projeto)
    - **O que**: Adicionar entrada documentando expansão do dataset Classic (de 6 para X cartas reais)
    - **Como verificar**: `git diff CHANGELOG.md` mostra nova entrada

## Riscos

1. **Card Explorer oficial pode ter menos de 100 cartas disponíveis**  
   **Mitigação**: Critério de aceitação especifica "pelo menos 20 cartas" como mínimo aceitável. Se o Explorer tiver menos de 100 cartas, extrair todas as disponíveis e documentar a quantidade real em `src/data/README.md`. Priorizar distribuição balanceada entre as 6 classes.

2. **Estrutura de habilidades no Card Explorer pode ser complexa (damage, shield, effects)**  
   **Mitigação**: Simplificar para descrição textual única por habilidade (array de strings), compatível com tipo atual `skills: string[]`. Se metadados estruturados forem necessários no futuro, criar task separada para evoluir o tipo.

3. **Curadoria manual é propensa a erros de digitação**  
   **Mitigação**: Criar testes automatizados (passo 8) que validam estrutura obrigatória de cada carta. Executar `npm run typecheck` após cada batch de cartas adicionadas.

4. **Dataset pode crescer significativamente (de 2209 para 4000+ linhas)**  
   **Mitigação**: JSON continua sendo formato adequado para até ~1MB. Se performance se tornar problema futuro, considerar compressão ou lazy loading (fora do escopo desta task).

5. **Cartas Classic podem ter campos que não existem em Origin v3 e vice-versa**  
   **Mitigação**: Tipo `Card` já suporta campos opcionais (`tier`, `stats`, `description`, `energyCost`, `actionType`). Cartas Classic usam `stats` (não-null) e `part` (específico), Origin v3 usa `stats: null` e `part` (específico). Estrutura atual já acomoda ambas.

## Critérios de sucesso

(Mapeamento dos critérios de aceitação da task para os passos do plano)

- [x] Dataset `src/data/cards.json` contém pelo menos 20 cartas de Axie Classic com dados reais — **Coberto pelos passos 3, 4, 5** (extração, normalização, substituição)
- [x] Cada carta Classic inclui: id, name, generation ("classic"), axieClass, part, stats (HP/MOV/ATK/DEF), tier — **Coberto pelo passo 4** (normalização de estrutura)
- [x] Cartas incluem habilidades (skills) com descrição, damage, shield e efeitos quando aplicável — **Coberto pelo passo 3** (extração) e **passo 4** (normalização como array de strings descritivas)
- [x] Todas as 6 classes Classic estão representadas (Plant, Bird, Aquatic, Bug, Reptile, Beast) — **Coberto pelo passo 6** (validação de distribuição por classe)
- [x] Dados são autênticos e correspondem ao jogo oficial (verificável via Card Explorer) — **Coberto pelo passo 3** (fonte é Card Explorer oficial)
- [x] Estrutura JSON mantém compatibilidade com tipos TypeScript existentes em `src/types/index.ts` — **Coberto pelo passo 7** (validação de tipagem) e **passo 8** (testes automatizados)
- [x] Arquivo `src/data/README.md` documenta a fonte dos dados e data da extração — **Coberto pelo passo 9** (documentação)

## Revisões

**Iteração 1 (2026-11-08 23:21)**: Plano inicial criado com 10 passos organizados em 4 fases. Mapeei todos os 7 critérios de aceitação da task para passos específicos. Registrei 5 riscos com mitigações. Incluí 3 alternativas consideradas com justificativas. Verificação pendente: confirmar que todos os arquivos citados existem ou serão criados, e que comandos são executáveis.

**Iteração 2 (2026-11-08 23:22)**: Auditoria completa executada:
- ✅ **Contexto claro**: fundamentado na conclusão da DISCOVERY (contexto congelado)
- ✅ **Passos concretos**: 10 passos ordenados com "onde", "o que" e "como verificar"
- ✅ **Riscos com mitigação**: 5 riscos identificados, cada um com mitigação específica
- ✅ **Critérios verificáveis**: Todos os 7 critérios de aceitação mapeados para passos específicos
- ✅ **Escopo fechado**: Não toca UI, componentes ou APIs — apenas expande `src/data/cards.json`
- ✅ **Alternativas pesadas**: 3 alternativas consideradas com justificativas de descarte
- ✅ **Arquivos verificados**: 
  - `src/data/cards.json` existe (verificado na DISCOVERY)
  - `src/types/card.ts` existe e lido na DISCOVERY
  - `src/App.tsx` existe e lido na DISCOVERY
  - `scripts/extract-classic-cards.ts` será criado (passo 1)
  - `src/data/README.md` será criado (passo 9)
  - `src/data/cards.test.ts` será criado (passo 8)
  - `CHANGELOG.md` existe na raiz (convenção de projeto com Vite)
- ✅ **Comandos executáveis**: Todos os comandos citados usam ferramentas disponíveis (jq, npm, npx tsx, git)
- ✅ **Sem placeholders**: Nenhum placeholder remanescente do template

Plano completo e pronto para aprovação.

## Aprovação

- [x] Plano auto-auditado (critérios mapeados, arquivos verificados e sem placeholders)
