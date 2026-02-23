

# Plano: 3 Alteracoes na Landing Page

## 1. Botao "Comenzar ahora" -> "Habla con el Agente Lux" (redirecionar para WhatsApp)

**Arquivo**: `src/components/landing/HeroSectionOptimized.tsx`
- Alterar o `onClick` do botao CTA para abrir o WhatsApp (mesmo link usado no `WhatsAppButton.tsx`: `https://wa.me/5511967136762`) em vez de abrir o formulario `LeadCaptureModal`
- Remover o state `leadModalOpen` e o componente `LeadCaptureModal` (ja que nao sera mais usado neste componente)

**Arquivos de traducao** (`es.json`, `pt.json`, `en.json`):
- Alterar `hero.cta` de "Comenzar ahora" para "Habla con el Agente Lux" (e equivalentes nos outros idiomas)

## 2. Remover secao "Resultados Reales de Nuestros Clientes"

**Arquivo**: `src/pages/LandingPage.tsx`
- Remover a linha `<LazyRealResults />` (linha 239)
- Remover o import de `LazyRealResults` (linha 21)

## 3. Otimizar ComparisonTable para mobile

**Arquivo**: `src/components/landing/ComparisonTable.tsx`

Layout atual usa `grid-cols-3` fixo que fica apertado em mobile. Alteracoes:
- Em mobile: trocar para layout de cards empilhados (cada feature vira um card com "Humano" e "IA" lado a lado dentro do card)
- Em desktop: manter o layout de tabela atual com `grid-cols-3`
- Ajustar tamanhos de fonte e padding para telas pequenas
- O header da tabela tambem sera adaptado para mobile

### Detalhes tecnicos do layout mobile

Cada item de comparacao sera renderizado como um card individual em mobile:

```text
+---------------------------+
| Disponibilidade           |
+---------------------------+
| Humano: Horario comercial |  (vermelho)
| IA: 24/7 sem parar        |  (verde)
+---------------------------+
```

Em desktop (md+), mantem o grid de 3 colunas como esta hoje.

## Arquivos a Modificar

| Arquivo | Acao |
|---------|------|
| `src/components/landing/HeroSectionOptimized.tsx` | Botao CTA abre WhatsApp |
| `src/locales/es.json` | `hero.cta` -> "Habla con el Agente Lux" |
| `src/locales/pt.json` | `hero.cta` -> "Fale com o Agente Lux" |
| `src/locales/en.json` | `hero.cta` -> "Talk to Agent Lux" |
| `src/pages/LandingPage.tsx` | Remover LazyRealResults |
| `src/components/landing/ComparisonTable.tsx` | Layout responsivo mobile |

