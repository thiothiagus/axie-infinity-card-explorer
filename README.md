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
│   ├── App.tsx           # componente raiz (página de boas-vindas)
│   ├── App.test.tsx      # smoke test
│   ├── assets/           # ícones (3 PNGs)
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
