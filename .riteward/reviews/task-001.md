# Revisão — Bootstrap do scaffold React + Vite + TypeScript (task-001)

- task: task-001
- reviewer: Agnes (agente)
- type: critical
- created_at: 2026-11-08

## Resumo

Revisão crítica do bootstrap do scaffold React + Vite + TypeScript.
Verifiquei o diff completo (2 commits de código + 1 checkpoint de docs)
contra os 12 critérios de aceitação da task e os 16 passos do plano.
A task criou o scaffold mínimo (package.json, configs, src/), moveu os
3 PNGs para `src/assets/`, criou o dataset inicial de 12 cartas
(6 Classic + 6 Origin v3) em JSON, e sincronizou `.riteward/config.yaml`
com 3 quality gates e `version_files`.

## Itens verificados

- [x] `package.json` — version `0.1.0`, type module, 6 scripts
      (dev/build/preview/test/lint/typecheck), 2 deps (react/react-dom
      18.3.1), 17 devDeps (vite 5.4.21, vitest 1.6.1, typescript
      5.9.3, eslint 9.39.5, @testing-library/react 15.0.7, jsdom
      24.1.3, @vitejs/plugin-react 4.7.0, eslint-plugin-react-hooks
      7.1.1, etc.).
- [x] `vite.config.ts` — usa `defineConfig` de `vitest/config` (para
      tipar `test` sem cast), plugin react, environment jsdom,
      globals, setupFiles `./src/test/setup.ts`.
- [x] `tsconfig.json` — target ES2020, module ESNext,
      moduleResolution bundler, strict, resolveJsonModule, jsx
      react-jsx, types [vite/client, vitest/globals,
      @testing-library/jest-dom], include src, exclude
      src/test + tests. Separado de `tsconfig.node.json` (sem
      references) para evitar TS6310.
- [x] `tsconfig.node.json` — composite, outDir `dist-node`,
      declaration, module ESNext, bundler, strict. Include
      `vite.config.ts`.
- [x] `eslint.config.js` — flat config: ignores,
      `@eslint/js recommended`, `typescript-eslint recommended`,
      react + react-hooks plugins, globals browser+node,
      `react/react-in-jsx-scope: off` (React 18 + react-jsx não
      precisa de import React).
- [x] `index.html` — div `#root`, script module `/src/main.tsx`,
      title "Axie Infinity Card Explorer".
- [x] `src/main.tsx` — `createRoot` monta `<App />` em StrictMode.
- [x] `src/App.tsx` — renderiza h1 "Axie Infinity Card Explorer" +
      2 parágrafos de boas-vindas. Sem import de assets (os PNGs são
      apenas disponíveis; a UI que os usa é a próxima task).
- [x] `src/App.test.tsx` — 1 smoke test `@testing-library/react`:
      `getByRole('heading', {name: /Axie Infinity Card Explorer/i})`
      `.toBeInTheDocument()`.
- [x] `src/test/setup.ts` — `import '@testing-library/jest-dom'`.
- [x] `src/assets/` — 3 PNGs (renomeados sem acento/espaço):
      `explorador-de-cartas-axie-infinity.png`,
      `icone-axie-explorador-de-cartas.png`,
      `mascote-detetive-com-lupa-e-carta.png`. Renames Git
      detectados (100% similarity).
- [x] `src/data/cards.json` — 12 cartas (id, name, generation,
      axieClass, part, tier, image, stats, skills). 6 Classic
      (Plant/Bird/Aquatic/Bug/Reptile/Beast) + 6 Origin v3
      (Aqua/Beast/Bird/Bug/Plant/Reptile). JSON válido.
- [x] `src/data/classes.json` — 2 gerações × 6 classes. JSON válido.
- [x] `src/data/parts.json` — classic: [] (partes não nomeadas);
      origin-v3: [Ears, Eyes, Tail, Horn, Mouth, Back]. JSON válido.
- [x] `.gitignore` — adicionado `dist-node/`, `.vite/`, `coverage/`,
      `*.local`, `*.tsbuildinfo`. Mantidos os anteriores
      (`.riteward/state/`, `logs/`, `node_modules/`, `dist/`,
      `.DS_Store`, `.directory`).
- [x] `.riteward/config.yaml` — `project.scripts`
      (test/lint/typecheck), `quality_gates` (3 objetos
      {name, command}), `version_files: [package.json]`.
      `riteward config validate` → válida.
- [x] `AGENTS.md` — referências de PNG atualizadas para
      `src/assets/`; comandos essenciais listados (6).
- [x] `README.md` — seção "Como rodar" com 6 comandos reais
      (sem "próxima task").

## Testes automatizados

- **Criado**: `src/App.test.tsx` (1 smoke test) — motivo: o plano
  passo 13 previu; o scaffold mínimo precisa de 1 teste para o gate
  `npm test` ter algo para rodar. Ver `## Notas` da task.
- **Alterado**: nenhum.
- **Removido**: nenhum.
- Resultado da auditoria da TESTING: `riteward check` (3 gates)
  PASS; `npm test` → 1 test passed; nenhum snapshot, pulo ou
  reescrita de expectativa sem motivo.

## Problemas encontrados

Nenhum bloqueante.

