

# Alteracoes na Landing Page: Botao Video + Botoes Pricing

## 1. Botao "Comenzar ahora" na secao do video -> redirecionar para precos

**Arquivo**: `src/pages/LandingPage.tsx` (linha 175)
- Trocar `onClick={() => setLeadModalOpen(true)}` por `onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}`
- Remover o state `leadModalOpen`, o import de `useState` (se nao usado em outro lugar), o componente `LeadCaptureModal` e seu import

## 2. Botoes da secao de precos -> "Comenzar ahora" redirecionando para /register

**Arquivo**: `src/components/landing/PricingV2.tsx` (linhas 158-170)
- Trocar o `onClick` que chama `checkoutUrlStripe` por um link simples para `/register`
- Remover a funcao `checkoutUrlStripe` e o import de `api`

**Arquivos de traducao** (`es.json`, `pt.json`, `en.json`):
- Alterar `pricingV2.cta`:
  - ES: "Comenzar ahora"
  - PT: "Comecar agora"
  - EN: "Get started"

## Resumo das alteracoes

| Arquivo | Alteracao |
|---------|----------|
| `src/pages/LandingPage.tsx` | Botao do video faz scroll para `#pricing`; remover LeadCaptureModal |
| `src/components/landing/PricingV2.tsx` | Botoes redirecionam para `/register`; remover logica Stripe |
| `src/locales/es.json` | `pricingV2.cta` -> "Comenzar ahora" |
| `src/locales/pt.json` | `pricingV2.cta` -> "Comecar agora" |
| `src/locales/en.json` | `pricingV2.cta` -> "Get started" |

