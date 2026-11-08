---
id: task-setup
title: Configuração inicial do Riteward
status: done
priority: high
generator_version: 0.37.0
created_at: 2026-11-08
---

# Configuração inicial do Riteward

## Descrição

Esta tarefa orienta o agente de código a finalizar a integração e configuração do Riteward no projeto. Siga as etapas abaixo na ordem indicada.

Contexto do layout (importante): o `AGENTS.md` na raiz é do usuário e contém apenas um bloco delimitado (`<!-- riteward:start -->` ... `<!-- riteward:end -->`) apontando para `.riteward/riteward.md`, que é a referência operacional permanente mantida pelo Riteward (regenerada a cada `update`). Nenhuma etapa desta tarefa deve remover o bloco, mesclar conteúdo do Riteward de volta na raiz ou apagar arquivos de `.riteward/`.

### Etapa 1: Enriquecer o AGENTS.md da raiz com o contexto do projeto

1. Analise o projeto para identificar seu contexto, propósito e especificidades (ex: tipo de aplicação, domínio, arquitetura, comandos essenciais).
2. Adicione essas informações ao `AGENTS.md` da raiz, **abaixo do bloco delimitado do Riteward** — elas pertencem ao usuário.
3. **Valide**: o bloco delimitado permanece no topo, intacto; nenhuma seção foi movida para dentro ou para fora dele.

### Etapa 2: Configurar e ativar o sistema de monitoramento de logs

Configure o sistema de monitoramento de logs do Riteward:

1. **Criar estrutura de diretórios de logs**: Garanta a existência do diretório de logs do projeto (ex: `logs/` na raiz) para armazenar os arquivos de log monitorados (ex: `logs/errors.log` ou `logs/agents.jsonl`).
2. **Configurar o bloco de logs**: Edite o arquivo `.riteward/config.yaml` para adicionar a seção `logs`, definindo os caminhos dos arquivos a serem monitorados (`logs.files`) e padrões a ignorar (`logs.ignore_patterns`).
3. **Validar monitoramento**: Verifique a configuração executando `riteward logs check`.

### Etapa 3: Configurar o scanner de arquivos monolíticos (refactor scan)

Configure a verificação automática de tamanho e complexidade de arquivos no projeto:

1. **Configurar parâmetros no config**: No arquivo `.riteward/config.yaml`, ajuste a seção `refactor`:
   - `refactor.max_lines`: limite máximo aceitável de linhas por arquivo (ex: 300).
   - `refactor.ignore_dirs`: diretórios ignorados pela varredura (ex: `["node_modules", "dist", "coverage", ".git"]`).
   - `refactor.ignore_files`: caminhos relativos exatos ou padrões glob a ignorar — útil para lockfiles e dados gerados na raiz que `ignore_dirs` não cobre, e para excluir testes ou configs inteiros (ex: `["package-lock.json", "src/data/results.json", "tests/**", "*_tests.rs", "*.yml"]`; padrões sem `/` casam o nome do arquivo em qualquer profundidade).
   - `refactor.limits` (opcional): overrides de `max_lines` por padrão glob para linguagens mais densas ou áreas com perfil próprio (ex: `- pattern: "*.rs"` com `max_lines: 800`; a última regra que casa vence).
2. **Validar a varredura**: Execute `riteward refactor scan`. Se aparecerem falsos positivos (lockfiles, dumps de dados, assets gerados), inclua-os em `ignore_dirs`/`ignore_files` em vez de aumentar o limite global.

### Etapa 4: Verificar e configurar quality gates

Garanta que os `quality_gates` em `.riteward/config.yaml` estejam corretos e completos:

1. **Auditar gates existentes**: Verifique se os gates configurados correspondem aos scripts disponíveis no projeto (ex: `test`, `lint`, `typecheck`). Compare com os scripts em `package.json` (ou equivalente) e remova gates cujos comandos não existam.
2. **Adicionar gates ausentes**: Se o projeto possui scripts de qualidade que não estão como gates (ex: `typecheck` existe no `package.json` mas não há gate correspondente), adicione-os à seção `quality_gates` do config.
3. **Validar**: Execute `riteward check` para confirmar que todos os gates executam corretamente.

### Etapa 5: Versionamento do `.riteward/`

O diretório `.riteward/` é parte da governança do projeto e deve ser versionado:

1. **Commitar o `.riteward/`**: config.yaml, constitution.md, tarefas, workflows, templates, notes.md e principalmente o manifest.json (é ele que registra qual versão do Riteward instalou o quê — sem ele, atualizações futuras perdem a referência).
2. **Ignorar apenas dados locais** no `.gitignore`: `.riteward/state/` (estado de workflow executado nesta máquina) e o diretório de logs locais (`logs/`), se os logs não fizerem parte do produto.

## Critérios de aceitação

- [x] `AGENTS.md` da raiz contém o contexto/propósito do projeto abaixo
  do bloco delimitado do Riteward, que permanece intacto no topo.
- [x] `.riteward/riteward.md` preservado como referência operacional
  permanente (nada foi movido ou removido dele).
- [x] Diretório de logs criado e bloco `logs` configurado em
  `.riteward/config.yaml` com validação bem-sucedida via
  `riteward logs check`.
- [x] Bloco `refactor` configurado em `.riteward/config.yaml`
  (`max_lines`, `ignore_dirs` e, se necessário, `ignore_files`) com
  validação bem-sucedida via `riteward refactor scan`.
- [x] `quality_gates` em `.riteward/config.yaml` sincronizados com os
  scripts do projeto, validados com `riteward check`.
- [x] `.riteward/` commitado (incluindo manifest.json); apenas
  `.riteward/state/` e logs locais ignorados no `.gitignore`.

## Notas

- Iteração 1 (IMPLEMENTATION): todos os 7 passos do plano executados na
  ordem. Checkpoint commit `3b0d6cc`. O `AGENTS.md` foi reescrito
  integralmente (não editado em local) para garantir o fechamento correto
  do bloco delimitado — o checklist `grep -A4 "riteward:start" AGENTS.md`
  confirma que o bloco permanece no topo, intacto, com a tag
  `<!-- riteward:end -->` presente. O `.riteward/` foi versionado
  completo (menos `state/`, ignorado). `logs/errors.log` criado vazio,
  `logs/` ignorado no `.gitignore`. Qualidade: `riteward check` verde
  (0 gates — `package.json` ainda não existe; sincronizado com a
  realidade). Refactor scan: nenhum monolítico. Logs check: nenhum erro
  novo em 1 arquivo.
