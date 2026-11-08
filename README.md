# Axie Infinity Card Explorer

Aplicação web para explorar cartas do jogo Axie Infinity, cobrindo as duas
gerações:

- **Axie Classic** — classes Plant, Bird, Aquatic, Bug, Reptile, Beast.
- **Axie Origin v3** — classes Aqua, Beast, Bird, Bug, Plant, Reptile;
  partes Ears, Eyes, Tail, Horn, Mouth, Back.

## Stack

- **Frontend**: React + Vite + TypeScript
- **Dados**: JSON local em `src/data/` (cartas, stats, classes, partes),
  sem dependência de backend

## Como rodar

_O scaffold React + Vite ainda não foi criado (próxima task). Quando
existir, os comandos serão:_

```bash
npm install        # instala dependências
npm run dev        # dev server (Vite)
npm run build      # build de produção
npm test           # testes
```

## Governança

Este projeto usa o [Riteward](https://github.com/) para governança de
workflow e qualidade. Ver `AGENTS.md` (raiz) e `.riteward/riteward.md`
para as regras operacionais.
