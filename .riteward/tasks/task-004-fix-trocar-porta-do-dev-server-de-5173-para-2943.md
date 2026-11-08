---
id: task-004
title: "fix: trocar porta do dev server de 5173 para 2943"
type: quickfix
status: in_progress
priority: 60
created_at: 2026-11-08
---

# fix: trocar porta do dev server de 5173 para 2943

## Problema

Origem: pedido do usuário (2026-11-08). Trocar a porta do dev server do Vite de 5173 para 2943 (strictPort). Atualizar vite.config.ts, README.md e AGENTS.md.

## Correção

- `vite.config.ts`: adicionar `server: { port: 2943, strictPort: true }` ao `defineConfig`.
- `README.md`: linha `npm run dev` apontar para `localhost:2943`.
- `AGENTS.md`: linha `npm run dev` apontar para `localhost:2943`.

## Verificação

- [x] `npm run dev` sobe em `http://localhost:2943` (confirmado com `curl`).
- [x] `grep -rn "5173" README.md AGENTS.md` → sem resultados.

## Notas

Aplicado diretamente em sessão ativa (a mudança é de 3 arquivos com 1 linha
cada). Ver `git diff` na branch `fix/dev-port-2943`.
