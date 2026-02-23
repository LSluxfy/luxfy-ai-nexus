
# Corrigir Seletor de Idiomas no Cabecalho

## Problema Identificado

O componente `LiveNotifications` (notificacoes que aparecem no canto superior direito) esta posicionado com `z-[9999]` e `fixed top-4 right-2`. Mesmo quando a notificacao esta invisivel (`opacity-0`), o elemento continua interceptando cliques porque `opacity-0` nao remove eventos de pointer. Isso bloqueia o dropdown do seletor de idiomas que tem apenas `z-50`.

## Solucao

### 1. Corrigir LiveNotifications para nao bloquear cliques quando invisivel

**Arquivo**: `src/components/landing/LiveNotifications.tsx`
- Adicionar `pointer-events-none` quando `isVisible` for `false`
- Adicionar `pointer-events-auto` quando `isVisible` for `true`

### 2. Aumentar z-index do dropdown do LanguageSelector

**Arquivo**: `src/components/LanguageSelector.tsx`
- Passar `className="z-[10000]"` ao `DropdownMenuContent` para garantir que fique acima de qualquer notificacao

## Detalhes Tecnicos

| Arquivo | Alteracao |
|---------|----------|
| `src/components/landing/LiveNotifications.tsx` | Adicionar `pointer-events-none`/`pointer-events-auto` baseado em `isVisible` |
| `src/components/LanguageSelector.tsx` | Adicionar `className="z-[10000]"` ao `DropdownMenuContent` |
