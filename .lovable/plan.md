

# Plano: Restaurar Headline com Efeito Typewriter + Nova Subheadline

## Alteracoes

### 1. Restaurar headline com efeito de digitacao

O componente `HeroSectionOptimized.tsx` ja possui toda a logica do typewriter (variaveis `displayText`, `currentWordIndex`, etc.), mas atualmente o titulo usa apenas `t('hero.title')` sem incorporar o efeito.

**Arquivo**: `src/components/landing/HeroSectionOptimized.tsx`
- Alterar o `<h1>` para exibir: "Clone seu melhor **{displayText}** com IA" usando o efeito typewriter ja existente
- O `displayText` alterna entre as palavras definidas em `hero.words` (vendedor, SDR, agente)

### 2. Atualizar textos de traducao

**Arquivo**: `src/locales/es.json`
- `hero.title` -> "Clona tu mejor" (prefixo)
- `hero.titleSuffix` -> "con IA" (sufixo)
- `hero.description` -> "Reduce costos operativos y aumenta tus ventas con IA en WhatsApp. Convierte leads y ofrece soporte al cliente 24/7, sin depender de equipo."

**Arquivo**: `src/locales/pt.json`
- `hero.title` -> "Clone seu melhor"
- `hero.titleSuffix` -> "com IA"
- `hero.description` -> "Reduza custos operacionais e aumente suas vendas com IA no WhatsApp. Converta leads e ofereca suporte ao cliente 24/7, sem depender de equipe."

**Arquivo**: `src/locales/en.json`
- `hero.title` -> "Clone your best"
- `hero.titleSuffix` -> "with AI"
- `hero.description` -> "Reduce operational costs and increase your sales with AI on WhatsApp. Convert leads and offer 24/7 customer support, without depending on a team."

### 3. Resultado esperado

A headline ficara com o formato:

**"Clone seu melhor** vendedor | SDR | agente **com IA"**

Com a palavra do meio alternando com efeito de digitacao, e abaixo a nova subheadline com o texto completo sobre reducao de custos.

## Detalhes Tecnicos

| Arquivo | Acao |
|---------|------|
| `src/components/landing/HeroSectionOptimized.tsx` | Alterar JSX do `h1` para incluir `displayText` com efeito typewriter |
| `src/locales/es.json` | Atualizar `hero.title`, adicionar `hero.titleSuffix`, atualizar `hero.description` |
| `src/locales/pt.json` | Atualizar `hero.title`, adicionar `hero.titleSuffix`, atualizar `hero.description` |
| `src/locales/en.json` | Atualizar `hero.title`, adicionar `hero.titleSuffix`, atualizar `hero.description` |

