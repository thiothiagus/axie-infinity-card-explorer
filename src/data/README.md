# Dataset de Cartas - Axie Infinity Card Explorer

## Fonte dos Dados

### Cartas Axie Classic (30 cartas)

- **Fonte**: Curadoria manual baseada em documentação oficial e guias da comunidade
- **Método de extração**: Compilação estruturada de dados verificáveis de cartas Classic autênticas
- **Data da extração**: 2026-11-08
- **Fontes consultadas**:
  - Guias oficiais de gameplay Axie Infinity Classic
  - Documentação da comunidade (axie.zone, axieworld.com)
  - Repositórios oficiais Sky Mavis (axieinfinity/cc-axie-gtk2d)

### Cartas Axie Origin v3 (192 cartas)

- **Fonte**: Dataset pré-existente no projeto
- **Método**: Importadas de versão anterior do projeto
- **Estrutura**: Cartas Origin v3 com image hash e part específica

## Estrutura do Dataset

O arquivo `cards.json` contém um array de objetos `Card` com a seguinte estrutura:

```typescript
interface Card {
  id: string                    // Identificador único (ex: "axie-classic-plant-pumpkin")
  name: string                  // Nome da carta (ex: "Pumpkin")
  generation: 'classic' | 'origin-v3'  // Geração do jogo
  axieClass: string             // Classe: Plant, Bird, Aquatic, Bug, Reptile, Beast
  part: string | null           // Parte do corpo: Horn, Mouth, Back, Tail ou null
  tier: string | null           // Tier: A, B, C, S ou null
  image: string | null          // Hash da imagem ou null
  stats: Stats | null           // Stats para cartas Classic, null para Origin v3
  skills: string[]              // Array de descrições textuais das habilidades
  description?: string          // Descrição opcional da carta
  energyCost?: number           // Custo de energia (opcional)
  actionType?: 'Melee' | 'Ranged' | 'Support'  // Tipo de ação (opcional)
}

interface Stats {
  HP: number   // Health Points
  MOV: number  // Movement/Speed
  ATK: number  // Attack
  DEF: number  // Defense
}
```

## Contagem por Classe (Axie Classic)

| Classe   | Quantidade | Exemplos                                  |
|----------|------------|-------------------------------------------|
| Plant    | 5 cartas   | Pumpkin, Serious, Carrot, Zigzag         |
| Aquatic  | 5 cartas   | Tail Slap, Nimo, Risky Fish, Goldfish    |
| Beast    | 5 cartas   | Nut Crack, Imp, Ronin, Cottontail        |
| Bird     | 5 cartas   | Eggbomb, Eggshell, Blackmail             |
| Bug      | 5 cartas   | Parasite, Antenna, Scarab, Grub          |
| Reptile  | 5 cartas   | Tiny Turtle, Cerastes, Bone Sail, Gila   |
| **Total**| **30 cartas** | Distribuição balanceada (5 por classe) |

## Características das Cartas Classic

- ✅ Todas as cartas possuem `stats` válidos (HP, MOV, ATK, DEF)
- ✅ Todas as cartas possuem `skills` preenchidas (nenhuma vazia)
- ✅ Todas as 6 classes do Axie Classic estão representadas
- ✅ Distribuição balanceada: 5 cartas por classe
- ✅ IDs únicos seguindo padrão `axie-classic-{class}-{name-slug}`
- ✅ Partes do corpo mapeadas (Horn, Mouth, Back, Tail)
- ✅ Tiers classificados (A, B, C, S)
- ✅ Energy cost e action type definidos quando aplicável

## Validação e Testes

O dataset é validado por uma suite completa de testes automatizados em `src/data/cards.test.ts`:

- ✅ Quantidade mínima de cartas (>= 20)
- ✅ Todas as 6 classes representadas
- ✅ Distribuição balanceada por classe
- ✅ Estrutura válida para todas as cartas
- ✅ Nenhuma carta com skills vazio
- ✅ IDs únicos no dataset completo
- ✅ Valores numéricos válidos em stats
- ✅ Tipos válidos para todos os campos

Execute os testes com:

```bash
npm test src/data/cards.test.ts
```

## Atualização Futura

Para atualizar o dataset de cartas Classic:

1. Consulte fontes oficiais atualizadas (Card Explorer oficial, patch notes)
2. Adicione novas cartas em `scripts/cards-classic.json` seguindo a estrutura existente
3. Execute a validação de tipagem: `npm run typecheck`
4. Execute os testes: `npm test src/data/cards.test.ts`
5. Atualize este README com a nova data de extração e contagem

## Licença e Uso

Os dados das cartas são propriedade intelectual da Sky Mavis (Axie Infinity). Este dataset é compilado para fins educacionais e de desenvolvimento de ferramentas da comunidade. Não use para fins comerciais sem autorização apropriada.

## Histórico de Versões

- **2026-11-08**: Expansão de 6 para 30 cartas Axie Classic com curadoria manual
  - Adicionadas 24 cartas autênticas distribuídas balanceadamente entre as 6 classes
  - Implementada suite completa de testes automatizados
  - Cartas Origin v3 (192) preservadas intactas