- **Info**: `package.json` `build` é `vite build` (sem `tsc -b`). O
  `tsconfig.json` foi separado de `tsconfig.node.json` (sem
  `references`) para evitar TS6310 (composite project não pode
  desabilitar emit). Typecheck roda `tsc -b --noEmit` que ainda
  valida o graph. Registro em `## Notas`.
- **Info**: `eslint-plugin-react-hooks` adicionado como devDependency
  fora do plano (não estava listado no passo 1). Registro em
  `## Notas`.

## Veredicto

**Aprovado.** Todos os 12 critérios de aceitação foram verificados
individualmente e estão marcados `[x]` na task. O diff está limpo:
3 commits (`c5abed3` scaffold, `19ae6c2` docs desvios, `10c0a9a`
marcaram critérios), 24 arquivos no commit principal. Nenhum
arquivo proibido (segredos, state de workflow, node_modules, logs)
entrou no commit. 7 desvios do plano foram registrados em
`## Notas` com motivo.

## Próximo passo

Avançar para FINALIZATION: o commit final da task-001 será feito
pelo `workflow commit` na FINALIZATION. Após `COMPLETED`, merge local
na `main` + delete da branch `feat/bootstrap-react-vite` — em modo
autônomo, exigem autorização explícita do usuário.

## Bateria de testes manuais

Pré-requisitos: terminal aberto em
`/var/mnt/ssd2/wip-apps/axie-infinity-card-explorer`, Node.js 18+
instalado, `npm` disponível, `riteward` instalado.

1. **Rodar `npm install`** — Esperado: `added N packages in Xs`
   (N>0, sem `npm ERR!`) ou `up to date`.
   Verificar:

   ```
   cd /var/mnt/ssd2/wip-apps/axie-infinity-card-explorer && npm install --no-audit --no-fund 2>&1 | tail -5
   ```

2. **Rodar `npm run typecheck`** — Esperado: `tsc -b --noEmit`
   termina com exit 0, sem erros de tipo.
   Verificar:

   ```
   cd /var/mnt/ssd2/wip-apps/axie-infinity-card-explorer && npm run typecheck && echo "typecheck OK (exit $?)"
   ```

3. **Rodar `npm run lint`** — Esperado: `eslint` termina com exit 0,
   sem warnings bloqueantes.
   Verificar:

   ```
   cd /var/mnt/ssd2/wip-apps/axie-infinity-card-explorer && npm run lint && echo "lint OK (exit $?)"
   ```

4. **Rodar `npm test`** — Esperado: `vitest run` roda 1 smoke test
   (`App.tsx` renderiza) e termina verde.
   Verificar:

   ```
   cd /var/mnt/ssd2/wip-apps/axie-infinity-card-explorer && npm test
   ```

5. **Rodar `npm run build`** — Esperado: `vite build` termina com
   `built in Xs`, gera `dist/` com `index.html` e `assets/`.
   Verificar:

   ```
   cd /var/mnt/ssd2/wip-apps/axie-infinity-card-explorer && npm run build && ls dist/
   ```

6. **Rodar `npm run dev` e checar a página** — Esperado: HTTP 200
   com `<title>Axie Infinity Card Explorer</title>`.
   Verificar (inicia dev server em background, checa com curl,
   encerra):

   ```
   cd /var/mnt/ssd2/wip-apps/axie-infinity-card-explorer && (npm run dev > /tmp/vite-dev.log 2>&1 &) && sleep 6 && curl -s http://localhost:5173 | grep -o '<title>[^<]*</title>' && pkill -f vite; echo "dev server encerrado"
   ```

7. **Confirmar dataset JSON válido** — Esperado: 3× `OK`.
   Verificar:

   ```
   cd /var/mnt/ssd2/wip-apps/axie-infinity-card-explorer && for f in src/data/cards.json src/data/classes.json src/data/parts.json; do echo "== $f =="; node -e "JSON.parse(require('fs').readFileSync('$f','utf8')); console.log('OK')"; done
   ```

8. **Confirmar PNGs movidos** — Esperado: 3 PNGs em `src/assets/`,
   nenhum na raiz.
   Verificar:

   ```
   cd /var/mnt/ssd2/wip-apps/axie-infinity-card-explorer && ls src/assets/ && (ls *.png 2>/dev/null || echo "(nenhum PNG na raiz, ok)")
   ```

9. **Rodar `riteward check`** — Esperado: 3 quality gates
   (`test`, `lint`, `typecheck`) PASS.
   Verificar:

   ```
   cd /var/mnt/ssd2/wip-apps/axie-infinity-card-explorer && riteward check
   ```

10. **Confirmar `version_files`** — Esperado: `riteward version
    list` mostra `package.json — 0.1.0`.
    Verificar:

    ```
    cd /var/mnt/ssd2/wip-apps/axie-infinity-card-explorer && riteward version list
    ```

## Resultado da bateria

- Origem: docs/audits/test-results-task-001.txt
- Auditor: (a preencher após execução)
- Vereditos: (passo a passo: "1: ok" ou "3: falha — causa", um por linha)

## Aprovação do usuário

- [ ] Testes executados e aprovados pelo usuário — (citação literal,
  quem, data)
