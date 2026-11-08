# Axie Infinity Card Explorer

Aplicação web para explorar cartas do jogo Axie Infinity, cobrindo as
duas gerações:

- **Axie Classic** — classes Plant, Bird, Aquatic, Bug, Reptile, Beast.
- **Axie Origin v3** — classes Aqua, Beast, Bird, Bug, Plant, Reptile;
  partes Ears, Eyes, Tail, Horn, Mouth, Back.

## Stack

- **Frontend**: React 18 + Vite 5 + TypeScript 5
- **Testes**: Vitest + @testing-library/react + jsdom
- **Lint**: ESLint 9 (flat config) + typescript-eslint + react + react-hooks
- **Dados**: JSON local em `src/data/` (cartas, stats, classes, partes),
  sem dependência de backend

## Estrutura

```
├── src/
│   ├── main.tsx          # entry point
│   ├── App.tsx           # layout principal (header + filtros + grid + modal)
│   ├── App.module.css    # estilos do layout
│   ├── App.test.tsx      # 7 testes de integração
│   ├── index.css         # variáveis globais + reset
│   ├── types/
│   │   └── card.ts       # Card, Generation, Stats, GenerationFilter
│   ├── components/
│   │   ├── Card.tsx + .module.css + .test.tsx (28 testes)
│   │   ├── CardGrid.tsx + .module.css + .test.tsx
│   │   ├── FilterBar.tsx + .module.css + .test.tsx
│   │   ├── SearchInput.tsx + .module.css + .test.tsx
│   │   └── CardDetail.tsx + .module.css + .test.tsx
│   ├── hooks/
│   │   ├── useCardFilter.ts     # filterCards (pura) + useCardFilter (useMemo)
│   │   └── useCardFilter.test.ts  # 18 testes
│   ├── utils/
│   │   ├── generation.ts        # getAvailableClasses, getAvailableParts
│   │   └── generation.test.ts   # 11 testes
│   ├── assets/           # 3 PNGs (mascote detetive, ícones)
│   ├── data/             # dataset de cartas (JSON)
│   │   ├── cards.json    # 12 cartas amostra (6 Classic + 6 Origin v3)
│   │   ├── classes.json  # classes por geração
│   │   └── parts.json    # partes por geração
│   └── test/
│       └── setup.ts      # setup do @testing-library/jest-dom
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.node.json
└── eslint.config.js
```

## Como rodar

```bash
npm install        # instala dependências
npm run dev        # dev server (Vite) — localhost:2943
npm run build      # build de produção
npm test           # vitest run
npm run lint       # eslint
npm run typecheck  # tsc -b --noEmit
```

## Changelog

- **0.4.0** — Cobertura de testes unitários expandida: adicionados 57
  novos testes (28 para Card.tsx, 18 para useCardFilter.ts, 11 para
  utils/generation.ts), totalizando 85 testes em 8 arquivos. Funções
  auxiliares `getInitials` e `getClassColor` exportadas de Card.tsx
  para testabilidade. Funções `getAvailableClasses` e
  `getAvailableParts` extraídas de App.tsx para novo módulo
  `src/utils/generation.ts`. Todos os quality gates (test, lint,
  typecheck) passando.
- **0.3.0** — Dataset expandido de 12 para 198 cartas: 192 cartas
  Axie Origin v3 (32 por classe: Aqua, Beast, Bird, Bug, Plant,
  Reptile; 6 partes) extraídas do `origin-rosy`, + 6 cartas Axie
  Classic mantidas. Campos opcionais adicionados ao type
  (`description`, `energyCost`, `actionType`). Testes atualizados
  para o novo total.
- **0.2.0** — Grid de cartas com filtros (classe, parte, geração),
  busca por nome, e modal de detalhe. Componentes `Card`,
  `CardGrid`, `FilterBar`, `SearchInput`, `CardDetail`; hook
  `useCardFilter`; 28 testes automatizados; mascote detetive no
  header e no empty state.
- **0.1.0** — Bootstrap do scaffold React + Vite + TypeScript:
  `package.json`, configs (Vite/TS/ESLint/Vitest), `index.html`,
  `src/main.tsx`, `src/App.tsx` (página de boas-vindas),
  `src/App.test.tsx` (smoke test), 3 PNGs movidos para `src/assets/`,
  dataset inicial de 12 cartas em `src/data/` (6 Classic + 6 Origin
  v3), `.riteward/config.yaml` com 3 quality gates e `version_files`,
  `README.md` com comandos reais.

## Governança

Este projeto usa o Riteward para governança de workflow e qualidade.
Ver `AGENTS.md` (raiz) e `.riteward/riteward.md` para as regras
operacionais.
