# Plano — Configuração inicial do Riteward (task-setup)

- task: task-setup
- author: Agnes (agente)
- created_at: 2026-11-08

## Contexto

O projeto `axie-infinity-card-explorer` está em sua fase zero: só existem
3 PNGs (ícones provisórios), `.directory`, o scaffold do Riteward
(`.riteward/`) e o `AGENTS.md` com o bloco do Riteward. Não há `package.json`,
código, README ou `.gitignore`. O usuário decidiu a stack na conversa
(React + Vite, web, dados em JSON local, suporta Classic + Origin v3) mas a
bootstrap do scaffold React ainda será uma task separada. Esta task-setup
só finaliza a configuração da governança do Riteward (5 etapas do
`riteward init`).

## Objetivo

Entregar um projeto com o Riteward totalmente configurado e versionado:
`AGENTS.md` com contexto do projeto abaixo do bloco do Riteward,
monitoramento de logs ativo, refactor scan validado, quality gates
sincronizados (vazio, por falta de `package.json`), e `.gitignore` que
versiona `.riteward/` ignorando apenas `.riteward/state/` e `logs/`.

## Abordagem

Executar as 5 etapas da task-setup em ordem. Como o projeto ainda não tem
código, os gates ficam vazios (correto) e o refactor scan passa trivialmente.
O `.gitignore` é criado do zero com apenas o mínimo: state local, logs,
dependências, builds e editor/OS noise. O `.riteward/` fica versionado,
`logs/` fica ignorado (não faz parte do produto).

## Alternativas consideradas

1. **Criar o scaffold React + Vite já nesta task** — rejeitada: a
   task-setup tem escopo fechado na governança do Riteward (5 etapas), e
   misturar bootstrap de stack com setup de governança quebra o princípio
   de "1 passo = 1 commit" e "escopo fechado" do Riteward. Vira a próxima
   task.
2. **Configurar `quality_gates` com gates imaginados** (ex.: `npm test`)
   mesmo sem `package.json` — rejeitada: o `riteward check` falharia por
   falta do comando, e a constituição exige gates sincronizados com a
   realidade do projeto. Vazio é o estado correto agora.
3. **Usar `max_lines: 300` (sugestão do template da task)** — rejeitada:
   o projeto terá muitos arquivos JSON de dados de cartas (centenas de
   linhas cada), então 300 geraria falsos positivos. `500` (default) +
   `ignore_files` para `src/data/**/*.json` é mais adequado.

## Componentes do recurso

Nenhum componente afetado. A task toca apenas arquivos de governança:
`AGENTS.md`, `.riteward/config.yaml`, `.gitignore`, `logs/`, `README.md`
(criação opcional).

- `AGENTS.md` — raiz, modo: versão do usuário — veredito: afetado de
  propósito (adicionar contexto abaixo do bloco delimitado, bloco intacto).
- `.riteward/config.yaml` — raiz, modo: edição da seção `logs`/`refactor` —
  veredito: corrigido no escopo (ativar logs, ajustar ignore_files).
- `.riteward/riteward.md` — raiz, modo: referência do Riteward — veredito:
  mantido (não editado).

## Passos

1. **Etapa 1 — Enriquecer `AGENTS.md`**: adicionar abaixo do bloco
   delimitado (linhas 1–4) uma seção `# Projeto` com: nome (Axie Infinity
   Card Explorer), propósito (explorar cartas Axie Classic + Origin v3),
   stack (React + Vite + TypeScript, web), dados (JSON local em
   `src/data/`), comandos essenciais (a definir no bootstrap:
   `npm install`, `npm run dev`, `npm run build`, `npm test`). Bloco
   delimitado do Riteward (linhas 1–4) permanece intacto no topo.
   Como verificar: `grep -A4 "riteward:start" AGENTS.md` mostra o bloco;
   seção `# Projeto` aparece depois.

2. **Etapa 2 — Criar `logs/` e ativar o bloco `logs`**: criar
   `logs/errors.log` (vazio) e `logs/.gitkeep`. Descomentar e editar o
   bloco `logs` em `.riteward/config.yaml` com:
   ```yaml
   logs:
     files:
       - path: logs/errors.log
     ignore_patterns:
       - "DeprecationWarning"
       - "ExperimentalWarning"
   ```
   Como verificar: `riteward logs check` roda e reporta `logs/errors.log`
   monitorado (sem erros novos). `riteward config validate` passa.

3. **Etapa 3 — Configurar refactor scan**: editar `.riteward/config.yaml`,
   seção `refactor`: manter `max_lines: 500`, manter `ignore_dirs`
   (já tem `node_modules`, `dist`, `.git`, `.riteward`), adicionar
   `ignore_files: ["package-lock.json", "pnpm-lock.yaml", "yarn.lock",
   "src/data/**/*.json", "*.png", "logs/**"]`.
   Como verificar: `riteward refactor scan` retorna "Nenhum arquivo
   monolítico detectado" (sem falsos positivos futuros).

