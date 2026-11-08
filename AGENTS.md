<!-- riteward:start -->
Este projeto usa o Riteward. Antes de qualquer alteração, leia `.riteward/riteward.md`
(regras operacionais) e `.riteward/constitution.md` (princípios e políticas).
<!-- riteward:end -->

# Projeto

## Axie Infinity Card Explorer

Aplicação web para explorar cartas do jogo Axie Infinity, cobrindo as duas
gerações:

- **Axie Classic** — classes Plant, Bird, Aquatic, Bug, Reptile, Beast;
  partes de corpo; custo de energia; tipo de ação (Melee/Ranged/Support).
- **Axie Origin v3** — classes Aqua, Beast, Bird, Bug, Plant, Reptile;
  partes Ears, Eyes, Tail, Horn, Mouth, Back.

## Stack

- **Frontend**: React + Vite + TypeScript
- **Dados**: JSON local em `src/data/` (cartas, stats, classes, partes),
  sem dependência de backend
- **Ícones**: PNGs provisórios na raiz (`Ícone Axie Explorador de Cartas.png`,
  `Mascote Detetive com Lupa e Carta.png`,
  `Explorador de Cartas Axie Infinity.png`)

## Comandos essenciais

A definir no bootstrap do scaffold React (próxima task):

```bash
npm install        # instala dependências
npm run dev        # dev server (Vite)
npm run build      # build de produção
npm test           # testes
```
