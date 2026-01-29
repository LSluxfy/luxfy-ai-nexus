

# Plan: Ajustes na Página de Vendas (Landing Page)

## Resumo das Alterações

Este plano cobre todas as modificações solicitadas para a página de vendas, incluindo remoção de seções, alterações de texto, reordenação de componentes e atualização de conteúdo.

---

## 1. Remoção de Seções

### 1.1 Remover Calculadora de ROI
- **Arquivo**: `src/pages/LandingPage.tsx`
- **Ação**: Remover o componente `LazyROICalculator` e seu import
- **Impacto**: A seção de calculadora de ROI não será mais exibida

### 1.2 Remover Garantia de 7 Dias  
- **Arquivo**: `src/pages/LandingPage.tsx`
- **Ação**: Remover o componente `Guarantee` e seu import
- **Impacto**: A seção de garantia não será mais exibida

---

## 2. Alterações no Cabeçalho (Navbar)

### 2.1 Substituir "Características" por "Benefícios"
- **Arquivos de tradução**:
  - `src/locales/es.json`: Alterar `nav.features` de "Características" para "Beneficios"
  - `src/locales/pt.json`: Alterar `nav.features` de "Recursos" para "Benefícios"
  - `src/locales/en.json`: Alterar `nav.features` de "Features" para "Benefits"

---

## 3. Alterações no FAQ

### 3.1 Remover pergunta sobre "prova grátis"
- **Arquivos de tradução**: `src/locales/pt.json`, `src/locales/es.json`, `src/locales/en.json`
- **Ação**: Remover a entrada `faq.q4` (pergunta sobre teste grátis) e renumerar as perguntas
- **Arquivo componente**: `src/components/landing/FAQ.tsx`
- **Ação**: Ajustar o array de itens para ter 4 perguntas em vez de 5

---

## 4. Substituir Seção de Comparação

### 4.1 Mudar título e estrutura da tabela de comparação
- **Arquivo**: `src/components/landing/ComparisonTable.tsx`
- **Ação**: Redesenhar a tabela para formato "Humano vs Inteligência Artificial"
- **Nova estrutura**:
  - Título: "Humano vs Inteligência Artificial"
  - Duas colunas comparando características humanas vs IA
  - Adicionar frase destacada abaixo: "Tu competencia no duerme: usa IA 24/7. Quien responde primero, vende más."

- **Arquivos de tradução**: Atualizar textos em todas as 3 línguas

---

## 5. Reordenar Seções - Depoimentos Antes dos Preços

### 5.1 Mover Testimonials para antes do Pricing
- **Arquivo**: `src/pages/LandingPage.tsx`
- **Ação**: Reordenar os componentes para que `LazyTestimonials` apareça antes de `LazyPricingV2`

**Nova ordem das seções:**
1. Hero
2. Video
3. Features
4. RealResults
5. HowItWorks
6. BeforeAfter
7. ComparisonTable (Humano vs IA)
8. **Testimonials** (movido para cima)
9. **Pricing**
10. FAQ
11. Footer

---

## 6. Ajustar Benefícios dos Planos

### 6.1 Atualizar plano START com novos benefícios
- **Arquivo**: `src/components/landing/PricingV2.tsx`
- **Ação**: Modificar a lógica de features para exibir os novos benefícios do plano Start

**Novo conteúdo para o plano START:**
```text
START – Para empezar
✅ 1 agente
✅ IA entrenable  
✅ CRM visual con Kanban
⚠️ Tokens de IA limitados
❌ Sin soporte prioritario
❌ Sin garantía de costos fijos
📌 Ideal para pruebas y bajo volumen
```

- **Arquivos de tradução**: Adicionar novas chaves para os textos específicos do plano Start

---

## 7. Alterar Texto do Botão CTA

### 7.1 Mudar "Começar agora" para "Habla con el Agente Lux"
- **Arquivos de tradução**: 
  - `src/locales/es.json`: `pricingV2.cta` = "Habla con el Agente Lux"
  - `src/locales/pt.json`: `pricingV2.cta` = "Fale com o Agente Lux"
  - `src/locales/en.json`: `pricingV2.cta` = "Talk to Agent Lux"

---

## 8. Alterar Headline Principal

### 8.1 Nova frase para o Hero
- **Arquivos de tradução** (hero.title, hero.subtitle, hero.description):

**Novo conteúdo:**
```text
Título: "Reduza custos operacionais e aumente suas vendas com IA no WhatsApp."
Subtítulo: "Converta leads e ofereça suporte ao cliente 24/7, sem depender de equipe."
```

- **Arquivo**: `src/components/landing/HeroSectionOptimized.tsx`
- **Ação**: Ajustar a estrutura do componente para o novo formato de headline

---

## 9. Correção do Erro de Build (Testimonials)

### 9.1 Corrigir erro de tipo no embla-carousel-autoplay
- **Arquivo**: `src/components/landing/Testimonials.tsx`
- **Ação**: Corrigir a incompatibilidade de tipos do plugin Autoplay
- **Solução**: Usar type assertion ou atualizar a forma de instanciar o plugin

---

## Detalhes Técnicos

### Arquivos a serem modificados:

| Arquivo | Modificações |
|---------|-------------|
| `src/pages/LandingPage.tsx` | Remover ROI Calculator, Guarantee; Reordenar Testimonials |
| `src/components/landing/FAQ.tsx` | Reduzir para 4 perguntas |
| `src/components/landing/ComparisonTable.tsx` | Nova estrutura Humano vs IA |
| `src/components/landing/PricingV2.tsx` | Novos benefícios do plano Start |
| `src/components/landing/HeroSectionOptimized.tsx` | Nova headline |
| `src/components/landing/Testimonials.tsx` | Fix do erro de tipo |
| `src/locales/pt.json` | Todas as traduções PT |
| `src/locales/es.json` | Todas as traduções ES |
| `src/locales/en.json` | Todas as traduções EN |

### Componentes/imports a remover:
- `LazyROICalculator` (import e uso)
- `Guarantee` (import e uso)

### Novas chaves de tradução necessárias:
- `comparison.humanVsAi` - Nova estrutura de comparação
- `comparison.competitorPhrase` - "Tu competencia no duerme..."
- `pricingV2.features.tokensLimited` - "Tokens de IA limitados"
- `pricingV2.features.noPrioritySupport` - "Sin soporte prioritario"
- `pricingV2.features.noFixedCosts` - "Sin garantía de costos fijos"
- `pricingV2.features.idealFor` - "Ideal para pruebas y bajo volumen"

