---
id: task-003
title: Implementar grid de cartas com filtros (classe, parte, geração) e busca por nome
status: in_progress
priority: 80
created_at: 2026-11-08
---

# Implementar grid de cartas com filtros (classe, parte, geração) e busca por nome

## Contexto

O scaffold React + Vite + TypeScript já existe (task-001, version 0.1.0):
`src/App.tsx` com página de boas-vindas, `src/data/cards.json` com 12
cartas amostra (6 Classic + 6 Origin v3), `src/data/classes.json`,
`src/data/parts.json`, e 3 PNGs em `src/assets/`. Esta task implementa
a UI principal do Card Explorer: grid de cartas com filtros e busca.
Origem: conversa do usuário (2026-11-08).

## Descrição

Implementar a UI principal do Card Explorer:

1. **Componentes** (em `src/components/`):
   - `Card.tsx` — carta individual (nome, geração, classe, parte, tier,
     imagem ou placeholder). Clicável → abre detalhe.
   - `CardGrid.tsx` — grid responsivo (CSS grid) das cartas filtradas.
   - `FilterBar.tsx` — chips de filtro: geração (Todas/Classic/Origin v3),
     classe (dinâmica pela geração), parte (só em Origin v3:
     Ears/Eyes/Tail/Horn/Mouth/Back).
   - `SearchInput.tsx` — campo de busca por nome (case-insensitive).
   - `CardDetail.tsx` — modal com a carta selecionada (nome, classe,
     parte, tier, stats, skills, descrição) + botão fechar.
2. **Estado** (`useState` + `useMemo` em `App.tsx` ou `useCardFilter.ts`):
   - `search` (string), `generation` ('all' | 'classic' | 'origin-v3'),
     `axieClass` (string | null), `part` (string | null),
     `selectedCard` (Cart | null).
   - `filteredCards` via `useMemo` combinando os 4 filtros.
3. **Mascote detetive** (`src/assets/mascote-detetive-com-lupa-e-carta
   .png`) — exibir no cabeçalho (ao lado do título) e/ou no empty state
   (quando `filteredCards.length === 0`).
4. **Estilo** — CSS Modules (`*.module.css`) por componente + `index.css`
   global (variáveis de cor por classe Axie: Plant=verde, Bird=azul,
   Aquatic=ciano, Bug=roxo, Reptile=laranja, Beast=marrom;
   Aqua=azul-escuro, origin classes reutilizam cores).
5. **Tipos** — `src/types/card.ts`: `Card`, `Generation`, `Stats`.
   Importar `cards.json`/`classes.json`/`parts.json` e tipar.
6. **Testes** (`src/components/*.test.tsx`):
   - `CardGrid.test.tsx` — renderiza 12 cartas por padrão; com filtro
     `generation='classic'` renderiza 6; com busca 'anemone' renderiza
     1.
   - `FilterBar.test.tsx` — clicar chip de classe filtra; clicar
     geração muda as classes disponíveis.
   - `CardDetail.test.tsx` — modal abre ao clicar em carta e fecha ao
     clicar em "fechar".
   - `App.test.tsx` (atualizar o smoke test existente) — testa
     integração: busca "cloud" mostra 1 carta; geração classic + classe
     Bird mostra 1 carta.

## Escopo

**Dentro do escopo:**

- `src/types/card.ts` (novos tipos)
- `src/components/` (`Card`, `CardGrid`, `FilterBar`, `SearchInput`,
  `CardDetail` + `*.module.css`)
- `src/hooks/useCardFilter.ts` (hook de filtragem, opcional — pode ficar
  em `App.tsx` se preferir)
- `src/App.tsx` (reescrito: layout com header + FilterBar + SearchInput
  + CardGrid + CardDetail)
- `src/index.css` (variáveis globais + reset mínimo)
- `src/main.tsx` (importar `index.css` — já é feito? verificar)
- `src/components/*.test.tsx` (4 arquivos de teste)
- `src/App.test.tsx` (atualizar com teste de integração)
- `src/assets/` (usar `mascote-detetive-com-lupa-e-carta.png` e
  `icone-axie-explorador-de-cartas.png`)

**Fora do escopo:**

