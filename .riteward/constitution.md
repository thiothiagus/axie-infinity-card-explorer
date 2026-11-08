# Constituição do projeto

Este documento define os princípios, regras e políticas de desenvolvimento do projeto.

## Princípios

- Simplicidade: preferir soluções simples e compreensíveis.
- Clareza: código e texto devem ser legíveis por humanos.
- Qualidade: mudanças devem passar pelos quality gates do projeto.
- Consistência: seguir os workflows e templates definidos pelo Riteward.

## Regras

- Não executar git push ou deploy sem pedido explícito do usuário. Merge e delete da branch da tarefa após `COMPLETED` já estão autorizados pela aprovação do usuário no REVIEW — sem novo pedido (exceto com `permissions.review_approval: false` no `.riteward/config.yaml`, quando exigem autorização explícita do usuário).
- Na FINALIZATION, atualizar a documentação do projeto-alvo sobre o que a task entregou (`README.md`, `CHANGELOG.md`, `docs/`, auto-detectados; criar a entrada quando não existir) e fazer o bump de versão SemVer pelo que a task fez (correção → patch, funcionalidade compatível → minor, quebra → major), incluindo tudo no commit final.
- Manter o histórico de commits limpo e descritivo.
- Proporcionalidade no ciclo: não crie tasks completas para correções simples e óbvias (typos, 1 linha de correção, bugs pontuais com causa conhecida e diff < 20 linhas). Nesses casos, use o fluxo Quickfix (`riteward task create "título" --quickfix`) ou resolva dentro da sessão ativa.
- Respeitar o workflow de tarefa definido em `.riteward/workflows/executing-tasks.md` (fonte normativa do passo a passo).
- Manter os `quality_gates` em `.riteward/config.yaml` sincronizados com os scripts e ferramentas do projeto. Sempre que houver mudança em scripts, devDependencies ou configs de qualidade, atualize os gates e valide com `riteward check`.