4. **Etapa 4 — Sincronizar quality gates**: manter `quality_gates: []`
   (vazio, porque não existe `package.json` com scripts ainda). Atualizar
   a seção `project` do config: `language: typescript`,
   `packageManager: npm`, `scripts.test/lint/typecheck: null`
   (mantidas null; o bootstrap preencherá).
   Como verificar: `riteward check` roda e termina verde (0 gates, 0
   falhas). `riteward config validate` passa.

5. **Criar `.gitignore`** (raiz): contendo apenas
   ```
   .riteward/state/
   logs/
   node_modules/
   dist/
   .gitkeep
   *.log
   .DS_Store
   .directory
   ```
   O `.riteward/` (menos `state/`) é versionado. `logs/` é ignorado.
   Os PNGs na raiz (`Ícone Axie...png`, `Mascote...png`,
   `Explorador...png`) e `.directory` (KDE desktop entry) — decisão:
   `.directory` é ignorado (noise de SO); PNGs são assets do usuário e
   devem ser versionados (o usuário os criou).
   Como verificar: `git status --porcelain` mostra `.gitignore`,
   `AGENTS.md`, `.riteward/` (menos state), `README.md`,
   `logs/errors.log` (se for versionado — mas `logs/` está em
   `.gitignore`, então não aparece), e os 3 PNGs como untracked.
   `git check-ignore .riteward/state/` retorna o caminho (confirmado
   ignorado); `git check-ignore .riteward/config.yaml` retorna vazio
   (não ignorado, versionado).

6. **Criar `README.md`** mínimo: nome do projeto, descrição (Card
   Explorer para Axie Infinity — Classic + Origin v3), stack
   (React + Vite + TS), como rodar (pendente do bootstrap:
   `npm install && npm run dev`), e nota que o bootstrap do scaffold
   React é a próxima task.
   Como verificar: `test -f README.md && head -5 README.md`.

7. **Comitar**: commitar tudo via `riteward workflow commit task-setup
   --message "chore: configura Riteward (AGENTS.md, logs, refactor scan,
   gitignore, README)"`. A task termina em `COMPLETED`.

## Riscos

- **Risco**: `.gitignore` ignorar `.riteward/` inteiro por engano.
  **Mitigação**: o `.gitignore` lista `.riteward/state/` (não
  `.riteward/`), e o passo 5 confere com `git check-ignore` antes do
  commit.
- **Risco**: `logs/errors.log` vazio ser ignorado por `logs/` no
  `.gitignore`, mas o `riteward logs check` precisar lê-lo.
  **Mitigação**: o `riteward logs check` lê o arquivo local (filesystem),
  não o repositório Git. O `.gitignore` só afeta o versionamento, não
  a leitura local. O arquivo existe no disco mesmo sem estar commitado.
- **Risco**: o `AGENTS.md` ficar com o bloco delimitado do Riteward
  quebrado. **Mitigação**: o passo 1 só adiciona conteúdo abaixo das
  linhas 1–4, nunca edita o bloco. Verificação: `grep -A4
  "riteward:start" AGENTS.md`.
- **Risco**: esquecer de criar `logs/errors.log` antes do `riteward
  logs check`. **Mitigação**: o passo 2 cria o arquivo vazio primeiro;
  o `riteward logs check` com arquivo vazio retorna "nenhum erro
  novo" (não erro de arquivo ausente).

## Critérios de sucesso

- [ ] `AGENTS.md` da raiz contém o contexto/propósito do projeto abaixo
      do bloco delimitado do Riteward, que permanece intacto no topo.
- [ ] `.riteward/riteward.md` preservado como referência operacional
      permanente (nada foi movido ou removido dele).
- [ ] Diretório de logs criado (`logs/errors.log`) e bloco `logs`
      configurado em `.riteward/config.yaml` com validação
      bem-sucedida via `riteward logs check`.
- [ ] Bloco `refactor` configurado em `.riteward/config.yaml`
      (`max_lines`, `ignore_dirs`, `ignore_files`) com validação
      bem-sucedida via `riteward refactor scan`.
- [ ] `quality_gates` em `.riteward/config.yaml` sincronizados com os
      scripts do projeto (vazio, por falta de `package.json`),
      validados com `riteward check`.
- [ ] `.riteward/` commitado (incluindo manifest.json); apenas
      `.riteward/state/` e logs locais ignorados no `.gitignore`.

## Revisões

- Iteração 1 (2026-11-08): auto-auditoria inicial — confirmei que os
  6 critérios de aceitação da task estão mapeados nos passos 1–6; os
  comandos citados (`riteward logs check`, `riteward refactor scan`,
  `riteward check`, `riteward config validate`, `git check-ignore`)
  existem; os arquivos citados (`AGENTS.md`, `.riteward/config.yaml`,
  `.gitignore`, `README.md`, `logs/errors.log`) existem ou serão criados
  pelos passos; alternativas foram pesadas e descartadas com motivo;
  nenhum placeholder restante.

## Aprovação

- [x] Plano auto-auditado (critérios mapeados, arquivos verificados e
      sem placeholders)
