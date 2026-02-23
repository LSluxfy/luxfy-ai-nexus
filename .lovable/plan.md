

# Reestruturar Secao de Precos - 3 Planos Distintos

## Resumo

Cada plano tera sua propria lista de features com icones especificos, o plano Pro ficara visualmente destacado, e a frase "ideal para..." sera movida para abaixo do preco como subtitulo.

## Alteracoes nos Arquivos de Traducao

### `src/locales/es.json` - Novas chaves de features
```
"understandsImages": "Comprende imágenes"
"understandsVoice": "Comprende notas de voz"
"officialWhatsApp": "WhatsApp API oficial"
"advancedManagement": "Gestión avanzada"
"initialOptimization": "Optimización inicial incluida"
"allFromPro": "Todo lo del Pro"
```

Alterar `plans.pro.desc` para: "Para vender todos los días sin límites"
Alterar `plans.teams.desc` para: "Para equipos en crecimiento"
Alterar `plans.start.desc` para: "Para empezar"
Adicionar `plans.pro.highlight: true` (ja existe, manter)

### `src/locales/pt.json` - Equivalentes em portugues
```
"understandsImages": "Compreende imagens"
"understandsVoice": "Compreende notas de voz"
"officialWhatsApp": "WhatsApp API oficial"
"advancedManagement": "Gestão avançada"
"initialOptimization": "Otimização inicial incluída"
"allFromPro": "Tudo do Pro"
```

### `src/locales/en.json` - Equivalentes em ingles
```
"understandsImages": "Understands images"
"understandsVoice": "Understands voice notes"
"officialWhatsApp": "Official WhatsApp API"
"advancedManagement": "Advanced management"
"initialOptimization": "Initial optimization included"
"allFromPro": "Everything from Pro"
```

## Alteracoes no Componente `PricingV2.tsx`

### 1. Mover "idealForStart" para subtitulo abaixo do preco (plano Start)
- Remover `idealForStart` da lista de features do Start
- Exibir como texto com icone Pin abaixo do preco/desc no CardHeader

### 2. Criar lista de features separada para cada plano

**Start:**
1. Check - 1 agente (ja existe)
2. Check - Agente de IA entrenable
3. Check - CRM visual con Kanban
4. AlertTriangle - Tokens de IA limitados
5. X - Sin soporte prioritario
6. X - Sin garantia de costos fijos

**Pro:**
1. Check - 3 agentes
2. Infinity - Tokens de IA ILIMITADOS
3. Check - CRM visual con Kanban
4. Check - Agenda
5. Check - Comprende imagenes
6. Check - Comprende notas de voz
7. Check - Soporte prioritario

**Teams:**
1. Check - 6 agentes
2. Check - Todo lo del Pro
3. Infinity - Tokens IA ILIMITADOS
4. Check - WhatsApp API oficial
5. Check - Gestion avanzada
6. Check - Soporte prioritario
7. Check - Optimizacion inicial incluida

### 3. Destacar visualmente o plano Pro
- Adicionar `scale-105` e `md:scale-110` ao Card do Pro
- Aumentar sombra e borda com gradiente
- Badge "Mas vendido" ja existe com `animate-pulse`
- Adicionar `ring-2 ring-primary` para destaque extra

### 4. Mostrar subtitulo com Pin abaixo do preco em cada plano
- Start: "Ideal para pruebas y bajo volumen"
- Pro: "Para vender todos los dias sin limites"
- Teams: "Para equipos en crecimiento"

## Arquivos a Modificar

| Arquivo | Alteracao |
|---------|----------|
| `src/components/landing/PricingV2.tsx` | Reestruturar features por plano, destacar Pro, mover subtitulo |
| `src/locales/es.json` | Adicionar novas chaves de features, atualizar desc dos planos |
| `src/locales/pt.json` | Adicionar novas chaves de features, atualizar desc dos planos |
| `src/locales/en.json` | Adicionar novas chaves de features, atualizar desc dos planos |