- Dataset completo de ~150 cartas (task-002)
- Rota de detalhe (usar modal, não React Router)
- Persistência de filtros (localStorage)
- Sort (por tier, nome, stats)
- Responsividade avançada (mobile-first PWA)
- I18n
- Deploy

## Critérios de aceitação

- [ ] `npm run dev` exibe a página com título, mascote detetive,
      FilterBar (chips de geração + classe + parte), SearchInput, e
      grid de 12 cartas (dataset atual)
- [ ] Filtrar por `generation='classic'` mostra 6 cartas; por
      `generation='origin-v3'` mostra 6 cartas; por `generation='all'`
      mostra 12
- [ ] Filtrar por classe (ex. `Bird` em Origin v3) mostra apenas as
      cartas Bird de Origin v3
- [ ] Filtrar por parte (ex. `Tail`) mostra apenas cartas com
      `part='Tail'`
- [ ] Buscar "cloud" (case-insensitive) mostra 1 carta ("Cloud")
- [ ] Combinações de filtros funcionam (ex. geração `classic` + classe
      `Bird` → 1 carta: "Spirit Feather")
- [ ] Vazio (`filteredCards.length === 0`) exibe o mascote detetive
      com mensagem "Nenhuma carta encontrada"
- [ ] Clicar numa carta abre o modal `CardDetail` com os dados;
      fechar o modal volta ao grid
- [ ] `npm test` passa (testes de CardGrid, FilterBar, CardDetail,
      App)
- [ ] `npm run lint` e `npm run typecheck` passam
- [ ] `npm run build` gera `dist/` sem erro

## Plano de testes manuais

Pré-requisitos: terminal aberto em
`/var/mnt/ssd2/wip-apps/axie-infinity-card-explorer`, `npm install`
já feito, dev server disponível em `localhost:2943`.

1. **Rodar `npm run dev` e abrir a página** — Esperado: `http
   ://localhost:2943` exibe título "Axie Infinity Card Explorer",
   mascote detetive no header, FilterBar com chips (Todas/Classic/
   Origin v3 + 6 classes + 6 partes), SearchInput, e grid de 12
   cartas. Verificar:

   ```
   cd /var/mnt/ssd2/wip-apps/axie-infinity-card-explorer && (npm run dev > /tmp/vite-dev.log 2>&1 &) && sleep 6 && curl -s http://localhost:2943 | grep -c "Axie Infinity Card Explorer"
   ```

2. **Rodar `npm test`** — Esperado: 4+ testes passam (CardGrid,
   FilterBar, CardDetail, App). Verificar:

   ```
   cd /var/mnt/ssd2/wip-apps/axie-infinity-card-explorer && npm test 2>&1 | tail -12
   ```

3. **Rodar `npm run lint`** — Esperado: exit 0, sem warnings.
   Verificar:

   ```
   cd /var/mnt/ssd2/wip-apps/axie-infinity-card-explorer && npm run lint && echo "lint OK"
   ```

4. **Rodar `npm run typecheck`** — Esperado: exit 0. Verificar:

   ```
   cd /var/mnt/ssd2/wip-apps/axie-infinity-card-explorer && npm run typecheck && echo "typecheck OK"
   ```

5. **Rodar `npm run build`** — Esperado: `dist/` gerado. Verificar:

   ```
   cd /var/mnt/ssd2/wip-apps/axie-infinity-card-explorer && npm run build && ls dist/
   ```

6. **Teste manual de filtragem no navegador** (após `npm run dev`) —
   Esperado: clicar chip "Classic" reduz grid para 6; digitar "anemone"
   no SearchInput reduz para 1 carta; clicar numa carta abre modal;
   clicar "Fechar" fecha modal; limpar todos os filtros volta a 12.
   Verificar: inspecionar visualmente + console sem erros.

## Notas

_Decisões relevantes viram registros via `riteward decision create`._

- Iteração 1 (DISCOVERY): preenchi Contexto, Escopo, Critérios e Plano
  de testes. Decidi usar CSS Modules (não Tailwind, para manter o
  scaffold leve sem config extra). O hook de filtragem fica em
  `src/hooks/useCardFilter.ts` (separado de `App.tsx` para facilitar
  testes). O modal `CardDetail` usa overlay + `role="dialog"` para
  acessibilidade (sem lib de modal).
