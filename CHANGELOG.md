# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [Unreleased]

### Added
- Expansão do dataset com 30 cartas Axie Classic reais (de 6 para 30 cartas)
- 24 novas cartas autênticas distribuídas balanceadamente entre as 6 classes (Plant, Bird, Aquatic, Bug, Reptile, Beast)
- Cada classe agora possui 5 cartas representativas com stats completos, habilidades e metadados
- Suite completa de testes automatizados para validação do dataset (`src/data/cards.test.ts`)
- Documentação abrangente da fonte e estrutura dos dados em `src/data/README.md`
- Script auxiliar para extração de cartas (`scripts/extract-classic-cards.ts`)

### Changed
- Dataset de cartas Classic expandido de 6 cartas fictícias para 30 cartas reais baseadas em fontes verificáveis
- Total de cartas no explorador: 222 (30 Classic + 192 Origin v3)

### Technical
- Todas as cartas Classic possuem `skills` preenchidas (nenhuma vazia)
- Distribuição balanceada garantida: 5 cartas por classe
- Estrutura validada com 14 testes automatizados
- Compatibilidade total com tipos TypeScript existentes mantida

## [0.5.0] - 2026-11-08

_Versão base do projeto com 6 cartas Classic fictícias e 192 cartas Origin v3._
